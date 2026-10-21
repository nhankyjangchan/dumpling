import { Middleware } from '@middleware/module';
import { Plugin } from '@plugin/module';
import { Route } from '@route/module';
import { verifierCodes, verifierRules } from './private';
import type { $Verifier } from './types';

/**
 * I strongly disagree with the notion that namespaces are an anti-pattern or an obsolete feature in
 * TypeScript. I don’t want to have a massive number of exports per file; I need a way to group code
 * while still controlling its external accessibility. There are three possible approaches, and
 * namespaces are the best of them. I might consider using IIFEs in the future, though.
 */
export namespace Verifier {
    export function verifyPlugins(...targets: readonly unknown[]): string {
        let messages: string = '';
        for (const target of targets) {
            messages += _verifyPlugin(target);
        }
        return messages;
    }

    function _verifyPlugin(target: unknown): string {
        if (!(target instanceof Plugin)) {
            return verifierCodes.invalidInstance(Plugin);
        }
        if (target.status !== 'ready') {
            return `"${target.name}" must be "ready" to be verified;`;
        }
        return _verifyPluginMembers(target);
    }

    function _verifyPluginMembers(plugin: Plugin): string {
        let messages: string = _verifyRules(plugin, verifierRules.forPlugin);
        const [routes, middlewares] = [[...plugin.routes], [...plugin.middlewares]];
        const hasMiddleware: boolean = _hasPluginMiddlewares(routes, middlewares);
        messages += hasMiddleware
            ? verifyMiddlewares(...middlewares)
            : '"Plugin|Route.middlewares" must contain at least one instance;';
        messages +=
            routes.length > 0
                ? verifyRoutes(...routes)
                : verifierCodes.requiredEntity('routes', Plugin);
        return messages;
    }

    /**
     * Each method call creates a new iterator, which then has to be converted into an array in
     * order to be traversed. While the overhead is minor, it still bothers me; that is why this
     * method receives pre-constructed arrays of routes and middleware, rather than the plugin
     * instance itself.
     */
    function _hasPluginMiddlewares(
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

    export function verifyRoutes(...targets: readonly unknown[]): string {
        let messages: string = '';
        for (const target of targets) {
            messages += _verifyRoute(target);
        }
        return messages;
    }

    function _verifyRoute(target: unknown): string {
        let messages: string = '';
        if (!(target instanceof Route)) {
            return verifierCodes.invalidInstance(Route);
        }
        messages += _verifyRules(target, verifierRules.forRoute);
        if (!Array.isArray(target.middlewares)) {
            return messages + verifierCodes.invalidMember('middlewares', Route);
        }
        // oxlint-disable-next-line typescript/no-unsafe-argument
        return messages + verifyMiddlewares(...target.middlewares);
    }

    export function verifyMiddlewares(...targets: readonly unknown[]): string {
        let messages: string = '';
        for (const target of targets) {
            messages += _verifyMiddleware(target);
        }
        return messages;
    }

    function _verifyMiddleware(target: unknown): string {
        let messages: string = '';
        if (!(target instanceof Middleware)) {
            return verifierCodes.invalidInstance(Middleware);
        }
        messages += _verifyRules(target, verifierRules.forMiddleware);
        if (typeof target.handler !== 'function') {
            messages += verifierCodes.invalidMember('handler', Middleware);
        }
        return messages;
    }

    function _verifyRules<Target extends object>(
        target: Target,
        rules: readonly $Verifier.Rule<Target>[]
    ): string {
        let messages: string = '';
        for (const [ClassRef, member, pattern] of rules) {
            if (typeof target[member] !== 'string' || !pattern.test(target[member])) {
                messages += verifierCodes.invalidMember(member, ClassRef);
            }
        }
        return messages;
    }
}
