import { RequestContext } from '@http';
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
            (routes[route.path] ??= {})[route.method] = Compiler.#compileRoute(plugin, route);
        }
        return routes;
    }

    static #compileRoute(plugin: Plugin, route: Route): $Compiler.ServeHandler {
        const middlewares: Middleware[] = [...plugin.middlewares, ...route.middlewares];
        const composer: $Compiler.MiddlewareComposer = Compiler.#createMiddlewareComposer();
        for (const middleware of middlewares) {
            if (middleware.hook === 'onRequest') {
                composer.onRequest.push(middleware);
            } else if (middleware.hook === 'onResponse') {
                composer.onResponse.push(middleware);
            } else {
                composer.onError.push(middleware);
            }
        }
        const argNames: string[] = Compiler.#createArgNames(composer);
        const argValues: unknown[] = Compiler.#createArgValues(composer);
        const isAsync: boolean = Compiler.#isSomeMiddlewareAsync(middlewares);
        const body: string = Compiler.#generateBody(composer);
        const code = `return ${isAsync ? 'async ' : ''}(req, ser) => {\n${body}\n};\n`;
        const factory = new Function(...argNames, code);
        return factory(RequestContext, plugin, ...argValues);
    }

    static #createMiddlewareComposer(): $Compiler.MiddlewareComposer {
        return {
            onRequest: [],
            onResponse: [],
            onError: []
        };
    }

    static #isSomeMiddlewareAsync(middlewares: readonly Middleware[]): boolean {
        return middlewares.some((mdw: Middleware): boolean => mdw.mode === 'async');
    }

    static #createArgNames(composer: $Compiler.MiddlewareComposer): string[] {
        return [
            'RC',
            'app',
            ...composer.onRequest.map((_mdw: Middleware, index: number): string => `req_${index}`),
            ...composer.onResponse.map((_mdw: Middleware, index: number): string => `res_${index}`),
            ...composer.onError.map((_mdw: Middleware, index: number): string => `err_${index}`)
        ];
    }

    static #createArgValues(composer: $Compiler.MiddlewareComposer): unknown[] {
        return [
            ...composer.onRequest.map((mdw: Middleware): $Middleware.Handler => mdw.handler),
            ...composer.onResponse.map((mdw: Middleware): $Middleware.Handler => mdw.handler),
            ...composer.onError.map((mdw: Middleware): $Middleware.Handler => mdw.handler)
        ];
    }

    static #generateBody(composer: $Compiler.MiddlewareComposer): string {
        const lines: string[] = [
            'const rc = new RC(app, req, ser);',
            'try {',
            Compiler.#generateСalls('req', composer.onRequest),
            Compiler.#generateСalls('res', composer.onResponse),
            'return rc.response.build();',
            '} catch (e) {',
            'rc.error = e;',
            Compiler.#generateСalls('err', composer.onError),
            `return rc.error.response.build();`,
            '}'
        ];
        return lines.filter(Boolean).join('\n');
    }

    static #generateСalls(prefix: string, middlewares: readonly Middleware[]): string {
        const calls: string[] = middlewares.map((mdw: Middleware, index: number): string => {
            return Compiler.#generateCall(`${prefix}_${index}`, mdw);
        });
        return calls.join('\n');
    }

    static #generateCall(name: string, middleware: Middleware): string {
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
