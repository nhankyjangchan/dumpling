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
        const { names, values } = Compiler.#createSegments(composer);
        const isAsync: boolean = Compiler.#isSomeMiddlewareAsync(middlewares);
        const code: string = Compiler.#generateCode(isAsync, composer);
        const factory = new Function(...names, code);
        return factory(RequestContext, plugin, ...values);
    }

    static #createMiddlewareComposer(): $Compiler.MiddlewareComposer {
        return {
            onRequest: [],
            onResponse: [],
            onError: []
        };
    }

    static #createSegments(composer: $Compiler.MiddlewareComposer): $Compiler.Segments {
        const { onRequest, onResponse, onError } = composer;
        const segments: [string[], $Middleware.Handler[]] = [[], []];
        onRequest.forEach((mdw: Middleware, index: number): void => {
            segments[0].push(`req_${index}`);
            segments[1].push(mdw.handler);
        });
        onResponse.forEach((mdw: Middleware, index: number): void => {
            segments[0].push(`res_${index}`);
            segments[1].push(mdw.handler);
        });
        onError.forEach((mdw: Middleware, index: number): void => {
            segments[0].push(`err_${index}`);
            segments[1].push(mdw.handler);
        });
        return {
            names: ['RC', 'app', ...segments[0]],
            values: segments[1]
        };
    }

    static #isSomeMiddlewareAsync(middlewares: readonly Middleware[]): boolean {
        return middlewares.some((mdw: Middleware): boolean => mdw.mode === 'async');
    }

    static #generateCode(isAsync: boolean, composer: $Compiler.MiddlewareComposer): string {
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
        const body: string = lines.filter(Boolean).join('\n');
        return `return ${isAsync ? 'async ' : ''}(req, ser) => {\n${body}\n};\n`;
    }

    static #generateСalls(prefix: string, middlewares: readonly Middleware[]): string {
        const calls: string[] = middlewares.map((mdw: Middleware, index: number): string =>
            Compiler.#generateCall(`${prefix}_${index}`, mdw)
        );
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
