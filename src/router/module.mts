import { Repository } from '@repository';
import { utils } from '@utils';
import { Validator } from '@validator';
import type { RouteInit } from './types.mts';

export class Router<D, W, R extends string> {
    readonly #routes: Repository<string, RouteInit<D, W, R>>;

    public constructor() {
        this.#routes = new Repository<string, RouteInit<D, W, R>>();
    }

    public use(init: RouteInit<D, W, R>): this {
        Router.isRoute<D, W, R>(init);
        const key = `${init.method.toUpperCase()} ${init.path}`;
        const clone: Readonly<RouteInit<D, W, R>> = utils.createShallowFrozenClone(init);
        this.#routes.register(key, clone);
        return this;
    }

    public static isRoute<D, W, R extends string>(target: any): target is RouteInit<D, W, R> {
        return Validator.for<RouteInit<D, W, R>>(target)
            .use({
                message: '',
                handler: (e: RouteInit<D, W, R>): boolean => utils.isPlainObject(e)
            })
            .use({
                message: '',
                handler: (e: RouteInit<D, W, R>): boolean =>
                    utils.hasOwn(e, 'method') && utils.isString(e.method)
            })
            .use({
                message: '',
                handler: (e: RouteInit<D, W, R>): boolean =>
                    utils.hasOwn(e, 'path') && utils.isString(e.path)
            })
            .use({
                message: '',
                handler: (e: RouteInit<D, W, R>): boolean =>
                    utils.hasOwn(e, 'handler') && utils.isFunction(e.handler)
            })
            .run();
    }

    public *[Symbol.iterator](): IterableIterator<[string, RouteInit<D, W, R>]> {
        yield* this.#routes;
    }
}
