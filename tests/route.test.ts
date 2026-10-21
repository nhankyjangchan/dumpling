import { Middleware, type $Middleware } from '@middleware/index';
import { Route, RouteError, type $Route } from '@route/index';
import { describe, test, expect } from 'bun:test';

function createMiddleware(overrides: Partial<$Middleware.Init> = {}): Middleware {
    return new Middleware({
        name: 'example@middleware',
        hook: 'onRequest',
        mode: 'sync',
        flow: 'pass',
        handler: (): undefined => {},
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

describe('Route', (): void => {
    test('Creates a new instance', (): void => {
        const route = new Route(createInit());
        expect(route).toBeInstanceOf(Route);
    });

    test('Stores name as-is', (): void => {
        const name = 'user@route';
        const route = new Route(createInit({ name }));
        expect(route.name).toBe(name);
    });

    test('Stores path as-is', (): void => {
        const path = '/api/user/:id';
        const route = new Route(createInit({ path }));
        expect(route.path).toBe(path);
    });

    for (const method of ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'] as const) {
        test(`Stores method "${method}" as-is`, (): void => {
            const route = new Route(createInit({ method }));
            expect(route.method).toBe(method);
        });
    }

    test('Stores the exact middleware array reference', (): void => {
        const middlewares: Middleware[] = [createMiddleware()];
        const init = createInit({ middlewares });
        const route = new Route(init);
        expect(route.middlewares).toBe(middlewares);
    });

    test('Stores the exact middleware element references', (): void => {
        const mdw1 = createMiddleware();
        const mdw2 = createMiddleware();
        const route = new Route(createInit({ middlewares: [mdw1, mdw2] }));
        expect(route.middlewares[0]).toBe(mdw1);
        expect(route.middlewares[1]).toBe(mdw2);
    });

    test('Does not validate input shape at runtime (dumb data holder)', (): void => {
        const primitives: unknown[] = ['str', 20, true, Symbol(), 1n];
        for (const input of primitives) {
            expect(() => new Route(input as never)).not.toThrow();
        }
    });

    test('Throws on null or undefined via property access, not validation', (): void => {
        expect(() => new Route(null as never)).toThrow(TypeError);
        expect(() => new Route(undefined as never)).toThrow(TypeError);
    });

    test('Fields are read-only (getters without setters)', (): void => {
        const fields: (keyof $Route.Init)[] = ['name', 'path', 'method', 'middlewares'];
        const route = new Route(createInit());
        for (const field of fields) {
            expect(() => {
                (route as unknown as Record<string, unknown>)[field] = 'new value';
            }).toThrow(TypeError);
        }
    });
});

describe('RouteError', (): void => {
    test('Is an instance of Error', (): void => {
        expect(new RouteError()).toBeInstanceOf(Error);
    });

    test('Has its own name', (): void => {
        expect(new RouteError().name).toBe('RouteError');
    });

    test('Preserves the message', (): void => {
        expect(new RouteError('some message').message).toBe('some message');
    });

    test('Preserves the cause', (): void => {
        const cause = new Error('root');
        const error = new RouteError('msg', { cause });
        expect(error.cause).toBe(cause);
    });

    test('Cause is undefined by default', (): void => {
        expect(new RouteError('msg').cause).toBeUndefined();
    });
});
