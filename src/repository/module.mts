import { RepositoryError } from './errors.mts';

export class Repository<K extends PropertyKey, V> {
    readonly #entities: Map<K, V>;

    public constructor() {
        this.#entities = new Map<K, V>();
    }

    public get size(): number {
        return this.#entities.size;
    }

    public register(key: K, value: V): this {
        if (this.#entities.has(key))
            throw new RepositoryError({ message: `Key "${String(key)}" already registered;\n` });
        this.#entities.set(key, value);
        return this;
    }

    public unregister(key: K): this {
        if (!this.#entities.has(key))
            throw new RepositoryError({ message: `Key "${String(key)}" not found;\n` });
        this.#entities.delete(key);
        return this;
    }

    public has(key: K): boolean {
        return this.#entities.has(key);
    }

    public get(key: K): V {
        if (!this.#entities.has(key))
            throw new RepositoryError({ message: `Key "${String(key)}" not found;\n` });
        return this.#entities.get(key)!;
    }

    public clear(): this {
        if (this.#entities.size === 0)
            throw new RepositoryError({ message: `Repository is already empty;\n` });
        this.#entities.clear();
        return this;
    }

    public keys(): IterableIterator<K> {
        return this.#entities.keys();
    }

    public values(): IterableIterator<V> {
        return this.#entities.values();
    }

    public entries(): IterableIterator<[K, V]> {
        return this.#entities.entries();
    }

    public *[Symbol.iterator](): IterableIterator<[K, V]> {
        yield* this.#entities.entries();
    }
}
