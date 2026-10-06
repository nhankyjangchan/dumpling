import { describe, test, expect } from 'bun:test';
import { Middleware, type $Middleware } from '@middleware';
import { Route, RouteError, type $Route } from '@route';

function createMiddleware(init: Partial<$Middleware.Init> = {}): Middleware {
    return new Middleware({
        name: 'example@middleware',
        hook: 'onRequest',
        mode: 'sync',
        flow: 'pass',
        handler: (): undefined => {},
        ...(init as any)
    });
}

function createInit(init: Partial<$Route.Init> = {}): $Route.Init {
    return {
        name: 'example@route',
        path: '/example',
        method: 'GET',
        middlewares: [],
        ...init
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

    test('Stores method as-is', (): void => {
        const method = 'GET';
        const route = new Route(createInit({ method }));
        expect(route.method).toBe(method);
    });

    test('Stores the exact middleware list reference', (): void => {
        const init = createInit();
        const route = new Route(init);
        expect(route.middlewares).toBe(init.middlewares);
    });

    test('Keeps the exact Middleware references inside use', (): void => {
        const mdw1: Middleware = createMiddleware();
        const mdw2: Middleware = createMiddleware();
        const route = new Route({ ...createInit(), middlewares: [mdw1, mdw2] });
        expect(route.middlewares[0]).toBe(mdw1);
        expect(route.middlewares[1]).toBe(mdw2);
    });

    test('Not throws on primitives, because only types validate input', (): void => {
        const primitives: any[] = ['str', 20, true, Symbol(), 1n];
        for (const input of primitives) {
            expect(() => new Route(input)).not.toThrow();
        }
    });

    test('Throws on null or undefined', (): void => {
        expect(() => new Route(null as never)).toThrow(TypeError);
        expect(() => new Route(undefined as never)).toThrow(TypeError);
    });

    test('Throws when attempting to set any new value', (): void => {
        const fields: (keyof $Route.Init)[] = ['name', 'path', 'method', 'middlewares'];
        const route = new Route(createInit());
        for (const field of fields) {
            expect(() => ((route[field] as any) = 'new value')).toThrow(TypeError);
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
});
