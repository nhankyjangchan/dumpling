import { RequestContext, HttpError } from '@http';
import type { Middleware, $Middleware } from '@middleware';
import type { Plugin } from '@plugin';
import type { Route } from '@route';
import type { $Compiler } from './types.mts';

export class Compiler {
    private constructor() {}

    public static compile(plugin: Plugin): $Compiler.ServeRoutes {
        const routes: $Compiler.ServeRoutes = {};
        for (const route of plugin.routes) {
            // @ts-ignore
            (routes[route.method] ??= {})[route.path] = Compiler.#compileRoute(plugin, route);
        }
        return routes;
    }

    static #compileRoute(plugin: Plugin, route: Route): $Compiler.ServeHandler {
        const middlewares: Middleware[] = [...plugin.middlewares, ...route.middlewares];
        const onRequest: Middleware[] = [];
        const onResponse: Middleware[] = [];
        const onError: Middleware[] = [];
        for (const middleware of middlewares) {
            if (middleware.hook === 'onRequest') {
                onRequest.push(middleware);
            } else if (middleware.hook === 'onResponse') {
                onResponse.push(middleware);
            } else {
                onError.push(middleware);
            }
        }
        const isAsync: boolean = middlewares.some(
            (mdw: Middleware): boolean => mdw.mode === 'async'
        );
        const argNames: string[] = Compiler.#createArgNames(onRequest, onResponse, onError);
        const argValues: unknown[] = Compiler.#createArgValues(
            plugin,
            onRequest,
            onResponse,
            onError
        );
        const body: string = Compiler.#generateBody(onRequest, onResponse, onError);
        const code: string =
            `return ${isAsync ? 'async ' : ''}(req, ser) => {\n${body}\n};\n`
            + `//# sourceURL=dumpling://${route.name}`;
        const factory = new Function(...argNames, code);
        return factory(...argValues);
    }

    static #createArgNames(
        onRequest: Middleware[],
        onResponse: Middleware[],
        onError: Middleware[]
    ): string[] {
        return [
            'RC',
            'HttpError',
            'app',
            'handler',
            ...onRequest.map((_mdw: Middleware, index: number): string => `req_${index}`),
            ...onResponse.map((_mdw: Middleware, index: number): string => `res_${index}`),
            ...onError.map((_mdw: Middleware, index: number): string => `err_${index}`)
        ];
    }

    static #createArgValues(
        plugin: Plugin,
        onRequest: Middleware[],
        onResponse: Middleware[],
        onError: Middleware[]
    ): unknown[] {
        return [
            RequestContext,
            HttpError,
            plugin,
            ...onRequest.map((mdw: Middleware): $Middleware.Handler => mdw.handler),
            ...onResponse.map((mdw: Middleware): $Middleware.Handler => mdw.handler),
            ...onError.map((mdw: Middleware): $Middleware.Handler => mdw.handler)
        ];
    }

    static #generateBody(
        onRequest: readonly Middleware[],
        onResponse: readonly Middleware[],
        onError: readonly Middleware[]
    ): string {
        const lines: string[] = [
            'const rc = new RC(app, req, ser);',
            'try {',
            Compiler.#generateHook('req', onRequest),
            Compiler.#generateHook('res', onResponse),
            'return rc.response.build();',
            '} catch (e) {',
            'rc.error = e;',
            Compiler.#generateHook('err', onError),
            `return rc.error.response.build();`,
            '}'
        ];
        return lines.filter(Boolean).join('\n');
    }

    static #generateHook(prefix: string, middlewares: readonly Middleware[]): string {
        return middlewares
            .map((mdw: Middleware, index: number): string =>
                Compiler.#generateMiddlewareCall(`${prefix}_${index}`, mdw)
            )
            .join('\n');
    }

    static #generateMiddlewareCall(name: string, middleware: Middleware): string {
        const { mode, flow } = middleware;
        const executionType: '' | 'await ' = mode === 'async' ? 'await ' : '';
        if (flow === 'pass') {
            return `${executionType}${name}(rc);`;
        }
        return (
            `const ${name}_r = ${executionType}${name}(rc);\n`
            + `if (${name}_r instanceof Response) return ${name}_r;`
        );
    }
}
