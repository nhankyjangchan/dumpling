import { describe, test, expect } from 'bun:test';
import { Middleware } from '@middleware';
import { Route, RouteError, type $Route } from '@route';

const createMiddleware = (): Middleware =>
    new Middleware({
        handler: (): undefined => {},
        manifest: {
            name: 'example@middleware',
            hook: 'onRequest',
            type: 'sync#skip'
        }
    });

const createInit = (): $Route.Init => ({
    name: 'GET /users',
    type: 'sync',
    handler: (): undefined => {},
    use: []
});

describe('Route', (): void => {
    describe('constructor', (): void => {
        test('Creates an instance from a valid init', (): void => {
            const route = new Route(createInit());
            expect(route).toBeInstanceOf(Route);
        });

        test('Stores the exact handler reference', (): void => {
            const init = createInit();
            const route = new Route(init);
            expect(route.handler).toBe(init.handler);
        });

        test('Stores name as-is', (): void => {
            expect(new Route(createInit()).name).toBe('GET /users');
        });

        test('Stores type as-is', (): void => {
            expect(new Route(createInit()).type).toBe('sync');
        });

        test('Accepts async type', (): void => {
            const route = new Route({ ...createInit(), type: 'async' });
            expect(route.type).toBe('async');
        });

        test('Stores a frozen copy of use, not the same reference', (): void => {
            const init = createInit();
            const route = new Route(init);
            expect(route.use).not.toBe(init.use);
            expect(route.use).toEqual(init.use);
            expect(Object.isFrozen(route.use)).toBe(true);
        });

        test('Keeps the exact Middleware references inside use', (): void => {
            const m1 = createMiddleware();
            const m2 = createMiddleware();
            const route = new Route({ ...createInit(), use: [m1, m2] });
            expect(route.use[0]).toBe(m1);
            expect(route.use[1]).toBe(m2);
        });

        test('Does not reflect later mutations of the input use array', (): void => {
            const init = createInit();
            const route = new Route(init);
            (init.use as Middleware[]).push(createMiddleware());
            expect(route.use.length).toBe(0);
        });

        test('Throws on null', (): void => {
            expect((): Route => new Route(null as never)).toThrow();
        });

        test('Throws on undefined', (): void => {
            expect((): Route => new Route(undefined as never)).toThrow();
        });

        test('Throws on primitives', (): void => {
            expect((): Route => new Route('x' as never)).toThrow();
            expect((): Route => new Route(42 as never)).toThrow();
            expect((): Route => new Route(true as never)).toThrow();
        });

        test('Throws when name is missing', (): void => {
            const init = { type: 'sync', handler: (): undefined => {}, use: [] };
            expect((): Route => new Route(init as never)).toThrow();
        });

        test('Throws when type is missing', (): void => {
            const init = { name: 'GET /users', handler: (): undefined => {}, use: [] };
            expect((): Route => new Route(init as never)).toThrow();
        });

        test('Throws when handler is missing', (): void => {
            const init = { name: 'GET /users', type: 'sync', use: [] };
            expect((): Route => new Route(init as never)).toThrow();
        });

        test('Throws when use is missing', (): void => {
            const init = { name: 'GET /users', type: 'sync', handler: (): undefined => {} };
            expect((): Route => new Route(init as never)).toThrow();
        });

        test('Throws when handler is not a function', (): void => {
            const init = { ...createInit(), handler: 'nope' };
            expect((): Route => new Route(init as never)).toThrow();
        });

        test('Throws when use is not an array', (): void => {
            const init = { ...createInit(), use: 'nope' };
            expect((): Route => new Route(init as never)).toThrow();
        });

        test('Throws when use contains a non-Middleware', (): void => {
            const init = { ...createInit(), use: [{}] };
            expect((): Route => new Route(init as never)).toThrow();
        });

        test('Throws on extra key in init', (): void => {
            const init = { ...createInit(), extra: 1 };
            expect((): Route => new Route(init as never)).toThrow();
        });

        test('Throws on invalid name (no method)', (): void => {
            expect(
                (): Route => new Route({ ...createInit(), name: '/users' } as never)
            ).toThrow();
        });

        test('Throws on invalid name (no slash)', (): void => {
            expect(
                (): Route => new Route({ ...createInit(), name: 'GET users' } as never)
            ).toThrow();
        });

        test('Throws on invalid type', (): void => {
            const init = { ...createInit(), type: 'parallel' };
            expect((): Route => new Route(init as never)).toThrow();
        });

        test('Throws on case-mismatched type', (): void => {
            const init = { ...createInit(), type: 'SYNC' };
            expect((): Route => new Route(init as never)).toThrow();
        });
    });

    describe('constructor error type', (): void => {
        test('Throws RouteError on null', (): void => {
            expect((): Route => new Route(null as never)).toThrow(RouteError);
        });

        test('Throws RouteError when handler is missing', (): void => {
            const init = { name: 'GET /users', type: 'sync', use: [] };
            expect((): Route => new Route(init as never)).toThrow(RouteError);
        });

        test('Throws RouteError when use contains a non-Middleware', (): void => {
            const init = { ...createInit(), use: [{}] };
            expect((): Route => new Route(init as never)).toThrow(RouteError);
        });

        test('Error message is not empty', (): void => {
            try {
                new Route(null as never);
                throw new Error('expected to throw');
            } catch (error) {
                expect(error).toBeInstanceOf(RouteError);
                expect((error as RouteError).message.length).toBeGreaterThan(0);
            }
        });
    });

    describe('name getter', (): void => {
        test('Returns the name', (): void => {
            expect(new Route(createInit()).name).toBe('GET /users');
        });

        test('Handles names with parameters', (): void => {
            const route = new Route({ ...createInit(), name: 'GET /users/:id' });
            expect(route.name).toBe('GET /users/:id');
        });

        test('Handles names with empty path', (): void => {
            const route = new Route({ ...createInit(), name: 'GET /' });
            expect(route.name).toBe('GET /');
        });
    });

    describe('type getter', (): void => {
        test('Returns sync for sync route', (): void => {
            expect(new Route({ ...createInit(), type: 'sync' }).type).toBe('sync');
        });

        test('Returns async for async route', (): void => {
            expect(new Route({ ...createInit(), type: 'async' }).type).toBe('async');
        });
    });

    describe('handler getter', (): void => {
        test('Returns a function', (): void => {
            expect(new Route(createInit()).handler).toBeFunction();
        });
    });

    describe('use getter', (): void => {
        test('Returns an array', (): void => {
            expect(Array.isArray(new Route(createInit()).use)).toBe(true);
        });

        test('Returns an empty array when no middlewares', (): void => {
            expect(new Route(createInit()).use.length).toBe(0);
        });

        test('Returns middlewares in order', (): void => {
            const m1 = createMiddleware();
            const m2 = createMiddleware();
            const route = new Route({ ...createInit(), use: [m1, m2] });
            expect(route.use[0]).toBe(m1);
            expect(route.use[1]).toBe(m2);
        });

        test('Is frozen', (): void => {
            expect(Object.isFrozen(new Route(createInit()).use)).toBe(true);
        });

        test('Throws on attempted mutation', (): void => {
            const route = new Route(createInit());
            expect((): void => {
                (route.use as Middleware[]).push(createMiddleware());
            }).toThrow();
        });
    });

    describe('isInit', (): void => {
        test('Returns true for a valid init', (): void => {
            expect(Route.isInit(createInit())).toBe(true);
        });

        test('Returns true for async type', (): void => {
            expect(Route.isInit({ ...createInit(), type: 'async' })).toBe(true);
        });

        test('Returns true with middlewares', (): void => {
            expect(Route.isInit({ ...createInit(), use: [createMiddleware()] })).toBe(true);
        });

        test('Returns true for every valid name shape', (): void => {
            const names = ['GET /', 'POST /users', 'DELETE /users/:id', 'PATCH /a/b/c'];
            for (const name of names) {
                expect(Route.isInit({ ...createInit(), name })).toBe(true);
            }
        });

        test('Returns false for null', (): void => {
            expect(Route.isInit(null)).toBe(false);
        });

        test('Returns false for undefined', (): void => {
            expect(Route.isInit(undefined)).toBe(false);
        });

        test('Returns false for primitives', (): void => {
            expect(Route.isInit('x')).toBe(false);
            expect(Route.isInit(42)).toBe(false);
            expect(Route.isInit(true)).toBe(false);
            expect(Route.isInit(Symbol('s'))).toBe(false);
        });

        test('Returns false for a function', (): void => {
            expect(Route.isInit((): void => {})).toBe(false);
        });

        test('Returns false when a key is missing', (): void => {
            const init: Record<string, unknown> = { ...createInit() };
            delete init['name'];
            expect(Route.isInit(init)).toBe(false);
        });

        test('Returns false when handler is not a function', (): void => {
            expect(Route.isInit({ ...createInit(), handler: 42 })).toBe(false);
        });

        test('Returns false when use is not an array', (): void => {
            expect(Route.isInit({ ...createInit(), use: 'x' })).toBe(false);
        });

        test('Returns false on extra key', (): void => {
            expect(Route.isInit({ ...createInit(), extra: 1 })).toBe(false);
        });

        test('Returns false on invalid name (no method)', (): void => {
            expect(Route.isInit({ ...createInit(), name: '/users' })).toBe(false);
        });

        test('Returns false on invalid name (no slash)', (): void => {
            expect(Route.isInit({ ...createInit(), name: 'GET users' })).toBe(false);
        });

        test('Returns false on invalid name (trailing space)', (): void => {
            expect(Route.isInit({ ...createInit(), name: 'GET /users ' })).toBe(false);
        });

        test('Returns false on unknown type', (): void => {
            expect(Route.isInit({ ...createInit(), type: 'parallel' })).toBe(false);
        });

        test('Returns false on case-mismatched type', (): void => {
            expect(Route.isInit({ ...createInit(), type: 'SYNC' })).toBe(false);
        });
    });

    describe('RouteError', (): void => {
        test('Is an instance of Error', (): void => {
            expect(new RouteError('msg')).toBeInstanceOf(Error);
        });

        test('Has its own name', (): void => {
            expect(new RouteError('msg').name).toBe('RouteError');
        });

        test('Preserves the message', (): void => {
            expect(new RouteError('very specific message').message).toBe(
                'very specific message'
            );
        });
    });

    describe('guards never throw', (): void => {
        const hostile: readonly unknown[] = [
            null,
            undefined,
            0,
            -1,
            NaN,
            Infinity,
            -Infinity,
            0n,
            '',
            'x',
            true,
            false,
            Symbol('s'),
            (): void => {},
            [],
            [1, 2, 3],
            Object.create(null),
            new Map(),
            new Set(),
            new Date(),
            /regex/
        ];

        for (const [index, input] of hostile.entries()) {
            test(`isInit(${index}) returns false without throwing`, (): void => {
                expect((): boolean => Route.isInit(input)).not.toThrow();
                expect(Route.isInit(input)).toBe(false);
            });
        }
    });

    describe('documented edge cases', (): void => {
        test('Rejects an empty array with the 4 properties attached', (): void => {
            // @ts-ignore
            const fake = [] as unknown[] & Record<string, unknown>;
            fake['name'] = 'GET /users';
            fake['type'] = 'sync';
            fake['handler'] = (): undefined => {};
            fake['use'] = [];
            expect(Route.isInit(fake)).toBe(false);
        });

        test('Rejects a non-empty array with attached properties', (): void => {
            const fake = [1, 2] as unknown[] & Record<string, unknown>;
            fake['name'] = 'GET /users';
            fake['type'] = 'sync';
            fake['handler'] = (): undefined => {};
            fake['use'] = [];
            expect(Route.isInit(fake)).toBe(false);
        });

        test('Rejects an object created with Object.create(null)', (): void => {
            const init = Object.create(null) as Record<string, unknown>;
            init['name'] = 'GET /users';
            init['type'] = 'sync';
            init['handler'] = (): undefined => {};
            init['use'] = [];
            expect(Route.isInit(init)).toBe(false);
        });

        test('Rejects a class instance with the 4 own fields', (): void => {
            class FakeInit {
                readonly name = 'GET /users';
                readonly type = 'sync';
                readonly handler = (): undefined => {};
                readonly use: readonly Middleware[] = [];
            }
            expect(Route.isInit(new FakeInit())).toBe(false);
        });

        test('Accepts a Proxy wrapping a valid init', (): void => {
            expect(Route.isInit(new Proxy(createInit(), {}))).toBe(true);
        });

        test('Ignores non-enumerable properties', (): void => {
            const init = createInit();
            Object.defineProperty(init, 'hidden', { value: 42, enumerable: false });
            expect(Route.isInit(init)).toBe(true);
        });

        test('Ignores symbol-keyed properties', (): void => {
            const init = createInit();
            // @ts-ignore
            (init as Record<symbol, unknown>)[Symbol('meta')] = 'anything';
            expect(Route.isInit(init)).toBe(true);
        });

        test('Accepts a frozen valid init', (): void => {
            expect(Route.isInit(Object.freeze(createInit()))).toBe(true);
        });
    });

    describe('type mismatches', (): void => {
        test('Rejects a function with attached properties', (): void => {
            const fake = (): void => {};
            Object.defineProperty(fake, 'name', { value: 'GET /users', configurable: true });
            Object.defineProperty(fake, 'type', { value: 'sync', configurable: true });
            Object.defineProperty(fake, 'handler', {
                value: (): undefined => {},
                configurable: true
            });
            Object.defineProperty(fake, 'use', { value: [], configurable: true });
            expect(Route.isInit(fake)).toBe(false);
        });

        test('Rejects a manifest with numeric values', (): void => {
            expect(Route.isInit({ ...createInit(), name: 42 })).toBe(false);
        });

        test('Rejects a manifest with boolean values', (): void => {
            expect(Route.isInit({ ...createInit(), type: true })).toBe(false);
        });

        test('Rejects a manifest with nested objects instead of strings', (): void => {
            expect(
                Route.isInit({
                    ...createInit(),
                    name: { toString: () => 'GET /users' }
                })
            ).toBe(false);
        });
    });
});
