import type { WithProperty } from './types.mts';

/**
 * I don't consider these utilities to be particularly high-quality code.
 * For instance, `utils.hasExactKeys` has a complexity of O(n²).
 * This could be optimized by using `Set.prototype.isSubsetOf()`,
 * but these functions are used in only two or three places and
 * run just once—when the server starts.
 *
 * I don't think it's worth going through the codebase to swap arrays for sets or
 * messing with the typing (I can't stand type casting via `as`),
 * so I'm leaving it as is.
 *
 * @author Timur Schuchkin "Nhankyjangchan"
 * @internal
 */
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
    ): target is Target & WithProperty<Keys[number], string> {
        const actualKeys: string[] = Object.keys(target);
        const exactKeys = new Set(keys);
        return (
            actualKeys.length === keys.length
            && actualKeys.every((key: string): boolean => exactKeys.has(key))
        );
    }
} as const);
