import type {
    RepositoryErrorImpl,
    RepositoryErrorInit,
    RepositoryErrorJSON
} from './types.mts';

export class RepositoryError extends Error implements RepositoryErrorImpl {
    public constructor(init?: RepositoryErrorInit) {
        super(init?.message, init?.options);
        this.name = 'RepositoryError';
    }

    public toJSON(): RepositoryErrorJSON {
        return {
            name: this.name,
            message: this.message
        };
    }
}
