import { utils, consts } from '@utils';
import { Validator } from '@validator';
import type { MiddlewareHandler, MiddlewareManifest, MiddlewareInit } from './types.mts';

export class Middleware<D = unknown, W = unknown, R extends string = string> {
    readonly #handler: MiddlewareHandler<D, W, R>;
    readonly #manifest: MiddlewareManifest;

    public constructor(init: MiddlewareInit<D, W, R>) {
        Middleware.isInit<D, W, R>(init);
        this.#handler = init.handler;
        this.#manifest = Object.freeze({ ...init.manifest });
    }

    public get handler(): MiddlewareHandler<D, W, R> {
        return this.#handler;
    }

    public get manifest(): MiddlewareManifest {
        return this.#manifest;
    }

    public static isInit<D = unknown, W = unknown, R extends string = string>(
        target: any
    ): target is MiddlewareInit<D, W, R> {
        return Validator.for<MiddlewareInit<D, W, R>>(target)
            .use({
                message: 'The middleware init is mandatory and must be a plain object;',
                handler: (e: MiddlewareInit<D, W, R>): boolean => utils.isPlainObject(e)
            })
            .use({
                message: 'The middleware handler is mandatory and must be a function;',
                handler: (e: MiddlewareInit<D, W, R>): boolean =>
                    utils.hasOwn(e, consts.handler) && utils.isFunction(e.handler)
            })
            .use({
                message: '',
                handler: (e: MiddlewareInit<D, W, R>): boolean =>
                    Middleware.isManifest(e.manifest)
            })
            .run();
    }

    public static isManifest(target: any): target is MiddlewareManifest {
        return Validator.for<MiddlewareManifest>(target)
            .use({
                message: 'The middleware manifest is mandatory and must be a plain object;',
                handler: (e: MiddlewareManifest): boolean => utils.isPlainObject(e)
            })
            .use({
                message:
                    'The middleware name in manifest was not provided or has an invalid format;',
                handler: (e: MiddlewareManifest): boolean =>
                    utils.hasOwn(e, consts.name)
                    && utils.match(e.name, /^[a-z0-9_-]+@middleware$/)
            })
            .use({
                message:
                    'The middleware hook in manifest was not provided or has an invalid format;',
                handler: (e: MiddlewareManifest): boolean =>
                    utils.hasOwn(e, consts.hook)
                    && utils.match(e.hook, /^on(Request|Response|Error)$/)
            })
            .use({
                message:
                    'The middleware type in manifest was not provided or has an invalid format;',
                handler: (e: MiddlewareManifest): boolean =>
                    utils.hasOwn(e, consts.type) && utils.match(e.type, /^(async|sync)$/)
            })
            .run();
    }
}
