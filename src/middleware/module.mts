import type { MiddlewareHandler, MiddlewareManifest, MiddlewareInit } from './types.mts';

export class Middleware<D, W, R extends string> implements MiddlewareInit<D, W, R> {
    readonly #handler: MiddlewareHandler<D, W, R>;
    readonly #manifest: MiddlewareManifest;

    public constructor(init: MiddlewareInit<D, W, R>) {
        this.#handler = init.handler;
        this.#manifest = init.manifest;
    }

    public get handler(): MiddlewareHandler<D, W, R> {
        return this.#handler;
    }

    public get manifest(): MiddlewareManifest {
        return this.#manifest;
    }
}
