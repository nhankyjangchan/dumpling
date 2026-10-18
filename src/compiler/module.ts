import { RequestContext } from '@http/request-context/module';
import { Verifier } from '@verifier/module';
import { CompilerError } from './errors';
import type { Middleware, $Middleware } from '@middleware/index';
import type { Plugin } from '@plugin/module';
import type { Route } from '@route/module';
import type { $Compiler } from './types';

export namespace Compiler {
    export function merge(...routes: readonly $Compiler.ServeRoutes[]): $Compiler.ServeRoutes {
        const merged: $Compiler.ServeRoutes = {};
        for (const route of routes) {
            for (const [path, methods] of Object.entries(route)) {
                if (Object.hasOwn(merged, path)) {
                    throw new CompilerError(`"${path}" already registered;`);
                }
                // @ts-expect-error Minor issues with type narrowing
                merged[path] = methods;
            }
        }
        return merged;
    }

    export function compile(plugin: Plugin): $Compiler.ServeRoutes {
        const errors: string = Verifier.verifyPlugins(plugin);
        if (errors.length > 0) {
            const message: string = errors.split(';').join('\n');
            throw new CompilerError(message);
        }
        const routes: $Compiler.ServeRoutes = {};
        for (const route of plugin.routes) {
            // @ts-expect-error Minor issues with type narrowing
            (routes[route.path] ??= {})[route.method] = _compileRoute(plugin, route);
        }
        return routes;
    }

    function _compileRoute(plugin: Plugin, route: Route): $Compiler.ServeHandler {
        const middlewares: Middleware[] = [...plugin.middlewares, ...route.middlewares];
        const composer: $Compiler.Composer = _composeMiddlewares(middlewares);
        const code: string = _generateCode(composer);
        const { params, args } = _createSegments(composer);
        // oxlint-disable-next-line typescript/no-unsafe-return typescript/no-unsafe-call
        return new Function(...params, code)(RequestContext, plugin, ...args);
    }

    function _composeMiddlewares(middlewares: readonly Middleware[]): $Compiler.Composer {
        const composer: $Compiler.Composer = { onRequest: [], onResponse: [], onError: [] };
        for (const middleware of middlewares) {
            if (middleware.hook === 'onRequest') {
                composer.onRequest.push(middleware);
            } else if (middleware.hook === 'onResponse') {
                composer.onResponse.push(middleware);
            } else {
                composer.onError.push(middleware);
            }
        }
        return composer;
    }

    function _generateCode(composer: $Compiler.Composer): string {
        const isAsync: boolean = _isSomeMiddlewareAsync(composer);
        const body: string = _generateBody(composer);
        return `return ${isAsync ? 'async ' : ''}(request, server) => {\n${body}\n};\n`;
    }

    function _isSomeMiddlewareAsync({
        onRequest,
        onResponse,
        onError
    }: $Compiler.Composer): boolean {
        for (const middleware of [...onRequest, ...onResponse, ...onError]) {
            if (middleware.mode === 'async') {
                return true;
            }
        }
        return false;
    }

    function _generateBody({ onRequest, onResponse, onError }: $Compiler.Composer): string {
        const onResponseOffset: number = onRequest.length;
        const onErrorOffset: number = onResponseOffset + onResponse.length;
        const lines: string[] = [
            'const rc = new RC({ app, request, server });',
            'try {',
            _generateCalls(onRequest, 0),
            _generateCalls(onResponse, onResponseOffset),
            'return rc.build();',
            '} catch (e) {',
            'rc.catched = e;',
            _generateCalls(onError, onErrorOffset),
            `return rc.error.response.build();`,
            '}'
        ];
        return lines.filter(Boolean).join('\n');
    }

    function _generateCalls(middlewares: readonly Middleware[], offset: number): string {
        const calls: string[] = middlewares.map((mdw: Middleware, id: number): string =>
            _generateCall(offset + id, mdw)
        );
        return calls.join('\n');
    }

    function _generateCall(id: number, middleware: Middleware): string {
        const { mode, flow } = middleware;
        const awaitPrefix: '' | 'await ' = mode === 'async' ? 'await ' : '';
        const name = `middleware${id}`;
        if (flow === 'pass') {
            return `${awaitPrefix}${name}(rc);`;
        }
        return (
            `const ${name}_r = ${awaitPrefix}${name}(rc);\n`
            + `if (${name}_r instanceof Response) return ${name}_r;`
        );
    }

    function _createSegments({
        onRequest,
        onResponse,
        onError
    }: $Compiler.Composer): $Compiler.Segments {
        const segments: [string[], $Middleware.Handler[]] = [[], []];
        for (const [id, mdw] of Object.entries([...onRequest, ...onResponse, ...onError])) {
            segments[0].push(`middleware${id}`);
            segments[1].push(mdw.handler);
        }
        return { params: ['RC', 'app', ...segments[0]], args: segments[1] };
    }
}
