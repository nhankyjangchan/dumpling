import type { Middleware } from '@middleware';
import type { Plugin } from '@plugin';
import type { Route } from '@route';

export namespace $Verifier {
    export type PluginRules = readonly [keyof Plugin, RegExp][];
    export type RouteRules = readonly [keyof Route, RegExp][];
    export type MiddlewareRules = readonly [keyof Middleware, RegExp][];
}
