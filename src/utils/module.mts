import type { Utils, Consts, PlainObject, WithProperty } from './types.mts';

export const utils: Readonly<Utils> = Object.freeze({
    isFunction(target: unknown): target is (...args: unknown[]) => unknown {
        return typeof target === 'function';
    },
    isPlainObject(target: unknown): target is PlainObject {
        return utils.isObject(target) && Object.getPrototypeOf(target) === Object.prototype;
    },
    isObject(target: unknown): target is object {
        return target !== null && typeof target === 'object';
    },
    hasOwnMatch(target: object, key: PropertyKey, pattern: RegExp): boolean {
        return utils.hasOwn(target, key) && utils.match(target[key], pattern);
    },
    hasOwn<Target extends object, Key extends PropertyKey>(
        target: Target,
        key: Key
    ): target is Target & WithProperty<Key> {
        return Object.hasOwn(target, key);
    },
    match(target: unknown, pattern: RegExp): boolean {
        return typeof target === 'string' && pattern.test(target);
    }
});

export const consts: Readonly<Consts> = Object.freeze({
    handler: 'handler',
    manifest: 'manifest',
    name: 'name',
    hook: 'hook',
    type: 'type',
    response: 'response',
    method: 'method',
    path: 'path'
});
