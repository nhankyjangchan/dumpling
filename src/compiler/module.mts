import { RequestContext } from '@http';
import { CompilerError } from './errors.mts';
import type { Plugin } from '@plugin';
import type { Route } from '@route';
import type { Middleware, $Middleware } from '@middleware';
import type { $Compiler } from './types.mts';

export class Compiler {
    static readonly #R_NAME_RE = /^[a-z0-9_-]@route$/i;
    static readonly #R_METHOD_RE = /^(?:'GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS')$/;

    static readonly #M_NAME_RE = /^[a-z0-9_-]@middleware$/i;
    static readonly #M_HOOK_RE = /^on(?:Request|Response|Error)$/;
    static readonly #M_MODE_RE = /^(?:async|sync)$/;
    static readonly #M_FLOW_RE = /^(?:halt|pass)$/;

    private constructor() {
        throw new CompilerError('The compiler does not support the `new` instruction;');
    }

    public static merge(...routes: $Compiler.ServeRoutes[]): $Compiler.ServeRoutes {
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

    public static compile(plugin: Plugin): $Compiler.ServeRoutes {
        Compiler.check(plugin);
        const routes: $Compiler.ServeRoutes = {};
        for (const route of plugin.routes) {
            // @ts-expect-error Minor issues with type narrowing
            (routes[route.path] ??= {})[route.method] = Compiler.#compileRoute(plugin, route);
        }
        return routes;
    }

    public static check(plugin: Plugin): void {
        let errors: string = '';
        errors += Compiler.#checkRoutes([...plugin.routes]);
        errors += Compiler.#checkMiddlewares([...plugin.middlewares]);
        if (errors.length > 1) {
            const message: string = errors.split(';').join('\n');
            throw new CompilerError(message);
        }
    }

    static #checkRoutes(routes: readonly Route[]): string {
        let errors: string = '';
        for (const route of routes) {
            const { name, path, method, middlewares } = route;
            Compiler.#R_NAME_RE.test(name) || (errors += `R_ERR: Invalid name: ${name};`);
            Compiler.#R_METHOD_RE.test(method)
                || (errors += `R_ERR: Invalid method type: ${method};`);
            path.startsWith('/') || (errors += `R_ERR: Invalid path: ${path};`);
            errors += Compiler.#checkMiddlewares(middlewares);
        }
        return errors;
    }

    static #checkMiddlewares(middlewares: readonly Middleware[]): string {
        let errors: string = '';
        for (const mdw of middlewares) {
            const { name, hook, mode, flow, handler } = mdw;
            Compiler.#M_NAME_RE.test(name) || (errors += `M_ERR: Invalid name: ${name};`);
            Compiler.#M_HOOK_RE.test(hook) || (errors += `M_ERR: Invalid hook: ${hook};`);
            Compiler.#M_MODE_RE.test(mode) || (errors += `M_ERR: Invalid mode: ${mode};`);
            Compiler.#M_FLOW_RE.test(flow) || (errors += `M_ERR: Invalid flow: ${flow};`);
            typeof handler === 'function'
                || (errors += `M_ERR: Invalid handler type: ${typeof handler};`);
        }
        return errors;
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
            'return rc.build();',
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
