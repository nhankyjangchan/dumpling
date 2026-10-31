import { Shared } from '@/module';
import { describe, test, expect } from 'bun:test';

describe('Shared.assertPlainObject', () => {
    describe('accepts plain objects', () => {
        test('empty object literal', () => {
            expect(() => Shared.assertPlainObject({}, 'msg')).not.toThrow();
        });

        test('object with properties', () => {
            expect(() => Shared.assertPlainObject({ a: 1 }, 'msg')).not.toThrow();
        });

        test('Object.create(Object.prototype)', () => {
            expect(() =>
                Shared.assertPlainObject(Object.create(Object.prototype), 'msg')
            ).not.toThrow();
        });
    });

    describe('rejects non-plain-object values with TypeError', () => {
        test('primitives', () => {
            const primitives: unknown[] = ['string', 1984, 1n, true, null, undefined, Symbol('x')];
            for (const input of primitives) {
                expect(() => Shared.assertPlainObject(input, 'msg')).toThrow(TypeError);
            }
        });

        test('functions (include classes)', () => {
            const functions: Function[] = [() => {}, function () {}, class {}];
            for (const input of functions) {
                expect(() => Shared.assertPlainObject(input, 'msg')).toThrow(TypeError);
            }
        });

        test('built-in instances', () => {
            const builtIns: object[] = [new Date(), new Map(), new Set(), new TypeError()];
            for (const input of builtIns) {
                expect(() => Shared.assertPlainObject(input, 'msg')).toThrow(TypeError);
            }
        });

        test('null-prototype objects', () => {
            expect(() => Shared.assertPlainObject(Object.create(null), 'msg')).toThrow(TypeError);
        });

        test('arrays', () => {
            expect(() => Shared.assertPlainObject([], 'msg')).toThrow(TypeError);
        });
    });

    describe('error semantics', () => {
        test('preserves message verbatim', () => {
            const message = 'Plugin expects a plain object;';
            try {
                Shared.assertPlainObject(null, message);
            } catch (error) {
                expect(error).toBeInstanceOf(TypeError);
                expect((error as Error).message).toBe(message);
            }
        });
    });
});
