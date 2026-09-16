import type { ErrorImpl, ErrorInit, ErrorJSON } from '@utils';

export interface RepositoryImpl<Key extends PropertyKey, Value> {
    size: number;
    register(key: Key, value: Value): this;
    unregister(key: Key): this;
    has(key: Key): boolean;
    get(key: Key): Value;
    clear(): this;
    keys(): IterableIterator<Key>;
    values(): IterableIterator<Value>;
    entries(): IterableIterator<[Key, Value]>;
}

export type RepositoryErrorImpl = ErrorImpl;
export type RepositoryErrorInit = ErrorInit;
export type RepositoryErrorJSON = ErrorJSON;
