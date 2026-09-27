import type { Middleware } from '@middleware';
import type { $Route } from './types.mts';

export class Route {
    readonly #name: $Route.Name;
    readonly #type: $Route.Type;
    readonly #use: readonly Middleware[];
    readonly #handler: $Route.Handler;

    public constructor(init: $Route.Init) {
        this.#name = init.name;
        this.#type = init.type;
        this.#use = init.use;
        this.#handler = init.handler;
    }

    public get name(): $Route.Name {
        return this.#name;
    }

    public get type(): $Route.Type {
        return this.#type;
    }

    public get use(): readonly Middleware[] {
        return this.#use;
    }

    public get handler(): $Route.Handler {
        return this.#handler;
    }
}
