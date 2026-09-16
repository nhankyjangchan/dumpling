import { utils, consts, type PlainObject } from '@utils';
import { RouterError } from './errors.mts';
import type { RouteInit } from './types.mts';

export class Router<
    Decorations extends PlainObject = PlainObject,
    WebSockets extends PlainObject = PlainObject,
    Routes extends string = string
> {
    readonly #routes: Map<string, RouteInit<Decorations, WebSockets, Routes>>;

    public constructor() {
        this.#routes = new Map();
    }

    public use(init: RouteInit<Decorations, WebSockets, Routes>): this {
        if (Router.isRoute(init)) {
            throw new RouterError('Invalid route initializer received;');
        }
        const key = `${init.method.toUpperCase()} ${init.path}`;
        this.#routes.set(key, Object.freeze({ ...init }));
        return this;
    }

    public static isRoute(target: unknown): target is RouteInit {
        return (
            utils.isPlainObject(target)
            && utils.hasOwnMatch(target, consts.method, /^[\w]+$/iu)
            && utils.hasOwnMatch(target, consts.path, /^\/[^?\s#]*(?:\?[^#\s]*)?(?:#\S*)?$/iu)
            && utils.hasOwn(target, consts.handler)
            && utils.isFunction(target.handler)
        );
    }

    public *[Symbol.iterator](): IterableIterator<
        [string, RouteInit<Decorations, WebSockets, Routes>]
    > {
        yield* this.#routes.entries();
    }
}
