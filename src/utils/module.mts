import type { Utils, PlainObject, Owns, Consts } from './types.mts';

export const utils: Readonly<Utils> = Object.freeze({
    isObject(target: unknown): target is object {
        return target !== null && typeof target === 'object' && !Array.isArray(target);
    },
    isFunction(target: unknown): target is Function {
        return typeof target === 'function';
    },
    isString(target: unknown): target is string {
        return typeof target === 'string';
    },
    isPlainObject(target: unknown): target is PlainObject {
        return utils.isObject(target) && Object.getPrototypeOf(target) === Object.prototype;
    },
    match(target: string, pattern: RegExp): boolean {
        return pattern.test(target);
    },
    hasOwn<T extends object, K extends PropertyKey>(target: T, key: K): target is Owns<T, K> {
        return Object.hasOwn(target, key);
    }
});

export const consts: Readonly<Consts> = Object.freeze({
    handler: 'handler',
    hook: 'hook',
    message: 'message',
    name: 'name',
    type: 'type'
});
