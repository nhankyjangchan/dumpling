import type { Middleware } from '@middleware/index';
import type { Plugin } from '@plugin/index';
import type { Route } from '@route/index';

export namespace $Verifier {
    export type PluginRules = readonly Rule<Plugin>[];
    export type RouteRules = readonly Rule<Route>[];
    export type MiddlewareRules = readonly Rule<Middleware>[];

    export type Rule<Target> = readonly [AnyConstructor<Target>, keyof Target & string, RegExp];
    // oxlint-disable-next-line typescript/no-explicit-any
    export type AnyConstructor<Instance = any> = new (...args: any[]) => Instance;
}
