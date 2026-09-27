import type { $Middleware } from './types.mts';

export class Middleware {
    readonly #manifest: $Middleware.Manifest;
    readonly #handler: $Middleware.Handler;

    public constructor(init: $Middleware.Init) {
        this.#manifest = init.manifest;
        this.#handler = init.handler;
    }

    public get manifest(): $Middleware.Manifest {
        return this.#manifest;
    }

    public get handler(): $Middleware.Handler {
        return this.#handler;
    }
}
