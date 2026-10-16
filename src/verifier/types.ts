import type { Middleware } from '@middleware/module';
import type { Plugin } from '@plugin/module';
import type { Route } from '@route/module';

export namespace $Verifier {
    export type MiddlewareRules = readonly Rule<Middleware>[];
    export type PluginRules = readonly Rule<Plugin>[];
    export type RouteRules = readonly Rule<Route>[];

    export type Rule<Target> = readonly [AnyConstructor<Target>, keyof Target & string, RegExp];
    // oxlint-disable-next-line typescript/no-explicit-any
    export type AnyConstructor<Instance = any> = new (...args: any[]) => Instance;
}
