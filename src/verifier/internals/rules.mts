import { Middleware } from '@middleware/index';
import { Plugin } from '@plugin/index';
import { Route } from '@route/index';
import type { $Verifier } from '@verifier/types.mts';

export namespace verifierRules {
    export const forMiddleware: $Verifier.MiddlewareRules = [
        [Middleware, 'name', /^[a-z0-9_-]+@middleware$/i],
        [Middleware, 'hook', /^on(?:Request|Response|Error)$/],
        [Middleware, 'mode', /^(?:async|sync)$/],
        [Middleware, 'flow', /^(?:halt|pass)$/]
    ];

    export const forRoute: $Verifier.RouteRules = [
        [Route, 'name', /^[a-z0-9_-]+@route$/i],
        [Route, 'path', /^\//],
        [Route, 'method', /^(?:GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)$/]
    ];

    export const forPlugin: $Verifier.PluginRules = [
        [Plugin, 'name', /^[a-z0-9_-]+@plugin$/i],
        [Plugin, 'scope', /^(?:self|global)$/]
    ];
}
