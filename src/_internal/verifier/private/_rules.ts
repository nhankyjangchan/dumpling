import { Middleware } from '~entities/middleware/module';
import { Plugin } from '~entities/plugin/module';
import { Route } from '~entities/route/module';

export const verifierRules = {
    forMiddleware: [
        [Middleware, 'name', /^[a-z0-9_-]+@middleware$/i],
        [Middleware, 'hook', /^on(?:Request|Response|Error)$/],
        [Middleware, 'mode', /^(?:async|sync)$/],
        [Middleware, 'flow', /^(?:halt|pass)$/]
    ],
    forRoute: [
        [Route, 'name', /^[a-z0-9_-]+@route$/i],
        [Route, 'path', /^\//],
        [Route, 'method', /^(?:GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)$/]
    ],
    forPlugin: [
        [Plugin, 'name', /^[a-z0-9_-]+@plugin$/i],
        [Plugin, 'scope', /^(?:self|global)$/]
    ]
} as const;
