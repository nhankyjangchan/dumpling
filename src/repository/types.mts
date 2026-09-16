import type { CommonErrorImpl, CommonErrorInit, CommonErrorJSON } from '@utils';

export interface RepositoryImpl<Key extends PropertyKey, Value> {
    readonly size: number;
    register(key: Key, value: Value): this;
    unregister(key: Key): this;
    has(key: Key): boolean;
    get(key: Key): Value;
    clear(): this;
    keys(): IterableIterator<Key>;
    values(): IterableIterator<Value>;
    entries(): IterableIterator<[Key, Value]>;
}

export type RepositoryErrorImpl = CommonErrorImpl;
export type RepositoryErrorInit = CommonErrorInit;
export type RepositoryErrorJSON = CommonErrorJSON;
