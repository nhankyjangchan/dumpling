import type { Utils, WithProperty, Consts } from './types.mts';

export const utils: Readonly<Utils> = Object.freeze({
    isObject(target: unknown): target is object {
        return target !== null && typeof target === 'object' && !Array.isArray(target);
    },
    isFunction(target: unknown): target is (...args: any[]) => any {
        return typeof target === 'function';
    },
    isString(target: unknown): target is string {
        return typeof target === 'string';
    },
    isPlainObject(target: unknown): target is Record<PropertyKey, unknown> {
        return utils.isObject(target) && Object.getPrototypeOf(target) === Object.prototype;
    },
    hasOwn<P extends PropertyKey, T extends object>(
        target: T,
        property: P
    ): target is T & WithProperty<P> {
        return Object.hasOwn(target, property);
    },
    match(target: string, pattern: RegExp): boolean {
        return pattern.test(target);
    },
    createShallowFrozenClone<T extends object>(target: T): Readonly<T> {
        return Object.freeze({ ...target });
    }
});

export const consts: Readonly<Consts> = Object.freeze({
    handler: 'handler',
    hook: 'hook',
    message: 'message',
    name: 'name',
    type: 'type'
});
