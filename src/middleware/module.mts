import type { $Middleware } from './types.mts';

export class Middleware {
    readonly #name: $Middleware.Name;
    readonly #hook: $Middleware.Hook;
    readonly #type: $Middleware.Type;
    readonly #check: boolean;
    readonly #handler: $Middleware.Handler;

    public constructor(init: $Middleware.Init) {
        this.#name = init.name;
        this.#hook = init.hook;
        this.#type = init.type;
        this.#check = init.check;
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

    public get check(): boolean {
        return this.#check;
    }

    public get handler(): $Middleware.Handler {
        return this.#handler;
    }
}
