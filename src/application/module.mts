import { Middleware, MiddlewareError, type $Middleware } from '@middleware';
import { utils } from '@utils';
import { PluginError } from './errors.mts';
import type { $Plugin, Route } from './types.mts';

export class Dumpling extends EventTarget {
    static readonly #MANIFEST_KEYS: $Plugin.ManifestKeys = ['name', 'injectable', 'plugins'];

    readonly #manifest: $Plugin.Manifest;
    readonly #middlewares: Map<$Middleware.Name, Middleware>;
    readonly #plugins: Map<$Plugin.Name, Dumpling>;
    readonly #routes: Map<string, Route>;
    #isReady: boolean;
    #decorates: Record<PropertyKey, unknown>;

    public constructor(manifest: $Plugin.Manifest) {
        if (!Dumpling.isManifest(manifest)) {
            throw new PluginError('Invalid plugin manifest;');
        }
        super();
        this.#manifest = Object.freeze({ ...manifest });
        this.#middlewares = new Map();
        this.#plugins = new Map();
        this.#routes = new Map();
        this.#isReady = false;
        this.#decorates = {};
    }

    public get manifest(): $Plugin.Manifest {
        return this.#manifest;
    }

    public get middlewares(): MapIterator<Middleware> {
        return this.#middlewares.values();
    }

    public get plugins(): MapIterator<Dumpling> {
        return this.#plugins.values();
    }

    public static isManifest(target: unknown): target is $Plugin.Manifest {
        return (
            utils.isObject(target)
            && utils.hasExactKeys(target, Dumpling.#MANIFEST_KEYS)
            && utils.isString(target.name)
            && utils.isBoolean(target.injectable)
            && target.name.endsWith('@pluginmiddleware')
            && Array.isArray(target.plugins)
        );
    }

    public decorate(key: PropertyKey, value: unknown): this {
        this.#assertNotReady('decorate');
        this.#decorates[key] = value;
        return this;
    }

    #assertNotReady(method: 'use' | 'mount' | 'route' | 'decorate'): void {
        if (this.#isReady) {
            throw new Error(`Cannot call "${method}" after ready();`);
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
        if (!(middleware instanceof Middleware)) {
            throw new MiddlewareError(`${this.#manifest.name}.use() expected middleware;`);
        }
        const name: $Middleware.Name = middleware.manifest.name;
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
        if (!(plugin instanceof Dumpling)) {
            throw new PluginError(`${this.#manifest.name}.mount() expected plugin;`);
        }
        const name: $Plugin.Name = plugin.manifest.name;
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
        const key = `${route.method.toUpperCase()} ${route.path}`;
        if (this.#routes.has(key)) {
            throw new Error(`Route "${key}" already registered;`);
        }
        this.#routes.set(key, route);
    }

    public ready(): void {
        this.#isReady = true;
    }
}
