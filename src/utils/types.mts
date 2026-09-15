export type PlainObject = Record<PropertyKey, unknown>;
export type Owns<T extends object, K extends PropertyKey, V = unknown> = T & Record<K, V>;

export interface Utils {
    isObject(target: unknown): target is object;
    isFunction(target: unknown): target is Function;
    isString(target: unknown): target is string;
    isPlainObject(target: unknown): target is PlainObject;
    match(target: string, pattern: RegExp): boolean;
    hasOwn<T extends object, K extends PropertyKey>(target: T, key: K): target is Owns<T, K>;
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
