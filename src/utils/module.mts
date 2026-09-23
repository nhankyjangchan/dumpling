import type { WithProperty } from './types.mts';

export const utils = Object.freeze({
    isFunction(target: unknown): target is (...args: unknown[]) => unknown {
        return typeof target === 'function';
    },
    isPlainObject(target: unknown): target is object {
        return utils.isObject(target) && Object.getPrototypeOf(target) === Object.prototype;
    },
    isObject(target: unknown): target is object {
        return target !== null && typeof target === 'object';
    },
    hasOnlyStrings<Target extends object>(
        target: Target
    ): target is Target & WithProperty<keyof Target, string> {
        return Object.values(target).every(utils.isString);
    },
    isString(target: unknown): target is string {
        return typeof target === 'string';
    },
    hasExactKeys<Target extends object, const Keys extends readonly string[]>(
        target: Target,
        keys: Keys
    ): target is Target & WithProperty<Keys[number], unknown> {
        const actualKeys: string[] = Object.keys(target);
        const exactKeys = new Set(keys);
        return (
            actualKeys.length === keys.length
            && actualKeys.every((key: string): boolean => exactKeys.has(key))
        );
    }
} as const);
