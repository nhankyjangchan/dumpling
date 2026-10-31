import { Shared, type $Shared } from '@/index';
import { MiddlewareError, Middleware, type $Middleware } from '@middleware/index';
import { RouteError, Route, type $Route } from '@route/index';
import { PluginError } from './errors';
import type { $Plugin } from './types';

export class Plugin {
    readonly #name: $Plugin.Name;
    readonly #scope: $Plugin.Scope;

    readonly #middlewares: Map<$Middleware.Name, Middleware>;
    readonly #plugins: Map<$Plugin.Name, Plugin>;
    readonly #routes: Map<$Route.Name, Route>;

    #status: $Plugin.Status = 'pending';

    public constructor(init: $Plugin.Init) {
        Shared.assertPlainObject(init, 'Plugin expects a plain object;');
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

    public get view(): $Plugin.View {
        return {
            name: this.#name,
            scope: this.#scope,
            status: this.#status,
            middlewares: this.#middlewares.values(),
            plugins: this.#plugins.values(),
            routes: this.#routes.values()
        };
    }

    public get middlewares(): IterableIterator<Middleware> {
        this.#assertStatus('ready', 'middlewares');
        return this.#middlewares.values();
    }

    public get plugins(): IterableIterator<Plugin> {
        this.#assertStatus('ready', 'plugins');
        return this.#plugins.values();
    }

    public get routes(): IterableIterator<Route> {
        this.#assertStatus('ready', 'routes');
        return this.#routes.values();
    }

    public use(...middlewares: readonly Middleware[]): this {
        this.#assertStatus('pending', 'use');
        for (const middleware of middlewares) {
            this.#registerMiddleware(middleware);
        }
        return this;
    }

    public mount(...plugins: readonly Plugin[]): this {
        this.#assertStatus('pending', 'mount');
        for (const plugin of plugins) {
            this.#registerPlugin(plugin);
        }
        return this;
    }

    public route(...routes: readonly Route[]): this {
        this.#assertStatus('pending', 'route');
        for (const route of routes) {
            this.#registerRoute(route);
        }
        return this;
    }

    public ready(): this {
        this.#assertStatus('pending', 'ready');
        for (const plugin of this.#plugins.values()) {
            if (plugin.scope === 'global') {
                this.use(...plugin.middlewares);
                this.route(...plugin.routes);
            }
        }
        this.#status = 'ready';
        return this;
    }

    #assertStatus(expected: $Plugin.Status, access: keyof Plugin): void {
        const actual: $Plugin.Status = this.#status;
        if (actual === expected) {
            return;
        }
        const message = `"${this.#name}.${access}" expects ${expected}, got ${actual};`;
        throw new PluginError(message);
    }

    #registerMiddleware(middleware: Middleware): void {
        this.#assertInstance(middleware, Middleware);
        const name: $Middleware.Name = middleware.name;
        if (this.#middlewares.has(name)) {
            const error = new MiddlewareError(`"${name}" already registered;`);
            this.#failWith(error);
        }
        this.#middlewares.set(name, middleware);
    }

    #registerPlugin(plugin: Plugin): void {
        this.#assertInstance(plugin, Plugin);
        const name: $Plugin.Name = plugin.name;
        if (plugin.status !== 'ready') {
            const error = new PluginError(`Cannot mount "${name}", it's ${plugin.status};`);
            this.#failWith(error);
        }
        if (this.#plugins.has(name)) {
            const error = new PluginError(`"${name}" already registered;`);
            this.#failWith(error);
        }
        this.#plugins.set(name, plugin);
    }

    #registerRoute(route: Route): void {
        this.#assertInstance(route, Route);
        const name: $Route.Name = route.name;
        if (this.#routes.has(name)) {
            const error = new RouteError(`"${name}" already registered;`);
            this.#failWith(error);
        }
        this.#routes.set(name, route);
    }

    #assertInstance(input: unknown, ExpectedClass: $Shared.AnyConstructor): void {
        if (input instanceof ExpectedClass) {
            return;
        }
        const error = new PluginError(`Expected ${ExpectedClass.name} instance;`);
        this.#failWith(error);
    }

    /**
     * I have decided against implementing a cleanup mechanism for the maps. A memory leak can only
     * occur due to the framework user's own actions. In a standard scenario, a `throw` statement
     * will immediately crash the application, forcing the user to fix their code. If they
     * intentionally catch the exception and then hold onto a "zombie" object, that is their own
     * problem.
     */
    #failWith(error: Error): never {
        this.#status = 'failed';
        throw error;
    }
}
