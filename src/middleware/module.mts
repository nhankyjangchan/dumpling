import { utils } from '@utils';
import { Validator } from '@validator';
import type { MiddlewareHandler, MiddlewareManifest, MiddlewareInit } from './types.mts';

export class Middleware<D, W, R extends string> {
    readonly #handler: MiddlewareHandler<D, W, R>;
    readonly #manifest: MiddlewareManifest;

    public constructor(init: MiddlewareInit<D, W, R>) {
        Middleware.isInit<D, W, R>(init);
        this.#handler = init.handler;
        this.#manifest = utils.createShallowFrozenClone(init.manifest);
    }

    public get handler(): MiddlewareHandler<D, W, R> {
        return this.#handler;
    }

    public get manifest(): MiddlewareManifest {
        return this.#manifest;
    }

    public static isInit<D, W, R extends string>(target: any): target is MiddlewareInit<D, W, R> {
        return Validator.for<MiddlewareInit<D, W, R>>(target)
            .use({
                message: '',
                handler: (e: MiddlewareInit<D, W, R>): boolean => utils.isPlainObject(e)
            })
            .use({
                message: '',
                handler: (e: MiddlewareInit<D, W, R>): boolean =>
                    utils.hasOwn(e, 'handler') && utils.isFunction(e.handler)
            })
            .use({
                message: '',
                handler: Middleware.isManifest
            })
            .run();
    }

    public static isManifest(target: any): target is MiddlewareManifest {
        return Validator.for<MiddlewareManifest>(target)
            .use({
                message: '',
                handler: (e: MiddlewareManifest): boolean => utils.isPlainObject(e)
            })
            .use({
                message: '',
                handler: (e: MiddlewareManifest): boolean =>
                    utils.hasOwn(e, 'name') && utils.match(e.name, /^[a-z0-9_-]+@middleware$/)
            })
            .use({
                message: '',
                handler: (e: MiddlewareManifest): boolean =>
                    utils.hasOwn(e, 'hook') && utils.match(e.hook, /^on(Request|Response|Error)$/)
            })
            .use({
                message: '',
                handler: (e: MiddlewareManifest): boolean =>
                    utils.hasOwn(e, 'type') && utils.match(e.name, /^on(async|sync)$/)
            })
            .run();
    }
}
