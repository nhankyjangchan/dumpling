import { Middleware } from '@middleware/module';
import { Plugin } from '@plugin/module';
import { Route } from '@route/module';
import type { $Verifier } from '@verifier/types';

export namespace verifierRules {
    export const forMiddleware: $Verifier.MiddlewareRules = [
        [Middleware, 'name', /^[a-z0-9_-]+@middleware$/i],
        [Middleware, 'hook', /^on(?:Request|Response|Error)$/],
        [Middleware, 'mode', /^(?:async|sync)$/],
        [Middleware, 'flow', /^(?:halt|pass)$/]
    ];

    export const forPlugin: $Verifier.PluginRules = [
        [Plugin, 'name', /^[a-z0-9_-]+@plugin$/i],
        [Plugin, 'scope', /^(?:self|global)$/]
    ];

    export const forRoute: $Verifier.RouteRules = [
        [Route, 'name', /^[a-z0-9_-]+@route$/i],
        [Route, 'path', /^\//],
        [Route, 'method', /^(?:GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)$/]
    ];
}
