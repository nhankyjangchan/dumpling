import type { Dumpling } from '@application';
import type { Middleware } from '@middleware';
import type { Route } from '@route';
import { RequestContext, HttpError } from '@http';

const ROUTINE_ERROR_HEADER: string = 'X-routine-Error';

type ServeHandler = Bun.Serve.Handler<any, any, any>;
type ServeRoutes = Bun.Serve.Routes<unknown, string>;

export class JITCompiler {
    readonly #plugin: Dumpling;
    #compiled?: ServeRoutes;

    public constructor(plugin: Dumpling) {
        this.#plugin = plugin;
    }

    public compile(): ServeRoutes {
        if (this.#compiled) {
            return this.#compiled;
        }
        const routes: Record<string, Record<string, unknown>> = {};
        for (const route of this.#plugin.routes) {
            const spaceIndex: number = route.name.indexOf(' ');
            const method: string = route.name.slice(0, spaceIndex);
            const path: string = route.name.slice(spaceIndex + 1);
            (routes[method] ??= {})[path] = this.#compileRoute(route);
        }
        this.#compiled = routes as ServeRoutes;
        return this.#compiled;
    }

    #compileRoute(route: Route): ServeHandler {
        const all: readonly Middleware[] = [...this.#plugin.middlewares, ...route.use];
        const onRequest: Middleware[] = [];
        const onResponse: Middleware[] = [];
        const onError: Middleware[] = [];
        for (const middleware of all) {
            switch (middleware.manifest.hook) {
                case 'onRequest':
                    onRequest.push(middleware);
                    break;
                case 'onResponse':
                    onResponse.push(middleware);
                    break;
                case 'onError':
                    onError.push(middleware);
                    break;
            }
        }
        const isAsync: boolean = route.type === 'async';
        const argNames: string[] = [
            'RC',
            'HttpError',
            'app',
            'handler',
            ...onRequest.map((_, i) => `req_${i}`),
            ...onResponse.map((_, i) => `res_${i}`),
            ...onError.map((_, i) => `err_${i}`)
        ];
        const argValues: unknown[] = [
            RequestContext,
            HttpError,
            this.#plugin,
            route.handler,
            ...onRequest.map((m) => m.handler),
            ...onResponse.map((m) => m.handler),
            ...onError.map((m) => m.handler)
        ];
        const body: string = this.#generateBody(onRequest, onResponse, onError);
        const code: string =
            `return ${isAsync ? 'async ' : ''}(req, ser) => {\n${body}\n};\n`
            + `//# sourceURL=dumpling://${route.name}`;
        const factory = new Function(...argNames, code);
        return factory(...argValues) as ServeHandler;
    }

    #generateBody(
        onRequest: readonly Middleware[],
        onResponse: readonly Middleware[],
        onError: readonly Middleware[]
    ): string {
        const lines: string[] = [
            'const rc = new RC(app, req, ser);',
            'try {',
            this.#generateHook('req', onRequest),
            'handler(rc);',
            this.#generateHook('res', onResponse),
            'return rc.response.toResponse();',
            '} catch (e) {',
            'const err = e instanceof HttpError ? e : HttpError.fromUnknown(e);',
            'rc.error = err;',
            this.#generateHook('err', onError),
            `return new Response(null, { status: 500, headers: { "${ROUTINE_ERROR_HEADER}": "true" } });`,
            '}'
        ];
        return lines.filter(Boolean).join('\n');
    }

    #generateHook(prefix: string, middlewares: readonly Middleware[]): string {
        return middlewares
            .map((mw: Middleware, index: number): string =>
                this.#generateMiddlewareCall(`${prefix}_${index}`, mw)
            )
            .join('\n');
    }

    #generateMiddlewareCall(varName: string, mw: Middleware): string {
        const { type } = mw.manifest;
        const isAsync: boolean = type.startsWith('async');
        const isCheck: boolean = type.endsWith('check');
        const awaitKw: '' | 'await ' = isAsync ? 'await ' : '';
        if (!isCheck) {
            return `${awaitKw}${varName}(rc);`;
        }
        return (
            `const ${varName}_r = ${awaitKw}${varName}(rc);\n`
            + `if (${varName}_r instanceof Response) return ${varName}_r;`
        );
    }
}
