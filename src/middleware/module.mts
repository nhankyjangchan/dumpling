import type { $Middleware } from './types.mts';

export class Middleware {
    readonly #name: $Middleware.Name;
    readonly #hook: $Middleware.Hook;
    readonly #type: $Middleware.Type;
    readonly #halt: boolean;
    readonly #handler: $Middleware.Handler;

    public constructor(init: $Middleware.Init) {
        this.#name = init.name;
        this.#hook = init.hook;
        this.#type = init.type;
        this.#halt = init.halt;
        this.#handler = init.handler;
    }

    public get name(): $Middleware.Name {
        return this.#name;
    }

    public get hook(): $Middleware.Hook {
        return this.#hook;
    }

    public get type(): $Middleware.Type {
        return this.#type;
    }

    public get halt(): boolean {
        return this.#halt;
    }

    public get handler(): $Middleware.Handler {
        return this.#handler;
    }
}
