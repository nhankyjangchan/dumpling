import type { Middleware } from '@middleware';
import type { Plugin } from '@plugin';
import type { Route } from '@route';

export namespace $Verifier {
    export type PluginRules = readonly Rule<Plugin>[];
    export type RouteRules = readonly Rule<Route>[];
    export type MiddlewareRules = readonly Rule<Middleware>[];

    export type Rule<Target extends object> = readonly [string, keyof Target & string, RegExp];
}
