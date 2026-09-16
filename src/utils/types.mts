export type PlainObject = Record<PropertyKey, unknown>;
export type WithProperty<Key extends PropertyKey, Value = unknown> = Record<Key, Value>;

export interface Utils {
    isFunction(target: unknown): target is (...args: unknown[]) => unknown;
    isPlainObject(target: unknown): target is PlainObject;
    isObject(target: unknown): target is object;
    hasOwnMatch(target: object, key: PropertyKey, pattern: RegExp): boolean;
    hasOwn<Target extends object, Key extends PropertyKey>(
        target: Target,
        key: Key
    ): target is Target & WithProperty<Key>;
    match(target: unknown, pattern: RegExp): boolean;
}

export interface Consts {
    readonly handler: 'handler';
    readonly manifest: 'manifest';
    readonly name: 'name';
    readonly hook: 'hook';
    readonly type: 'type';
    readonly response: 'response';
    readonly method: 'method';
    readonly path: 'path';
}
