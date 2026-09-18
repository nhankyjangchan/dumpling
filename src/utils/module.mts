import type { WithProperty } from './types.mts';

export const utils = Object.freeze({
    isFunction(target: unknown): target is (...args: unknown[]) => unknown {
        return typeof target === 'function';
    },
    isPlainObject(target: unknown): target is Record<PropertyKey, unknown> {
        return utils.isObject(target) && Object.getPrototypeOf(target) === Object.prototype;
    },
    isObject(target: unknown): target is object {
        return target !== null && typeof target === 'object';
    },
    isBoolean(target: unknown): target is boolean {
        return typeof target === 'boolean';
    },
    hasOnlyStrings<Target extends object>(
        target: Target
    ): target is Target & WithProperty<keyof Target, string> {
        return Object.values(target).every(utils.isString);
    },
    isString(target: unknown): target is string {
        return typeof target === 'string';
    },
    hasOwn<Target extends object, const Key extends PropertyKey>(
        target: Target,
        key: Key
    ): target is Target & WithProperty<Key> {
        return Object.hasOwn(target, key);
    },
    hasExactKeys<const Keys extends readonly string[]>(
        target: object,
        keys: Keys
    ): target is Record<Keys[number], unknown> {
        const actualKeys: string[] = Object.keys(target).toSorted();
        const expectedKeys: string[] = keys.toSorted();
        return Bun.deepEquals(actualKeys, expectedKeys, true);
    }
} as const);
