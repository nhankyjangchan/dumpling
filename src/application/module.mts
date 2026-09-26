import { Middleware, type $Middleware } from '@middleware';
import { Route, type $Route } from '@router';
import { utils } from '@utils';
import { PluginError } from './errors.mts';
import type { $Plugin } from './types.mts';

export class Dumpling extends EventTarget {
    static readonly #DESCRIPTOR_KEYS: $Plugin.DescriptorKeys = ['name', 'scope'];
    static readonly #SCOPE_RE: RegExp = /^(?:self|global)$/u;

    readonly #descriptor: $Plugin.Descriptor;
    readonly #middlewares: Map<$Middleware.Name, Middleware>;
    readonly #plugins: Map<$Plugin.Name, Dumpling>;
    readonly #routes: Map<$Route.Name, Route>;

    #isReady: boolean;

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
    }

    public get descriptor(): $Plugin.Descriptor {
        return this.#descriptor;
    }

    public get middlewares(): MapIterator<Middleware> {
        this.#assertReady('middlewares');
        return this.#middlewares.values();
    }

    public get plugins(): MapIterator<Dumpling> {
        this.#assertReady('plugins');
        return this.#plugins.values();
    }

    public get routes(): MapIterator<Route> {
        this.#assertReady('routes');
        return this.#routes.values();
    }

    public get isReady(): boolean {
        return this.#isReady;
    }

    public static isDescriptor(target: unknown): target is $Plugin.Descriptor {
        return (
            utils.isPlainObject(target)
            && utils.hasExactKeys(target, Dumpling.#DESCRIPTOR_KEYS)
            && utils.hasOnlyStringValues(target)
            && target.name.endsWith('@plugin')
            && Dumpling.#SCOPE_RE.test(target.scope)
        );
    }

    #assertReady(getter: 'middlewares' | 'plugins' | 'routes'): void {
        if (!this.#isReady) {
            const name: $Plugin.Name = this.#descriptor.name;
            throw new PluginError(`Cannot read "${name}.${getter}" before "${name}.ready()";`);
        }
    }

    #assertNotReady(method: 'use' | 'mount' | 'route'): void {
        if (this.#isReady) {
            const name: $Plugin.Name = this.descriptor.name;
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
        if (!(middleware instanceof Middleware)) {
            throw new PluginError(`"${this.#descriptor.name}.use()" expected middleware;`);
        }
        const name: $Middleware.Name = middleware.manifest.name;
        if (this.#middlewares.has(name)) {
            throw new PluginError(`"${name}" already registered;`);
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
        if (!(route instanceof Route)) {
            throw new PluginError(`"${this.#descriptor.name}.route()" expected route;`);
        }
        const name: $Route.Name = route.name;
        if (this.#routes.has(name)) {
            throw new PluginError(`"${name}" already registered;`);
        }
        this.#routes.set(name, route);
    }

    public ready(): void {
        if (this.#plugins.size > 0) {
            for (const plugin of this.#plugins.values()) {
                if (plugin.descriptor.scope === 'self') {
                    continue;
                }
                this.use(...plugin.middlewares);
                this.route(...plugin.routes);
            }
        }
        this.#isReady = true;
    }
}
