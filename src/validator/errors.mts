import type { ValidationErrorInit, ValidationErrorJSON } from './types.mts';

export class ValidationError<E> extends Error {
    readonly #entity: E | undefined;

    public constructor(init: ValidationErrorInit<E> = {}) {
        super(init.message ?? 'ValidationError', init.options);
        this.name = 'ValidationError';
        this.#entity = init.entity;
        Error.captureStackTrace?.(this, new.target);
    }

    public get entity(): E | undefined {
        return this.#entity;
    }

    public toJSON(): ValidationErrorJSON<E> {
        return {
            name: this.name,
            message: this.message,
            entity: this.entity
        };
    }
}
