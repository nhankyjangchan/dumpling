import type { MiddlewareHandler, MiddlewareManifest, MiddlewareInit } from './types.mts';

export class Middleware {
    readonly #handler: MiddlewareHandler;
    readonly #manifest: MiddlewareManifest;

    public constructor(init: MiddlewareInit) {
        this.#handler = init.handler;
        this.#manifest = Object.freeze({ ...init.manifest });
    }

    public get handler(): MiddlewareHandler {
        return this.#handler;
    }

    public get manifest(): MiddlewareManifest {
        return this.#manifest;
    }
}
