import type { Middleware } from '@middleware';
import type { $Route } from './types.mts';

export class Route {
    readonly #name: $Route.Name;
    readonly #path: $Route.Path;
    readonly #method: string;
    readonly #handlers: readonly Middleware[];

    public constructor(init: $Route.Init) {
        this.#name = init.name;
        this.#path = init.path;
        this.#method = init.method;
        this.#handlers = init.handlers;
    }

    public get name(): $Route.Name {
        return this.#name;
    }

    public get path(): $Route.Path {
        return this.#path;
    }

    public get method(): string {
        return this.#method;
    }

    public get handlers(): readonly Middleware[] {
        return this.#handlers;
    }
}
