import type { ErrorImpl, ErrorInit, ErrorJSON } from '@utils';

export interface RepositoryImpl<K extends PropertyKey, V> {
    size: number;
    register(key: K, value: V): this;
    unregister(key: K): this;
    has(key: K): boolean;
    get(key: K): V;
    clear(): this;
    keys(): IterableIterator<K>;
    values(): IterableIterator<V>;
    entries(): IterableIterator<[K, V]>;
}

export interface RepositoryErrorImpl extends ErrorImpl {}
export interface RepositoryErrorInit extends ErrorInit {}
export interface RepositoryErrorJSON extends ErrorJSON {}
