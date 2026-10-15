import { Middleware } from '@middleware';
import { Plugin } from '@plugin';
import { Route } from '@route';
import { verifierCodes } from './codes.mts';
import type { $Verifier } from './types.mts';

export class Verifier {
    private constructor() {
        throw new Error('The verifier does not support the `new` instruction;');
    }

    static readonly #MIDDLEWARE_RULES: $Verifier.MiddlewareRules = [
        [Middleware.name, 'name', /^[a-z0-9_-]+@middleware$/i],
        [Middleware.name, 'hook', /^on(?:Request|Response|Error)$/],
        [Middleware.name, 'mode', /^(?:async|sync)$/],
        [Middleware.name, 'flow', /^(?:halt|pass)$/]
    ];

    static readonly #ROUTE_RULES: $Verifier.RouteRules = [
        [Route.name, 'name', /^[a-z0-9_-]+@route$/i],
        [Route.name, 'path', /^\//],
        [Route.name, 'method', /^(?:GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)$/]
    ];

    static readonly #PLUGIN_RULES: $Verifier.PluginRules = [
        [Plugin.name, 'name', /^[a-z0-9_-]+@plugin$/i],
        [Plugin.name, 'scope', /^(?:self|global)$/]
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
            return verifierCodes.invalidInstance(Plugin.name);
        }
        if (target.status !== 'ready') {
            return verifierCodes.invalidMember('status', Plugin.name);
        }
        const [routes, middlewares] = [[...target.routes], [...target.middlewares]];
        messages += Verifier.#verifyPluginMembers(target, routes, middlewares);
        if (routes.length === 0) {
            messages += verifierCodes.requiredEntity('routes', Route.name);
        }
        const hasMiddleware: boolean = Verifier.#hasPluginMiddlewares(routes, middlewares);
        if (!hasMiddleware) {
            messages += '"Plugin|Route.middlewares" must contain at least one instance;';
        }
        return messages;
    }

    /**
     * Each method call creates a new iterator, which then has to be converted into an array in
     * order to be traversed. While the overhead is minor, it still bothers me; that is why this
     * method receives pre-constructed arrays of routes and middleware, rather than the plugin
     * instance itself.
     */
    static #verifyPluginMembers(
        plugin: Plugin,
        routes: readonly Route[],
        middlewares: readonly Middleware[]
    ): string {
        return (
            Verifier.#verifyRules(plugin, Verifier.#PLUGIN_RULES)
            + Verifier.verifyRoutes(...routes)
            + Verifier.verifyMiddlewares(...middlewares)
        );
    }

    /**
     * Each method call creates a new iterator, which then has to be converted into an array in
     * order to be traversed. While the overhead is minor, it still bothers me; that is why this
     * method receives pre-constructed arrays of routes and middleware, rather than the plugin
     * instance itself.
     */
    static #hasPluginMiddlewares(
        routes: readonly Route[],
        middlewares: readonly Middleware[]
    ): boolean {
        for (const route of routes) {
            if (route.middlewares.length > 0) {
                return true;
            }
        }
        return middlewares.length > 0;
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
            return verifierCodes.invalidInstance(Route.name);
        }
        messages += Verifier.#verifyRules(target, Verifier.#ROUTE_RULES);
        if (!Array.isArray(target.middlewares)) {
            return messages + verifierCodes.invalidMember('middlewares', Route.name);
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
            return verifierCodes.invalidInstance(Middleware.name);
        }
        messages += Verifier.#verifyRules(target, Verifier.#MIDDLEWARE_RULES);
        if (typeof target.handler !== 'function') {
            messages += verifierCodes.invalidMember('handler', Middleware.name);
        }
        return messages;
    }

    static #verifyRules<Target extends object>(
        target: Target,
        rules: readonly $Verifier.Rule<Target>[]
    ): string {
        let messages: string = '';
        for (const [className, member, pattern] of rules) {
            if (typeof target[member] !== 'string' || !pattern.test(target[member])) {
                messages += verifierCodes.invalidMember(member, className);
            }
        }
        return messages;
    }
}
