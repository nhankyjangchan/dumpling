import { Repository } from '@repository';
import type { RouteInit } from './types.mts';

export class Router<D, W, R extends string> {
    readonly #routes: Repository<string, RouteInit<D, W, R>>;

    public constructor() {
        this.#routes = new Repository<string, RouteInit<D, W, R>>();
    }

    public route(init: RouteInit<D, W, R>): this {
        const key = `${init.method.toUpperCase()} ${init.path}`;
        this.#routes.register(key, init);
        return this;
    }

    public *[Symbol.iterator](): IterableIterator<[string, RouteInit<D, W, R>]> {
        yield* this.#routes;
    }
}
