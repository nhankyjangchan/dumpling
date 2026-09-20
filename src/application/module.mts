import { Middleware, MiddlewareError, type $Middleware } from '@middleware';
import { utils } from '@utils';
import { PluginError } from './errors.mts';
import type { $Plugin, Route } from './types.mts';

export class Dumpling extends EventTarget {
    static readonly #DESCRIPTOR_KEYS: $Plugin.DescriptorKeys = ['name', 'scope'];

    static readonly #SCOPE_RE: RegExp = /^(?:self|global)$/u;

    readonly #descriptor: $Plugin.Descriptor;
    readonly #middlewares: Map<$Middleware.Name, Middleware>;
    readonly #plugins: Map<$Plugin.Name, Dumpling>;
    readonly #routes: Map<string, Route>;

    #isReady: boolean;
    #decorates: Record<PropertyKey, unknown>;

    public constructor(descriptor: $Plugin.Descriptor) {
        if (!Dumpling.isDescriptor(descriptor)) {
            throw new PluginError('Invalid plugin descriptor;');
        }
        super();
        this.#descriptor = Object.freeze({ ...descriptor });
        this.#middlewares = new Map();
        this.#plugins = new Map();
        this.#routes = new Map();
        this.#isReady = false;
        this.#decorates = {};
    }

    public get descriptor(): $Plugin.Descriptor {
        return this.#descriptor;
    }

    public get middlewares(): MapIterator<Middleware> {
        return this.#middlewares.values();
    }

    public get plugins(): MapIterator<Dumpling> {
        return this.#plugins.values();
    }

    public get routes(): MapIterator<Route> {
        return this.#routes.values();
    }

    public get isReady(): boolean {
        return this.#isReady;
    }

    public static isDescriptor(target: unknown): target is $Plugin.Descriptor {
        return (
            utils.isPlainObject(target)
            && utils.hasExactKeys(target, Dumpling.#DESCRIPTOR_KEYS)
            && utils.hasOnlyStrings(target)
            && target.name.endsWith('@plugin')
            && Dumpling.#SCOPE_RE.test(target.scope)
        );
    }

    public decorate(key: PropertyKey, value: unknown): this {
        this.#assertNotReady('decorate');
        this.#decorates[key] = value;
        return this;
    }

    #assertNotReady(method: 'use' | 'mount' | 'route' | 'decorate'): void {
        if (this.#isReady) {
            throw new Error(`Cannot call "${method}()" after ready();`);
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
            throw new MiddlewareError(`"${this.#descriptor.name}.use()" expected middleware;`);
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
            throw new PluginError(`"${this.#descriptor.name}.mount()" expected plugin;`);
        }
        const name: $Plugin.Name = plugin.descriptor.name;
        if (!plugin.isReady) {
            throw new PluginError(`"${name}" not ready, call ${name}.ready() before mount;`);
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
