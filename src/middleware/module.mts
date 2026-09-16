import { utils, consts } from '@utils';
import { Validator } from '@validator';
import type { MiddlewareHandler, MiddlewareManifest, MiddlewareInit } from './types.mts';

export class Middleware<
    Decorations = unknown,
    WebSockets = unknown,
    Routes extends string = string
> {
    readonly #handler: MiddlewareHandler<Decorations, WebSockets, Routes>;
    readonly #manifest: MiddlewareManifest;

    public constructor(init: MiddlewareInit<Decorations, WebSockets, Routes>) {
        Middleware.isInit<Decorations, WebSockets, Routes>(init);
        this.#handler = init.handler;
        this.#manifest = Object.freeze({ ...init.manifest });
    }

    public get handler(): MiddlewareHandler<Decorations, WebSockets, Routes> {
        return this.#handler;
    }

    public get manifest(): MiddlewareManifest {
        return this.#manifest;
    }

    public static isInit<
        Decorations = unknown,
        WebSockets = unknown,
        Routes extends string = string
    >(
        target: MiddlewareInit<Decorations, WebSockets, Routes>
    ): target is MiddlewareInit<Decorations, WebSockets, Routes> {
        return Validator.for(target)
            .use({
                message: 'The middleware init is mandatory and must be a plain object;',
                handler: (entity: MiddlewareInit<Decorations, WebSockets, Routes>): boolean =>
                    utils.isPlainObject(entity)
            })
            .use({
                message: 'The middleware handler is mandatory and must be a function;',
                handler: (entity: MiddlewareInit<Decorations, WebSockets, Routes>): boolean =>
                    utils.hasOwn(entity, consts.handler) && utils.isFunction(entity.handler)
            })
            .use({
                message: '',
                handler: (entity: MiddlewareInit<Decorations, WebSockets, Routes>): boolean =>
                    Middleware.isManifest(entity.manifest)
            })
            .run();
    }

    public static isManifest(target: MiddlewareManifest): target is MiddlewareManifest {
        return Validator.for(target)
            .use({
                message: 'The middleware manifest is mandatory and must be a plain object;',
                handler: (entity: MiddlewareManifest): boolean => utils.isPlainObject(entity)
            })
            .use({
                message:
                    'The middleware name in manifest was not provided or has an invalid format;',
                handler: (entity: MiddlewareManifest): boolean =>
                    utils.hasOwn(entity, consts.name)
                    && utils.match(entity.name, /^[a-z0-9_-]+@middleware$/)
            })
            .use({
                message:
                    'The middleware hook in manifest was not provided or has an invalid format;',
                handler: (entity: MiddlewareManifest): boolean =>
                    utils.hasOwn(entity, consts.hook)
                    && utils.match(entity.hook, /^on(?:Request|Response|Error)$/)
            })
            .use({
                message:
                    'The middleware type in manifest was not provided or has an invalid format;',
                handler: (entity: MiddlewareManifest): boolean =>
                    utils.hasOwn(entity, consts.type)
                    && utils.match(entity.type, /^(?:async|sync)$/)
            })
            .run();
    }
}
