import type { Middleware, MiddlewareName } from '@middleware';
import type { PluginManifest, PluginName, RouteInit } from './types.mts';

export class Dumpling extends EventTarget {
    readonly #manifest: PluginManifest;
    #plugins: Map<PluginName, Dumpling>;
    #middlewares: Map<MiddlewareName, Middleware>;
    #routes: Map<string, RouteInit>;

    public constructor(manifest: PluginManifest) {
        super();
        this.#manifest = Object.freeze({ ...manifest });
        this.#plugins = new Map();
        this.#middlewares = new Map();
        this.#routes = new Map();
    }

    public get manifest(): PluginManifest {
        return this.#manifest;
    }

    public get plugins(): IterableIterator<Dumpling> {
        return this.#plugins.values();
    }

    public get middlewares(): IterableIterator<Middleware> {
        return this.#middlewares.values();
    }

    public decorate(): this {
        return this;
    }

    public use(...middlewares: Middleware[]): this {
        for (const middleware of middlewares) {
            this.#setMiddleware(middleware);
        }
        return this;
    }

    #setMiddleware(middleware: Middleware): void {
        const name: MiddlewareName = middleware.manifest.name;
        if (this.#middlewares.has(name)) {
            throw new Error(`Middleware "${name}" already registered;`);
        }
        this.#middlewares.set(name, middleware);
    }

    public mount(...plugins: Dumpling[]): this {
        for (const plugin of plugins) {
            this.#setPlugin(plugin);
        }
        return this;
    }

    #setPlugin(plugin: Dumpling): void {
        const name: PluginName = plugin.manifest.name;
        if (this.#plugins.has(name)) {
            throw new Error(`Plugin "${name}" already registered;`);
        }
        this.#plugins.set(name, plugin);
    }

    public route(init: RouteInit): this {
        const key = `${init.method.toUpperCase()} ${init.path}`;
        if (this.#routes.has(key)) {
            throw new Error(`Route "${key}" already registered;`);
        }
        this.#routes.set(key, init);
        return this;
    }

    public launch<W = undefined>(options: Bun.Serve.Options<W>): Bun.Server<W> {
        return Bun.serve(options);
    }
}
