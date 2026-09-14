export type WithProperty<P extends PropertyKey, V = unknown> = Record<P, V>;

export interface Utils {
    isPlainObject(target: unknown): target is object;
    isObject(target: unknown): target is object;
    hasOwn<P extends keyof T, T extends object>(target: T, property: P): target is T & WithProperty<P>;
    isFunction(target: unknown): target is Function;
    match(target: string, pattern: RegExp): boolean;
    isString(target: unknown): target is string;
    createShallowFrozenClone<T extends object>(target: T): Readonly<T>;
}
