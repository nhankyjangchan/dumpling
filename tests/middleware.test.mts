import { describe, test, expect } from 'bun:test';
import { Middleware, MiddlewareError, type $Middleware } from '@middleware';

function createInit(init: Partial<$Middleware.Init> = {}): $Middleware.Init {
    return {
        name: 'example@middleware',
        hook: 'onRequest',
        mode: 'sync',
        flow: 'pass',
        handler: (): undefined => {},
        ...(init as any)
    };
}

describe('Middleware', (): void => {
    test('Creates an new instance', (): void => {
        const middleware = new Middleware(createInit());
        expect(middleware).toBeInstanceOf(Middleware);
    });

    test('Stores name as-is', (): void => {
        const name = 'auth@middleware';
        const middleware = new Middleware(createInit({ name }));
        expect(middleware.name).toBe(name);
    });

    test('Stores hook as-is', (): void => {
        const hook = 'onError';
        const middleware = new Middleware(createInit({ hook }));
        expect(middleware.hook).toBe(hook);
    });

    test('Stores mode as-is', (): void => {
        const mode = 'async';
        const middleware = new Middleware(createInit({ mode }));
        expect(middleware.mode).toBe(mode);
    });

    test('Stores mode as-is', (): void => {
        const flow = 'halt';
        const middleware = new Middleware(createInit({ flow }));
        expect(middleware.flow).toBe(flow);
    });

    test('Stores the exact handler reference', (): void => {
        const init = createInit({ handler: () => {} });
        const middleware = new Middleware(init);
        expect(middleware.handler).toBe(init.handler);
    });

    test('Not throws on primitives, because only types validate input', (): void => {
        const primitives: any[] = ['str', 20, true, Symbol(), 1n];
        for (const input of primitives) {
            expect(() => new Middleware(input)).not.toThrow();
        }
    });

    test('Throws on null or undefined', (): void => {
        expect(() => new Middleware(null as never)).toThrow(TypeError);
        expect(() => new Middleware(undefined as never)).toThrow(TypeError);
    });

    test('Throws when attempting to set any new value', (): void => {
        const fields: (keyof $Middleware.Init)[] = ['name', 'hook', 'mode', 'flow', 'handler'];
        const route = new Middleware(createInit());
        for (const field of fields) {
            expect(() => ((route[field] as any) = 'new value')).toThrow(TypeError);
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
});
