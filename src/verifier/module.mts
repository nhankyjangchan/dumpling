import { Middleware } from '@middleware';
import { Plugin } from '@plugin';
import { Route } from '@route';
import type { $Verifier } from './types.mts';

const codes = {
    INVALID_INSTANCE(className: Function): string {
        return `Invalid instance received: "${className.name}" instance was expected;`;
    },
    INVALID_MEMBER(member: string, className: Function): string {
        return `Invalid value was received for member "${member}" of instance "${className.name}";`;
    },
    REQUIRED_ENTITY(member: string, className: Function): string {
        return `"${className.name}.${member}" must contain at least one instance;`;
    }
} as const;

export class Verifier {
    static readonly #MIDDLEWARE_RULES: $Verifier.MiddlewareRules = [
        ['name', /^[a-z0-9_-]+@middleware$/i],
        ['hook', /^on(?:Request|Response|Error)$/],
        ['mode', /^(?:async|sync)$/],
        ['flow', /^(?:halt|pass)$/]
    ];

    static readonly #ROUTE_RULES: $Verifier.RouteRules = [
        ['name', /^[a-z0-9_-]+@route$/i],
        ['path', /^\//],
        ['method', /^(?:'GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS')$/]
    ];

    static readonly #PLUGIN_RULES: $Verifier.PluginRules = [
        ['name', /^[a-z0-9_-]+@plugin$/i],
        ['scope', /^(?:self|global)$/]
    ];

    public static verifyPlugins(...targets: unknown[]): string {
        let messages: string = '';
        for (const target of targets) {
            messages += Verifier.#verifyPlugin(target);
        }
        return messages;
    }

    static #verifyPlugin(target: unknown): string {
        let messages: string = '';
        if (!(target instanceof Plugin)) {
            return (messages += codes.INVALID_INSTANCE(Plugin));
        }
        for (const [member, pattern] of Verifier.#PLUGIN_RULES) {
            if (typeof target[member] !== 'string' || !pattern.test(target[member])) {
                messages += codes.INVALID_MEMBER(member, Plugin);
            }
        }
        const [routes, middlewares] = [[...target.routes], [...target.middlewares]] as const;
        messages += Verifier.verifyRoutes(...routes);
        messages += Verifier.verifyMiddlewares(...middlewares);
        let routeHasMiddlewares: boolean = false;
        for (const route of routes) {
            if (route.middlewares.length > 0) {
                routeHasMiddlewares = true;
                break;
            }
        }
        return routes.length < 1
            ? messages + codes.REQUIRED_ENTITY('routes', Route)
            : routeHasMiddlewares || messages.length > 1
              ? messages
              : 'Plugin|Route.middlewares must contain at least one instance;';
    }

    public static verifyRoutes(...targets: unknown[]): string {
        let messages: string = '';
        for (const target of targets) {
            messages += Verifier.#verifyRoute(target);
        }
        return messages;
    }

    static #verifyRoute(target: unknown): string {
        let messages: string = '';
        if (!(target instanceof Route)) {
            return codes.INVALID_INSTANCE(Route);
        }
        for (const [member, pattern] of Verifier.#ROUTE_RULES) {
            if (typeof target[member] !== 'string' || !pattern.test(target[member])) {
                messages += codes.INVALID_MEMBER(member, Route);
            }
        }
        if (!Array.isArray(target.middlewares)) {
            return messages + codes.INVALID_MEMBER('middlewares', Route);
        }
        return messages + Verifier.verifyMiddlewares(...target.middlewares);
    }

    public static verifyMiddlewares(...targets: unknown[]): string {
        let messages: string = '';
        for (const target of targets) {
            messages += Verifier.#verifyMiddleware(target);
        }
        return messages;
    }

    static #verifyMiddleware(target: unknown): string {
        let messages: string = '';
        if (!(target instanceof Middleware)) {
            return codes.INVALID_INSTANCE(Middleware);
        }
        for (const [member, pattern] of Verifier.#MIDDLEWARE_RULES) {
            if (typeof target[member] !== 'string' || !pattern.test(target[member])) {
                messages += codes.INVALID_MEMBER(member, Middleware);
            }
        }
        if (typeof target.handler !== 'function') {
            messages += codes.INVALID_MEMBER('handler', Middleware);
        }
        return messages;
    }
}
