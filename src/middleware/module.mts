import type { $Middleware } from './types.mts';

export class Middleware {
    readonly #name: $Middleware.Name;
    readonly #hook: $Middleware.Hook;
    readonly #mode: $Middleware.Mode;
    readonly #flow: $Middleware.Flow;
    readonly #handler: $Middleware.Handler;

    public constructor(init: $Middleware.Init) {
        this.#name = init.name;
        this.#hook = init.hook;
        this.#mode = init.mode;
        this.#flow = init.flow;
        this.#handler = init.handler;
    }

    public get name(): $Middleware.Name {
        return this.#name;
    }

    public get hook(): $Middleware.Hook {
        return this.#hook;
    }

    public get mode(): $Middleware.Mode {
        return this.#mode;
    }

    public get flow(): $Middleware.Flow {
        return this.#flow;
    }

    public get handler(): $Middleware.Handler {
        return this.#handler;
    }
}
