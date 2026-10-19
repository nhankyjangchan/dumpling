import { Middleware, MiddlewareError, type $Middleware } from '@middleware/index';
import { describe, test, expect } from 'bun:test';

function createInit(overrides: Partial<$Middleware.Init> = {}): $Middleware.Init {
    return {
        name: 'example@middleware',
        hook: 'onRequest',
        mode: 'sync',
        flow: 'pass',
        handler: (): undefined => {},
        ...overrides
    } as $Middleware.Init;
}

describe('Middleware', (): void => {
    test('Creates a new instance', (): void => {
        const middleware = new Middleware(createInit());
        expect(middleware).toBeInstanceOf(Middleware);
    });

    test('Stores name as-is', (): void => {
        const name = 'auth@middleware';
        const middleware = new Middleware(createInit({ name }));
        expect(middleware.name).toBe(name);
    });

    for (const hook of ['onRequest', 'onResponse', 'onError'] as const) {
        test(`Stores hook "${hook}" as-is`, (): void => {
            const middleware = new Middleware(createInit({ hook }));
            expect(middleware.hook).toBe(hook);
        });
    }

    for (const mode of ['sync', 'async'] as const) {
        test(`Stores mode "${mode}" as-is`, (): void => {
            const middleware = new Middleware(createInit({ mode }));
            expect(middleware.mode).toBe(mode);
        });
    }

    for (const flow of ['halt', 'pass'] as const) {
        test(`Stores flow "${flow}" as-is`, (): void => {
            const middleware = new Middleware(createInit({ flow }));
            expect(middleware.flow).toBe(flow);
        });
    }

    test('Stores the exact sync handler reference', (): void => {
        const init = createInit({ handler: () => {} });
        const middleware = new Middleware(init);
        expect(middleware.handler).toBe(init.handler);
    });

    test('Stores the exact async handler reference', (): void => {
        const handler = async (): Promise<undefined> => {};
        const middleware = new Middleware(createInit({ mode: 'async', handler }));
        expect(middleware.handler).toBe(handler);
    });

    test('Does not validate input shape at runtime (dumb data holder)', (): void => {
        const primitives: unknown[] = ['str', 20, true, Symbol(), 1n];
        for (const input of primitives) {
            expect(() => new Middleware(input as never)).not.toThrow();
        }
    });

    test('Throws on null or undefined via property access, not validation', (): void => {
        expect(() => new Middleware(null as never)).toThrow(TypeError);
        expect(() => new Middleware(undefined as never)).toThrow(TypeError);
    });

    test('Fields are read-only (getters without setters)', (): void => {
        const fields: (keyof $Middleware.Init)[] = ['name', 'hook', 'mode', 'flow', 'handler'];
        const middleware = new Middleware(createInit());
        for (const field of fields) {
            expect(() => {
                (middleware as unknown as Record<string, unknown>)[field] = 'new value';
            }).toThrow(TypeError);
        }
    });
});

describe('MiddlewareError', (): void => {
    test('Is an instance of Error', (): void => {
        expect(new MiddlewareError()).toBeInstanceOf(Error);
    });

    test('Has its own name', (): void => {
        expect(new MiddlewareError().name).toBe('MiddlewareError');
    });

    test('Preserves the message', (): void => {
        expect(new MiddlewareError('some message').message).toBe('some message');
    });

    test('Preserves the cause', (): void => {
        const cause = new Error('root');
        const error = new MiddlewareError('msg', { cause });
        expect(error.cause).toBe(cause);
    });

    test('Cause is undefined by default', (): void => {
        expect(new MiddlewareError('msg').cause).toBeUndefined();
    });
});
