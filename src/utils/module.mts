import type { Utils, WithProperty } from './types.mts';

export const utils: Readonly<Utils> = Object.freeze({
    isPlainObject(target: unknown): target is object {
        return utils.isObject(target) && Object.getPrototypeOf(target) === Object.prototype;
    },
    isObject(target: unknown): target is object {
        return !!target && typeof target === 'object' && !Array.isArray(target);
    },
    hasOwn<P extends keyof T, T extends object>(target: T, property: P): target is T & WithProperty<P> {
        return !!target && Object.hasOwn(target, property);
    },
    isFunction(target: unknown): target is Function {
        return !!target && typeof target === 'function';
    },
    match(target: string, pattern: RegExp): boolean {
        const isValidArgs: boolean = utils.isString(target) && pattern instanceof RegExp;
        return isValidArgs && pattern.test(target);
    },
    isString(target: unknown): target is string {
        return !!target && typeof target === 'string';
    },
    createShallowFrozenClone<T extends object>(target: T): Readonly<T> {
        return Object.freeze({ ...target });
    }
});
