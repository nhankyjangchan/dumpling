import { utils, consts, type PlainObject } from '@utils';
import { MiddlewareError } from './errors.mts';
import type { MiddlewareHandler, MiddlewareManifest, MiddlewareInit } from './types.mts';

export class Middleware<
    Decorations extends PlainObject = PlainObject,
    WebSockets extends PlainObject = PlainObject,
    Routes extends string = string
> {
    readonly #handler: MiddlewareHandler<Decorations, WebSockets, Routes>;
    readonly #manifest: MiddlewareManifest;

    public constructor(init: MiddlewareInit<Decorations, WebSockets, Routes>) {
        if (!Middleware.isInit(init)) {
            throw new MiddlewareError('Invalid middleware initializer received;');
        }
        this.#handler = init.handler;
        this.#manifest = Object.freeze({ ...init.manifest });
    }

    public get handler(): MiddlewareHandler<Decorations, WebSockets, Routes> {
        return this.#handler;
    }

    public get manifest(): MiddlewareManifest {
        return this.#manifest;
    }

    public static isInit(target: unknown): target is MiddlewareInit {
        return (
            utils.isPlainObject(target)
            && utils.hasOwn(target, consts.handler)
            && utils.isFunction(target.handler)
            && utils.hasOwn(target, consts.manifest)
            && Middleware.isManifest(target.manifest)
        );
    }

    public static isManifest(target: unknown): target is MiddlewareManifest {
        return (
            utils.isPlainObject(target)
            && utils.hasOwnMatch(target, consts.name, /^[a-z0-9_-]+@middleware$/i)
            && utils.hasOwnMatch(target, consts.hook, /^on(?:Request|Response|Error)$/)
            && utils.hasOwnMatch(target, consts.type, /^(?:sync|async)$/)
            && utils.hasOwnMatch(target, consts.response, /^(?:true|false)$/)
        );
    }
}
