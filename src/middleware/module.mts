import type { MiddlewareBootstrap, MiddlewareManifest, MiddlewareInit } from './types.mts';

export class Middleware<D, W, R extends string> {
    readonly #bootstrap: MiddlewareBootstrap<D, W, R>;
    readonly #manifest: MiddlewareManifest;

    public constructor(init: MiddlewareInit<D, W, R>) {
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
