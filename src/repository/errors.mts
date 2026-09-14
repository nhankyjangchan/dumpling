import type { RepositoryErrorInit, RepositoryErrorJSON } from './types.mts';

export class RepositoryError extends Error {
    public constructor(init?: RepositoryErrorInit) {
        super(init?.message, init?.options);
        this.name = 'RepositoryError';
        Error.captureStackTrace?.(this, new.target);
    }

    public toJSON(): RepositoryErrorJSON {
        return {
            name: this.name,
            message: this.message
        };
    }
}
