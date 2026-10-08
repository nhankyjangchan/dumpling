import { RequestContext } from '@http';
import type { Plugin } from '@plugin';
import type { Route } from '@route';
import type { Middleware, $Middleware } from '@middleware';
import type { $Compiler } from './types.mts';

export class Compiler {
    private constructor() {}

    public static compile(plugin: Plugin): $Compiler.ServeRoutes {
        const routes: $Compiler.ServeRoutes = {};
        for (const route of plugin.routes) {
            // @ts-expect-error Minor issues with type narrowing
            (routes[route.path] ??= {})[route.method] = Compiler.#compileRoute(plugin, route);
        }
        return routes;
    }

    static #compileRoute(plugin: Plugin, route: Route): $Compiler.ServeHandler {
        const middlewares: Middleware[] = [...plugin.middlewares, ...route.middlewares];
        const composer: $Compiler.Composer = Compiler.#composeMiddlewares(middlewares);
        const code: string = Compiler.#generateCode(composer);
        const { params, args } = Compiler.#createSegments(composer);
        // oxlint-disable-next-line typescript/no-unsafe-return typescript/no-unsafe-call
        return new Function(...params, code)(RequestContext, plugin, ...args);
    }

    static #composeMiddlewares(middlewares: readonly Middleware[]): $Compiler.Composer {
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

    static #generateCode(composer: $Compiler.Composer): string {
        const isAsync: boolean = Compiler.#isSomeMiddlewareAsync(composer);
        const body: string = Compiler.#generateBody(composer);
        return `return ${isAsync ? 'async ' : ''}(req, ser) => {\n${body}\n};\n`;
    }

    static #isSomeMiddlewareAsync({ onRequest, onResponse, onError }: $Compiler.Composer): boolean {
        for (const middleware of [...onRequest, ...onResponse, ...onError]) {
            if (middleware.mode === 'async') {
                return true;
            }
        }
        return false;
    }

    static #generateBody({ onRequest, onResponse, onError }: $Compiler.Composer): string {
        const onResponseOffset: number = onRequest.length;
        const onErrorOffset: number = onResponseOffset + onResponse.length;
        const lines: string[] = [
            'const rc = new RC(app, req, ser);',
            'try {',
            Compiler.#generateСalls(onRequest, 0),
            Compiler.#generateСalls(onResponse, onResponseOffset),
            'return rc.response.build();',
            '} catch (e) {',
            'rc.catched = e;',
            Compiler.#generateСalls(onError, onErrorOffset),
            `return rc.error.response.build();`,
            '}'
        ];
        return lines.filter(Boolean).join('\n');
    }

    static #generateСalls(middlewares: readonly Middleware[], offset: number): string {
        const calls: string[] = middlewares.map((mdw: Middleware, id: number): string =>
            Compiler.#generateCall(offset + id, mdw)
        );
        return calls.join('\n');
    }

    static #generateCall(id: number, middleware: Middleware): string {
        const { mode, flow } = middleware;
        const callType: '' | 'await ' = mode === 'async' ? 'await ' : '';
        const name = `middleware${id}`;
        if (flow === 'pass') {
            return `${callType}${name}(rc);`;
        }
        return (
            `const ${name}_r = ${callType}${name}(rc);\n`
            + `if (${name}_r instanceof Response) return ${name}_r;`
        );
    }

    static #createSegments({
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
