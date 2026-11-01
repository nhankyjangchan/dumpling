import { Middleware, MiddlewareError, type $Middleware } from '@middleware/index';
import { Plugin, PluginError, type $Plugin } from '@plugin/index';
import { Route, RouteError, type $Route } from '@route/index';
import { describe, test, expect } from 'bun:test';

function createMiddleware(overrides: Partial<$Middleware.Init> = {}): Middleware {
    return new Middleware({
        name: 'example@middleware',
        hook: 'onRequest',
        mode: 'sync',
        flow: 'pass',
        handler: () => {},
        ...overrides
    } as $Middleware.Init);
}

function createRoute(overrides: Partial<$Route.Init> = {}): Route {
    return new Route({
        name: 'example@route',
        path: '/example',
        method: 'GET',
        middlewares: [],
        ...overrides
    });
}

function createInit(overrides: Partial<$Plugin.Init> = {}): $Plugin.Init {
    return {
        name: 'example@plugin',
        scope: 'global',
        ...overrides
    };
}

function createPlugin(overrides: Partial<$Plugin.Init> = {}): Plugin {
    return new Plugin(createInit(overrides));
}

function createReadyPlugin(overrides: Partial<$Plugin.Init> = {}): Plugin {
    return createPlugin(overrides).ready();
}

describe('Plugin', () => {
    describe('new instance initialization', () => {
        test('creates a new instance', () => {
            expect(createPlugin()).toBeInstanceOf(Plugin);
        });

        test('stores name and scope as-is', () => {
            const name = 'users@plugin';
            const plugin = createPlugin({ name, scope: 'self' });
            expect(plugin.name).toBe(name);
            expect(plugin.scope).toBe('self');
        });

        test('starts in pending status', () => {
            expect(createPlugin().status).toBe('pending');
        });
    });

    describe('rejects non-plain-object init', () => {
        test('representative non-plain-object values', () => {
            const objects: any[] = [new Map(), new Error(), new Array(), new Function()];
            for (const input of objects) {
                expect(() => new Plugin(input)).toThrow(TypeError);
            }
        });

        test('preserves the given message verbatim', () => {
            try {
                new Plugin(null as never);
            } catch (error) {
                expect(error).toBeInstanceOf(TypeError);
                expect((error as Error).message).toBe('Plugin expects a plain object;');
            }
        });
    });

    describe('view', () => {
        test('returns name, scope, status', () => {
            const plugin = createPlugin({ name: 'users@plugin', scope: 'self' });
            const view = plugin.view;
            expect(view.name).toBe('users@plugin');
            expect(view.scope).toBe('self');
            expect(view.status).toBe('pending');
        });

        test('works in any status', () => {
            const pending = createPlugin();
            const ready = createReadyPlugin();
            const failed = createPlugin();
            try {
                failed.use(createMiddleware({ name: 'a@middleware' }));
                failed.use(createMiddleware({ name: 'a@middleware' }));
            } catch {}

            expect(() => pending.view).not.toThrow();
            expect(() => ready.view).not.toThrow();
            expect(() => failed.view).not.toThrow();
        });

        test('shows mounted plugins and registered routes', () => {
            const child = createReadyPlugin({ name: 'child@plugin' });
            const route = createRoute({ name: 'a@route' });
            const plugin = createPlugin().mount(child).route(route);
            expect([...plugin.view.plugins]).toEqual([child]);
            expect([...plugin.view.routes]).toEqual([route]);
        });

        test('iterators are live (reflect post-access mutations)', () => {
            const plugin = createPlugin();
            const view = plugin.view;
            plugin.use(createMiddleware({ name: 'a@middleware' }));
            expect([...view.middlewares]).toHaveLength(1);
        });
    });

    describe('accessor getters require ready status', () => {
        test('middlewares, plugins, routes throw on pending', () => {
            const plugin = createPlugin();
            expect(() => plugin.middlewares).toThrow(PluginError);
            expect(() => plugin.plugins).toThrow(PluginError);
            expect(() => plugin.routes).toThrow(PluginError);
        });

        test('middlewares, plugins, routes throw on failed', () => {
            const plugin = createPlugin();
            try {
                plugin.use(createMiddleware({ name: 'a@middleware' }));
                plugin.use(createMiddleware({ name: 'a@middleware' }));
            } catch {}

            expect(() => plugin.middlewares).toThrow(PluginError);
            expect(() => plugin.plugins).toThrow(PluginError);
            expect(() => plugin.routes).toThrow(PluginError);
        });

        test('middlewares, plugins, routes work on ready', () => {
            const plugin = createReadyPlugin();
            expect([...plugin.middlewares]).toEqual([]);
            expect([...plugin.plugins]).toEqual([]);
            expect([...plugin.routes]).toEqual([]);
        });

        test('throws PluginError with descriptive message on wrong status', () => {
            const plugin = createReadyPlugin({ name: 'users@plugin' });
            try {
                plugin.use(createMiddleware());
            } catch (error) {
                expect(error).toBeInstanceOf(PluginError);
                expect((error as Error).message).toBe(
                    '"users@plugin.use" expects pending, got ready;'
                );
            }
        });
    });

    describe('use', () => {
        test('registers middleware, returns this', () => {
            const m = createMiddleware({ name: 'auth@middleware' });
            const plugin = createPlugin();
            const returned = plugin.use(m);
            expect(returned).toBe(plugin);
            plugin.ready();
            expect([...plugin.middlewares]).toEqual([m]);
        });

        test('registers multiple at once, preserving order', () => {
            const m1 = createMiddleware({ name: 'a@middleware' });
            const m2 = createMiddleware({ name: 'b@middleware' });
            const plugin = createPlugin().use(m1, m2).ready();
            expect([...plugin.middlewares]).toEqual([m1, m2]);
        });

        test('duplicate name fails with MiddlewareError', () => {
            const plugin = createPlugin();
            try {
                plugin.use(createMiddleware({ name: 'a@middleware' }));
                plugin.use(createMiddleware({ name: 'a@middleware' }));
            } catch (error) {
                expect(error).toBeInstanceOf(MiddlewareError);
                expect((error as Error).message).toBe('"a@middleware" already registered;');
            }
            expect(plugin.status).toBe('failed');
        });

        test('invalid instance fails with PluginError', () => {
            const plugin = createPlugin();
            try {
                plugin.use({} as any);
            } catch (error) {
                expect(error).toBeInstanceOf(PluginError);
                expect((error as Error).message).toBe('Expected Middleware instance;');
            }
            expect(plugin.status).toBe('failed');
        });

        test('partial registration before failure is preserved in view', () => {
            const m = createMiddleware({ name: 'a@middleware' });
            const plugin = createPlugin();
            try {
                plugin.use(m, createMiddleware({ name: 'a@middleware' }));
            } catch {}
            expect([...plugin.view.middlewares]).toEqual([m]);
        });
    });

    describe('mount', () => {
        test('registers plugin, returns this', () => {
            const child = createReadyPlugin({ name: 'child@plugin' });
            const plugin = createPlugin();
            const returned = plugin.mount(child);
            expect(returned).toBe(plugin);
            plugin.ready();
            expect([...plugin.plugins]).toEqual([child]);
        });

        test('mounting non-ready plugin fails with PluginError', () => {
            const pendingChild = createPlugin({ name: 'child@plugin' });
            const plugin = createPlugin();
            try {
                plugin.mount(pendingChild);
            } catch (error) {
                expect(error).toBeInstanceOf(PluginError);
                expect((error as Error).message).toBe(
                    'Cannot mount "child@plugin", it\'s pending;'
                );
            }
            expect(plugin.status).toBe('failed');
        });

        test('duplicate name fails with PluginError', () => {
            const child1 = createReadyPlugin({ name: 'child@plugin' });
            const child2 = createReadyPlugin({ name: 'child@plugin' });
            const plugin = createPlugin();
            try {
                plugin.mount(child1);
                plugin.mount(child2);
            } catch (error) {
                expect(error).toBeInstanceOf(PluginError);
                expect((error as Error).message).toBe('"child@plugin" already registered;');
            }
            expect(plugin.status).toBe('failed');
        });

        test('invalid instance fails with PluginError', () => {
            const plugin = createPlugin();
            try {
                plugin.mount({} as any);
            } catch (error) {
                expect(error).toBeInstanceOf(PluginError);
                expect((error as Error).message).toBe('Expected Plugin instance;');
            }
            expect(plugin.status).toBe('failed');
        });
    });

    describe('route', () => {
        test('registers route, returns this', () => {
            const r = createRoute({ name: 'users@route' });
            const plugin = createPlugin();
            const returned = plugin.route(r);
            expect(returned).toBe(plugin);
            plugin.ready();
            expect([...plugin.routes]).toEqual([r]);
        });

        test('duplicate name fails with RouteError', () => {
            const plugin = createPlugin();
            try {
                plugin.route(createRoute({ name: 'a@route' }));
                plugin.route(createRoute({ name: 'a@route' }));
            } catch (error) {
                expect(error).toBeInstanceOf(RouteError);
                expect((error as Error).message).toBe('"a@route" already registered;');
            }
            expect(plugin.status).toBe('failed');
        });

        test('invalid instance fails with PluginError', () => {
            const plugin = createPlugin();
            try {
                plugin.route({} as any);
            } catch (error) {
                expect(error).toBeInstanceOf(PluginError);
                expect((error as Error).message).toBe('Expected Route instance;');
            }
            expect(plugin.status).toBe('failed');
        });
    });

    describe('ready', () => {
        test('transitions pending → ready', () => {
            const plugin = createPlugin();
            plugin.ready();
            expect(plugin.status).toBe('ready');
        });

        test('flattens global children middleware and routes', () => {
            const m = createMiddleware({ name: 'a@middleware' });
            const r = createRoute({ name: 'a@route' });
            const child = createPlugin({ name: 'child@plugin', scope: 'global' })
                .use(m)
                .route(r)
                .ready();
            const parent = createPlugin().mount(child).ready();
            expect([...parent.middlewares]).toEqual([m]);
            expect([...parent.routes]).toEqual([r]);
        });

        test('flattens transitively (grandchildren via global child)', () => {
            const m = createMiddleware({ name: 'm@middleware' });
            const grandchild = createPlugin({ name: 'gc@plugin', scope: 'global' }).use(m).ready();
            const child = createPlugin({ name: 'c@plugin', scope: 'global' })
                .mount(grandchild)
                .ready();
            const parent = createPlugin().mount(child).ready();
            expect([...parent.middlewares]).toEqual([m]);
        });

        test('does NOT flatten self children', () => {
            const m = createMiddleware({ name: 'a@middleware' });
            const r = createRoute({ name: 'a@route' });
            const child = createPlugin({ name: 'child@plugin', scope: 'self' })
                .use(m)
                .route(r)
                .ready();
            const parent = createPlugin().mount(child).ready();
            expect([...parent.middlewares]).toEqual([]);
            expect([...parent.routes]).toEqual([]);
        });

        test('fails plugin on flattening duplicate', () => {
            const child = createPlugin({ name: 'child@plugin', scope: 'global' })
                .use(createMiddleware({ name: 'a@middleware' }))
                .ready();
            const parent = createPlugin()
                .use(createMiddleware({ name: 'a@middleware' }))
                .mount(child);
            expect(() => parent.ready()).toThrow(MiddlewareError);
            expect(parent.status).toBe('failed');
        });

        test('throws on already ready', () => {
            const plugin = createReadyPlugin();
            expect(() => plugin.ready()).toThrow(PluginError);
        });

        test('throws on failed', () => {
            const plugin = createPlugin();
            try {
                plugin.use({} as any);
            } catch {}
            expect(() => plugin.ready()).toThrow(PluginError);
        });

        test('returns this (chainable)', () => {
            const plugin = createPlugin();
            expect(plugin.ready()).toBe(plugin);
        });
    });

    describe('failed state', () => {
        test('all mutators throw after failure', () => {
            const plugin = createPlugin();
            try {
                plugin.use({} as any);
            } catch {}
            expect(() => plugin.use(createMiddleware())).toThrow(PluginError);
            expect(() => plugin.mount(createReadyPlugin())).toThrow(PluginError);
            expect(() => plugin.route(createRoute())).toThrow(PluginError);
            expect(() => plugin.ready()).toThrow(PluginError);
        });

        test('maps are not cleared on failure (view preserves state)', () => {
            const m = createMiddleware({ name: 'a@middleware' });
            const r = createRoute({ name: 'a@route' });
            const plugin = createPlugin().use(m).route(r);
            try {
                plugin.use(createMiddleware({ name: 'a@middleware' }));
            } catch {}
            expect([...plugin.view.middlewares]).toEqual([m]);
            expect([...plugin.view.routes]).toEqual([r]);
        });
    });
});

describe('PluginError', () => {
    test('is an instance of Error', () => {
        expect(new PluginError()).toBeInstanceOf(Error);
    });

    test('has qualified name', () => {
        expect(new PluginError().name).toBe('PluginError');
    });

    test('preserves message', () => {
        expect(new PluginError('some message').message).toBe('some message');
    });

    test('preserves cause', () => {
        const cause = new Error('root');
        expect(new PluginError('msg', { cause }).cause).toBe(cause);
    });
});
