import { utils } from '@utils';
import { Middleware } from '@middleware';
import { RouterError } from './errors.mts';
import type { $Router } from './types.mts';

export class Router {
    static readonly #ROUTE_KEYS: $Router.RouteKeys = [
        'method',
        'path',
        'type',
        'use',
        'handler'
    ];
    static readonly #TYPE_RE: RegExp = /^(?:sync|async)$/u;

    readonly #routes: Map<$Router.RouteId, $Router.Route>;

    public constructor() {
        this.#routes = new Map();
    }

    public get routes(): MapIterator<$Router.Route> {
        return this.#routes.values();
    }

    public register(route: $Router.Route): void {
        if (!Router.#isRoute(route)) {
            throw new RouterError('Invalid route signature;');
        }
        if (route.use.length > 0) {
            Router.#checkMiddlewares(route.use);
        }
        const key: $Router.RouteId = `${route.method} ${route.path}`;
        if (this.#routes.has(key)) {
            throw new RouterError(`Route "${key}" already exists;`);
        }
        const clone = { ...route, use: Object.freeze([...route.use]) };
        this.#routes.set(key, Object.freeze(clone));
    }

    static #isRoute(target: unknown): target is $Router.Route {
        return (
            utils.isPlainObject(target)
            && utils.hasExactKeys(target, Router.#ROUTE_KEYS)
            && utils.isString(target.method)
            && utils.isString(target.path)
            && utils.isString(target.type)
            && utils.isFunction(target.handler)
            && Router.#TYPE_RE.test(target.type)
            && Array.isArray(target.use)
        );
    }

    static #checkMiddlewares(middlewares: readonly Middleware[]): void {
        for (const middleware of middlewares) {
            if (middleware instanceof Middleware) {
                continue;
            }
            throw new RouterError('"Route.use" must be an array of middlewares;');
        }
    }
}
