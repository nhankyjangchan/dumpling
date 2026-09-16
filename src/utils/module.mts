import type { Utils, Consts, WithProperty } from './types.mts';

export const utils: Readonly<Utils> = Object.freeze({
    isObject(target: unknown): target is object {
        return target !== null && typeof target === 'object' && !Array.isArray(target);
    },
    isFunction(target: unknown): target is (...args: unknown[]) => unknown {
        return typeof target === 'function';
    },
    isString(target: unknown): target is string {
        return typeof target === 'string';
    },
    isPlainObject(target: unknown): target is Record<PropertyKey, unknown> {
        return utils.isObject(target) && Object.getPrototypeOf(target) === Object.prototype;
    },
    match(target: string, pattern: RegExp): boolean {
        return pattern.test(target);
    },
    hasOwn<Target extends object, Key extends PropertyKey>(
        target: Target,
        key: Key
    ): target is Target & WithProperty<Key> {
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
