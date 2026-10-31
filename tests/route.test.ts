import { Middleware, type $Middleware } from '@middleware/index';
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

function createInit(overrides: Partial<$Route.Init> = {}): $Route.Init {
    return {
        name: 'example@route',
        path: '/example',
        method: 'GET',
        middlewares: [],
        ...overrides
    };
}

describe('Route', () => {
    describe('new instance initialization', () => {
        test('creates a new instance', () => {
            const route = new Route(createInit());
            expect(route).toBeInstanceOf(Route);
        });

        test('stores name as-is', () => {
            const name = 'user@route';
            const route = new Route(createInit({ name }));
            expect(route.name).toBe(name);
        });

        test('stores path as-is', () => {
            const path = '/api/user/:id';
            const route = new Route(createInit({ path }));
            expect(route.path).toBe(path);
        });

        test('stores methods as-is', () => {
            const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'] as const;
            for (const method of methods) {
                const route = new Route(createInit({ method }));
                expect(route.method).toBe(method);
            }
        });

        test('stores the exact middlewares reference and elements', () => {
            const mdw1 = createMiddleware();
            const mdw2 = createMiddleware();
            const middlewares: Middleware[] = [mdw1, mdw2];
            const route = new Route(createInit({ middlewares }));
            expect(route.middlewares).toBe(middlewares);
            expect(route.middlewares[0]).toBe(mdw1);
            expect(route.middlewares[1]).toBe(mdw2);
        });

        test('fields are read-only (getters without setters)', () => {
            const fields = ['name', 'path', 'method', 'middlewares'] as const;
            const route = new Route(createInit());
            for (const field of fields) {
                expect(() => ((route as any)[field] = 'new value')).toThrow(TypeError);
            }
        });
    });

    describe('rejects non-plain-object init with TypeError', () => {
        test('representative non-plain-object values', () => {
            const objects: any[] = [new Map(), new Error(), new Array(), new Function()];
            for (const input of objects) {
                expect(() => new Route(input)).toThrow(TypeError);
            }
        });

        test('preserves the given message verbatim', () => {
            try {
                new Route(null as never);
            } catch (error) {
                expect(error).toBeInstanceOf(TypeError);
                expect((error as Error).message).toBe('Route expects a plain object;');
            }
        });
    });
});

describe('RouteErrors', () => {
    test('is an instance of Error', () => {
        expect(new RouteError()).toBeInstanceOf(Error);
    });

    test('has qualified name', () => {
        expect(new RouteError().name).toBe('RouteError');
    });

    test('preserves message', () => {
        expect(new RouteError('some message').message).toBe('some message');
    });

    test('preserves cause', () => {
        const cause = new Error('root');
        expect(new RouteError('msg', { cause }).cause).toBe(cause);
    });
});
