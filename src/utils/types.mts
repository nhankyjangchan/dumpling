export type WithProperty<P extends PropertyKey, V = unknown> = Record<P, V>;

export interface Utils {
    isObject(target: unknown): target is object;
    isFunction(target: unknown): target is (...args: any[]) => any;
    isString(target: unknown): target is string;
    isPlainObject(target: unknown): target is Record<PropertyKey, unknown>;
    hasOwn<P extends PropertyKey, T extends object>(
        target: T,
        property: P
    ): target is T & WithProperty<P>;
    match(target: string, pattern: RegExp): boolean;
    createShallowFrozenClone<T extends object>(target: T): Readonly<T>;
}

export interface Consts {
    readonly handler: 'handler';
    readonly hook: 'hook';
    readonly message: 'message';
    readonly name: 'name';
    readonly type: 'type';
}

export interface ErrorImpl<J = object> {
    name: string;
    message: string;
    toJSON(): J;
}
