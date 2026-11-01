import { Middleware, MiddlewareError, type $Middleware } from '@middleware/index';
import { describe, test, expect } from 'bun:test';

function createInit(overrides: Partial<$Middleware.Init> = {}): $Middleware.Init {
    return {
        name: 'example@middleware',
        hook: 'onRequest',
        mode: 'sync',
        flow: 'pass',
        handler: () => {},
        ...overrides
    } as $Middleware.Init;
}

describe('Middleware', () => {
    describe('new instance initialization', () => {
        test('creates a new instance', () => {
            const middleware = new Middleware(createInit());
            expect(middleware).toBeInstanceOf(Middleware);
        });

        test('stores name as-is', () => {
            const name = 'auth@middleware';
            const middleware = new Middleware(createInit({ name }));
            expect(middleware.name).toBe(name);
        });

        test('stores hooks as-is', () => {
            const hooks = ['onRequest', 'onResponse', 'onError'] as const;
            for (const hook of hooks) {
                const middleware = new Middleware(createInit({ hook }));
                expect(middleware.hook).toBe(hook);
            }
        });

        test('stores modes as-is', () => {
            const modes = ['sync', 'async'] as const;
            for (const mode of modes) {
                const middleware = new Middleware(createInit({ mode }));
                expect(middleware.mode).toBe(mode);
            }
        });

        test('stores flows as-is', () => {
            const flows = ['halt', 'pass'] as const;
            for (const flow of flows) {
                const middleware = new Middleware(createInit({ flow }));
                expect(middleware.flow).toBe(flow);
            }
        });

        test('stores the exact handler reference', () => {
            const init = createInit({ handler: () => {} });
            const middleware = new Middleware(init);
            expect(middleware.handler).toBe(init.handler);
        });

        test('fields are read-only (getters without setters)', () => {
            const fields = ['name', 'hook', 'mode', 'flow', 'handler'] as const;
            const middleware = new Middleware(createInit());
            for (const field of fields) {
                expect(() => ((middleware as any)[field] = 'new value')).toThrow(TypeError);
            }
        });
    });

    describe('rejects non-plain-object init with TypeError', () => {
        test('representative non-plain-object values', () => {
            const objects: any[] = [new Map(), new Error(), new Array(), new Function()];
            for (const input of objects) {
                expect(() => new Middleware(input)).toThrow(TypeError);
            }
        });

        test('preserves the given message verbatim', () => {
            try {
                new Middleware(null as never);
            } catch (error) {
                expect(error).toBeInstanceOf(TypeError);
                expect((error as Error).message).toBe('Middleware expects a plain object;');
            }
        });
    });
});

describe('MiddlewareError', () => {
    test('is an instance of Error', () => {
        expect(new MiddlewareError()).toBeInstanceOf(Error);
    });

    test('has qualified name', () => {
        expect(new MiddlewareError().name).toBe('MiddlewareError');
    });

    test('preserves message', () => {
        expect(new MiddlewareError('some message').message).toBe('some message');
    });

    test('preserves cause', () => {
        const cause = new Error('root');
        expect(new MiddlewareError('msg', { cause }).cause).toBe(cause);
    });
});
