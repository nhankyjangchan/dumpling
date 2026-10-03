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

    #status: $Plugin.Status = 'pending';

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

    public get status(): $Plugin.Status {
        return this.#status;
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

    public use(...middlewares: readonly Middleware[]): this {
        this.#assertPending('use');
        for (const middleware of middlewares) {
            this.#registerMiddleware(middleware);
        }
        return this;
    }

    #registerMiddleware(middleware: Middleware): void {
        const name: $Middleware.Name = middleware.name;
        if (this.#middlewares.has(name)) {
            this.#fail(new MiddlewareError(`"${name}" already registered;`));
        }
        this.#middlewares.set(name, middleware);
    }

    public mount(...plugins: readonly Dumpling[]): this {
        this.#assertPending('mount');
        for (const plugin of plugins) {
            this.#registerPlugin(plugin);
        }
        return this;
    }

    #registerPlugin(plugin: Dumpling): void {
        const name: $Plugin.Name = plugin.name;
        if (plugin.status === 'pending') {
            throw new PluginError(`Cannot mount "${name}": call "${name}.ready()" first;`);
        }
        if (plugin.status === 'failed') {
            throw new PluginError(`Cannot mount "${name}": plugin is failed;`);
        }
        if (this.#plugins.has(name)) {
            this.#fail(new PluginError(`"${name}" already registered;`));
        }
        this.#plugins.set(name, plugin);
    }

    public route(...routes: readonly Route[]): this {
        this.#assertPending('route');
        for (const route of routes) {
            this.#registerRoute(route);
        }
        return this;
    }

    #registerRoute(route: Route): void {
        const name: $Route.Name = route.name;
        if (this.#routes.has(name)) {
            this.#fail(new RouteError(`"${name}" already registered;`));
        }
        this.#routes.set(name, route);
    }

    #assertPending(method: 'use' | 'mount' | 'route' | 'ready'): void {
        if (this.#status === 'pending') {
            return;
        }
        const name: $Plugin.Name = this.#name;
        if (this.#status === 'failed') {
            throw new PluginError(`Cannot call "${name}.${method}()" on failed plugin;`);
        }
        throw new PluginError(`Cannot call "${name}.${method}()" after "${name}.ready()";`);
    }

    #assertReady(getter: 'middlewares' | 'plugins' | 'routes'): void {
        if (this.#status === 'ready') {
            return;
        }
        const name: $Plugin.Name = this.#name;
        if (this.#status === 'failed') {
            throw new PluginError(`Cannot read "${name}.${getter}" from failed plugin;`);
        }
        throw new PluginError(`Cannot read "${name}.${getter}" before "${name}.ready()";`);
    }

    #fail<E extends Error>(error: E): never {
        this.#status = 'failed';
        this.#middlewares.clear();
        this.#plugins.clear();
        this.#routes.clear();
        throw error;
    }

    public ready(): void {
        if (this.#status === 'ready') {
            throw new PluginError(`Cannot call "${this.#name}.ready()" twice;`);
        }
        this.#assertPending('ready');
        for (const plugin of this.#plugins.values()) {
            if (plugin.scope === 'self') {
                continue;
            }
            this.use(...plugin.middlewares);
            this.route(...plugin.routes);
        }
        this.#status = 'ready';
    }
}
