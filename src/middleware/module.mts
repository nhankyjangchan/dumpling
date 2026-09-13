import { ValidationError } from '@validator';
import { isMiddlewareInit } from './utils.mts';
import { MiddlewareInitError } from './errors.mts';
import type { MiddlewareBootstrap, MiddlewareManifest, MiddlewareInit } from './types.mts';

export class Middleware<D = unknown, W = unknown, R extends string = string> {
    readonly #bootstrap: MiddlewareBootstrap<D, W, R>;
    readonly #manifest: MiddlewareManifest;

    public constructor(init: MiddlewareInit<D, W, R>) {
        const error: boolean | ValidationError<any> = isMiddlewareInit(init);
        if (error instanceof ValidationError)
            throw new MiddlewareInitError({
                message: `Middleware init error: ${error.message};\n`,
                entity: error.entity
            });
        this.#bootstrap = init.bootstrap;
        this.#manifest = init.manifest;
    }

    public get bootstrap(): MiddlewareBootstrap<D, W, R> {
        return this.#bootstrap;
    }

    public get manifest(): MiddlewareManifest {
        return this.#manifest;
    }
}
