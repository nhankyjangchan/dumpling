export type PlainObject = Record<PropertyKey, unknown>;
export type WithProperty<K extends PropertyKey, V = unknown> = Record<K, V>;

export interface Utils {
    isObject(target: unknown): target is object;
    isFunction(target: unknown): target is Function;
    isString(target: unknown): target is string;
    isPlainObject(target: unknown): target is PlainObject;
    match(target: string, pattern: RegExp): boolean;
    hasOwn<T extends object, P extends PropertyKey>(
        target: T,
        propertyName: P
    ): target is T & WithProperty<P>;
}

export interface Consts {
    readonly handler: 'handler';
    readonly hook: 'hook';
    readonly message: 'message';
    readonly name: 'name';
    readonly type: 'type';
}

export interface ErrorImpl<J extends object = object> {
    name: string;
    message: string;
    toJSON(): J;
}

export interface ErrorInit {
    message?: string;
    options?: ErrorOptions;
}

export interface ErrorJSON {
    name: string;
    message: string;
}
