export type WithProperty<Key extends PropertyKey, Value = unknown> = Record<Key, Value>;

export interface Utils {
    isObject(target: unknown): target is Record<PropertyKey, unknown>;
    isFunction(target: unknown): target is (...args: unknown[]) => unknown;
    isString(target: unknown): target is string;
    isPlainObject(target: unknown): target is Record<PropertyKey, unknown>;
    match(target: string, pattern: RegExp): boolean;
    hasOwn<Target extends object, Key extends PropertyKey>(
        target: Target,
        key: Key
    ): target is Target & WithProperty<Key>;
}

export interface Consts {
    readonly handler: 'handler';
    readonly hook: 'hook';
    readonly message: 'message';
    readonly name: 'name';
    readonly type: 'type';
}

export interface CommonErrorImpl<JsonOutput extends object = object> {
    readonly name: string;
    readonly message: string;
    toJSON(): JsonOutput;
}

export interface CommonErrorInit {
    readonly message?: string;
    readonly options?: ErrorOptions;
}

export interface CommonErrorJSON {
    readonly name: string;
    readonly message: string;
}
