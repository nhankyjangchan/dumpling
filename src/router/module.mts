import { utils } from '@utils';
import { Middleware } from '@middleware';
import { RouteError } from './errors.mts';
import type { $Route } from './types.mts';

export class Route {
    static readonly #INIT_KEYS: $Route.InitKeys = ['name', 'type', 'handler', 'use'];
    static readonly #NAME_RE: RegExp = /^\w+ \/\S*$/u;
    static readonly #TYPE_RE: RegExp = /^(?:sync|async)$/u;

    readonly #name: $Route.Name;
    readonly #type: $Route.Type;
    readonly #handler: $Route.Handler;
    readonly #use: readonly Middleware[];

    public constructor(init: $Route.Init) {
        if (!Route.isInit(init)) {
            throw new RouteError('Invalid route initialization object;');
        }
        this.#name = init.name;
        this.#type = init.type;
        this.#handler = init.handler;
        this.#use = Object.freeze([...init.use]);
    }

    public get name(): $Route.Name {
        return this.#name;
    }

    public get type(): $Route.Type {
        return this.#type;
    }

    public get handler(): $Route.Handler {
        return this.#handler;
    }

    public get use(): readonly Middleware[] {
        return this.#use;
    }

    public static isInit(target: unknown): target is $Route.Init {
        return (
            utils.isPlainObject(target)
            && utils.hasExactKeys(target, Route.#INIT_KEYS)
            && utils.matches(target.name, Route.#NAME_RE)
            && utils.matches(target.type, Route.#TYPE_RE)
            && utils.isFunction(target.handler)
            && Array.isArray(target.use)
            && Route.#checkMiddlewares(target.use)
        );
    }

    static #checkMiddlewares(middlewares: readonly Middleware[]): boolean {
        for (const middleware of middlewares) {
            if (middleware instanceof Middleware) {
                continue;
            }
            throw new RouteError('"Route.use" must be an array of middlewares;');
        }
        return true;
    }
}
