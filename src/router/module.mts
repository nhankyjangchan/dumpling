import { Repository } from '@repository';
import { utils } from '@utils';
import { Validator } from '@validator';
import type { RouteInit } from './types.mts';

export class Router<
    Decorations = unknown,
    WebSockets = unknown,
    Routes extends string = string
> {
    readonly #routes: Repository<string, RouteInit<Decorations, WebSockets, Routes>>;

    public constructor() {
        this.#routes = new Repository<string, RouteInit<Decorations, WebSockets, Routes>>();
    }

    public use(init: RouteInit<Decorations, WebSockets, Routes>): this {
        Router.isRoute<Decorations, WebSockets, Routes>(init);
        const key = `${init.method.toUpperCase()} ${init.path}`;
        const route: Readonly<RouteInit<Decorations, WebSockets, Routes>> = Object.freeze({
            ...init
        });
        this.#routes.register(key, route);
        return this;
    }

    public static isRoute<Decorations, WebSockets, Routes extends string>(
        target: RouteInit<Decorations, WebSockets, Routes>
    ): target is RouteInit<Decorations, WebSockets, Routes> {
        return Validator.for(target)
            .use({
                message: '',
                handler: (entity: RouteInit<Decorations, WebSockets, Routes>): boolean =>
                    utils.isPlainObject(entity)
            })
            .use({
                message: '',
                handler: (entity: RouteInit<Decorations, WebSockets, Routes>): boolean =>
                    utils.hasOwn(entity, 'method') && utils.isString(entity.method)
            })
            .use({
                message: '',
                handler: (entity: RouteInit<Decorations, WebSockets, Routes>): boolean =>
                    utils.hasOwn(entity, 'path') && utils.isString(entity.path)
            })
            .use({
                message: '',
                handler: (entity: RouteInit<Decorations, WebSockets, Routes>): boolean =>
                    utils.hasOwn(entity, 'handler') && utils.isFunction(entity.handler)
            })
            .run();
    }

    public *[Symbol.iterator](): IterableIterator<
        [string, RouteInit<Decorations, WebSockets, Routes>]
    > {
        yield* this.#routes;
    }
}
