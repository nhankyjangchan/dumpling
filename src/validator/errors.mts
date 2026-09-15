import type {
    ValidationErrorImpl,
    ValidationErrorInit,
    ValidationErrorJSON
} from './types.mts';

export class ValidationError extends Error implements ValidationErrorImpl {
    public constructor(init?: ValidationErrorInit) {
        super(init?.message, init?.options);
        this.name = 'ValidationError';
        Error.captureStackTrace?.(this, new.target);
    }

    public toJSON(): ValidationErrorJSON {
        return {
            name: this.name,
            message: this.message
        };
    }
}
