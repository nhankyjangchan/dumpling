import type { RepositoryErrorInit, RepositoryEntity, RepositoryErrorJSON } from './types.mts';

export class RepositoryError<K extends PropertyKey, V> extends Error {
    readonly #key: K | undefined;
    readonly #value: V | undefined;

    public constructor(init: RepositoryErrorInit<K, V> = {}) {
        super(init.message ?? 'RepositoryError', init.options);
        this.name = 'RepositoryError';
        this.#key = init.key;
        this.#value = init.value;
        Error.captureStackTrace?.(this, new.target);
    }

    public get entity(): RepositoryEntity<K, V> {
        return { key: this.#key, value: this.#value };
    }

    public toJSON(): RepositoryErrorJSON<K, V> {
        return {
            name: this.name,
            message: this.message,
            entity: this.entity
        };
    }
}
