import type { RequestContext } from '@http';

export namespace $Middleware {
    export type Handler = (
        rc: RequestContext
    ) => undefined | Response | Promise<Response | undefined>;

    export type InitKeys = Readonly<(keyof Init)[]>;

    export interface Init {
        readonly handler: Handler;
        readonly manifest: Manifest;
    }

    export type ManifestKeys = Readonly<(keyof Manifest)[]>;

    export interface Manifest {
        readonly name: Name;
        readonly hook: Hook;
        readonly type: Type;
    }

    export type Name = `${string}@middleware`;
    export type Hook = 'onRequest' | 'onResponse' | 'onError';
    export type Type = 'sync#skip' | 'sync#check' | 'async#skip' | 'async#check';
}
