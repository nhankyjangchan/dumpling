import { Middleware, MiddlewareError, type $Middleware } from '@middleware';
import { Route, RouteError, type $Route } from '@route';
import { PluginError } from './errors.mts';
import type { $Plugin } from './types.mts';

export class Dumpling extends EventTarget {
    readonly #name: $Plugin.Name;
    readonly #scope: $Plugin.Scope;

    readonly #middlewares: Map<$Middleware.Name, Middleware>;
    readonly #plugins: Map<$Plugin.Name, Dumpling>;
    readonly #routes: Map<$Route.Name, Route>;

    #isReady: boolean = false;

    public constructor(init: $Plugin.Init) {
        super();
        this.#name = init.name;
        this.#scope = init.scope;
        this.#middlewares = new Map();
        this.#plugins = new Map();
        this.#routes = new Map();
    }

    public get name(): $Plugin.Name {
        return this.#name;
    }

    public get scope(): $Plugin.Scope {
        return this.#scope;
    }

    public get isReady(): boolean {
        return this.#isReady;
    }

    public get middlewares(): IterableIterator<Middleware> {
        this.#assertReady('middlewares');
        return this.#middlewares.values();
    }

    public get plugins(): IterableIterator<Dumpling> {
        this.#assertReady('plugins');
        return this.#plugins.values();
    }

    public get routes(): IterableIterator<Route> {
        this.#assertReady('routes');
        return this.#routes.values();
    }

    #assertReady(getter: 'middlewares' | 'plugins' | 'routes'): void {
        if (!this.#isReady) {
            const name: $Plugin.Name = this.#name;
            throw new PluginError(`Cannot read "${name}.${getter}" before "${name}.ready()";`);
        }
    }

    #assertNotReady(method: 'use' | 'mount' | 'route'): void {
        if (this.#isReady) {
            const name: $Plugin.Name = this.#name;
            throw new PluginError(`Cannot call "${name}.${method}()" after "${name}.ready()";`);
        }
    }

    public use(...middlewares: readonly Middleware[]): this {
        this.#assertNotReady('use');
        for (const middleware of middlewares) {
            this.#registerMiddleware(middleware);
        }
        return this;
    }

    #registerMiddleware(middleware: Middleware): void {
        const name: $Middleware.Name = middleware.name;
        if (this.#middlewares.has(name)) {
            throw new MiddlewareError(`"${name}" already registered;`);
        }
        this.#middlewares.set(name, middleware);
    }

    public mount(...plugins: readonly Dumpling[]): this {
        this.#assertNotReady('mount');
        for (const plugin of plugins) {
            this.#registerPlugin(plugin);
        }
        return this;
    }

    #registerPlugin(plugin: Dumpling): void {
        const name: $Plugin.Name = plugin.name;
        if (!plugin.isReady) {
            throw new PluginError(`"${name}" not ready, call "${name}.ready()" before mount;`);
        }
        if (this.#plugins.has(name)) {
            throw new PluginError(`"${name}" already registered;`);
        }
        this.#plugins.set(name, plugin);
    }

    public route(...routes: readonly Route[]): this {
        this.#assertNotReady('route');
        for (const route of routes) {
            this.#registerRoute(route);
        }
        return this;
    }

    #registerRoute(route: Route): void {
        const name: $Route.Name = route.name;
        if (this.#routes.has(name)) {
            throw new RouteError(`"${name}" already registered;`);
        }
        this.#routes.set(name, route);
    }

    public ready(): void {
        if (this.#isReady) {
            return;
        }
        for (const plugin of this.#plugins.values()) {
            if (plugin.scope === 'self') {
                continue;
            }
            this.use(...plugin.middlewares);
            this.route(...plugin.routes);
        }
        this.#isReady = true;
    }
}
