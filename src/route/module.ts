import { shared } from '@/module';
import { RouteError } from './errors';
import type { Middleware } from '@middleware/module';
import type { $Route } from './types';

export class Route {
    readonly #name: $Route.Name;
    readonly #path: $Route.Path;
    readonly #method: $Route.Method;
    readonly #middlewares: readonly Middleware[];

    public constructor(init: $Route.Init) {
        shared.assertInitObject(init, RouteError);
        this.#name = init.name;
        this.#path = init.path;
        this.#method = init.method;
        this.#middlewares = init.middlewares;
    }

    public get name(): $Route.Name {
        return this.#name;
    }

    public get path(): $Route.Path {
        return this.#path;
    }

    public get method(): $Route.Method {
        return this.#method;
    }

    public get middlewares(): readonly Middleware[] {
        return this.#middlewares;
    }
}
