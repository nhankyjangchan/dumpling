import { RepositoryError } from './errors.mts';
import type { RepositoryImpl } from './types.mts';

export class Repository<Key extends PropertyKey, Value> implements RepositoryImpl<Key, Value> {
    readonly #entities: Map<Key, Value>;

    public constructor() {
        this.#entities = new Map<Key, Value>();
    }

    public get size(): number {
        return this.#entities.size;
    }

    public register(key: Key, value: Value): this {
        if (this.#entities.has(key)) {
            throw new RepositoryError({ message: `Key "${String(key)}" already registered;` });
        }
        this.#entities.set(key, value);
        return this;
    }

    public unregister(key: Key): this {
        if (!this.#entities.has(key)) {
            throw new RepositoryError({ message: `Key "${String(key)}" not found;` });
        }
        this.#entities.delete(key);
        return this;
    }

    public has(key: Key): boolean {
        return this.#entities.has(key);
    }

    public get(key: Key): Value {
        if (!this.#entities.has(key)) {
            throw new RepositoryError({ message: `Key "${String(key)}" not found;` });
        }
        return this.#entities.get(key)!;
    }

    public clear(): this {
        if (this.#entities.size === 0) {
            throw new RepositoryError({ message: `Repository is already empty;` });
        }
        this.#entities.clear();
        return this;
    }

    public keys(): IterableIterator<Key> {
        return this.#entities.keys();
    }

    public values(): IterableIterator<Value> {
        return this.#entities.values();
    }

    public entries(): IterableIterator<[Key, Value]> {
        return this.#entities.entries();
    }

    public *[Symbol.iterator](): IterableIterator<[Key, Value]> {
        yield* this.#entities.entries();
    }
}
