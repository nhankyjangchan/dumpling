import { Middleware } from '@middleware/index';
import { Plugin } from '@plugin/index';
import { Route } from '@route/index';
import { verifierCodes, verifierRules } from './internals';
import type { $Verifier } from './types.mts';

export class Verifier {
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
            return verifierCodes.invalidInstance(Plugin);
        }
        if (target.status !== 'ready') {
            return verifierCodes.invalidMember('status', Plugin);
        }
        const [routes, middlewares] = [[...target.routes], [...target.middlewares]];
        messages += Verifier.#verifyPluginMembers(target, routes, middlewares);
        if (routes.length === 0) {
            messages += verifierCodes.requiredEntity('routes', Plugin);
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
            Verifier.#verifyRules(plugin, verifierRules.forPlugin)
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
            return verifierCodes.invalidInstance(Route);
        }
        messages += Verifier.#verifyRules(target, verifierRules.forRoute);
        if (!Array.isArray(target.middlewares)) {
            return messages + verifierCodes.invalidMember('middlewares', Route);
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
            return verifierCodes.invalidInstance(Middleware);
        }
        messages += Verifier.#verifyRules(target, verifierRules.forMiddleware);
        if (typeof target.handler !== 'function') {
            messages += verifierCodes.invalidMember('handler', Middleware);
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
