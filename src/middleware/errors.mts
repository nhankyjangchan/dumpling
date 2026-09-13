import { ValidationError } from '@validator';
import type { ValidationErrorInit } from '@validator';

export class MiddlewareInitError<E = any> extends ValidationError<E> {
    public constructor(init: ValidationErrorInit<E>) {
        super(init);
        Error.captureStackTrace?.(this, new.target);
    }
}
