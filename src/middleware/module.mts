import { utils } from '@utils';
import { MiddlewareError } from './errors.mts';
import type { $Middleware } from './types.mts';

export class Middleware {
    static readonly #INIT_KEYS: $Middleware.InitKeys = ['handler', 'manifest'];
    static readonly #MANIFEST_KEYS: $Middleware.ManifestKeys = ['name', 'hook', 'type'];
    static readonly #HOOK_RE: RegExp = /^on(?:Request|Response|Error)$/u;
    static readonly #TYPE_RE: RegExp = /^(?:sync#(?:skip|check)|async#(?:skip|check))$/u;

    readonly #handler: $Middleware.Handler;
    readonly #manifest: $Middleware.Manifest;

    public constructor(init: $Middleware.Init) {
        if (!Middleware.isInit(init)) {
            throw new MiddlewareError('Invalid middleware initialization object;');
        }
        this.#handler = init.handler;
        this.#manifest = Object.freeze({ ...init.manifest });
    }

    public get handler(): $Middleware.Handler {
        return this.#handler;
    }

    public get manifest(): $Middleware.Manifest {
        return this.#manifest;
    }

    public static isInit(target: unknown): target is $Middleware.Init {
        return (
            utils.isPlainObject(target)
            && utils.hasExactKeys(target, Middleware.#INIT_KEYS)
            && utils.isFunction(target.handler)
            && Middleware.isManifest(target.manifest)
        );
    }

    public static isManifest(target: unknown): target is $Middleware.Manifest {
        return (
            utils.isPlainObject(target)
            && utils.hasExactKeys(target, Middleware.#MANIFEST_KEYS)
            && utils.hasOnlyStringValues(target)
            && target.name.endsWith('@middleware')
            && Middleware.#HOOK_RE.test(target.hook)
            && Middleware.#TYPE_RE.test(target.type)
        );
    }
}
