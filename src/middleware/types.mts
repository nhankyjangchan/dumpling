import type { RequestContext } from '@http';

export namespace $Middleware {
    export interface Init {
        readonly name: Name;
        readonly hook: Hook;
        readonly type: Type;
        readonly halt: boolean;
        readonly handler: Handler;
    }

    export type Name = `${string}@middleware`;
    export type Hook = 'onRequest' | 'onResponse' | 'onError';
    export type Type = 'sync' | 'async';
    export type Handler = (rc: RequestContext) => MaybeResponse | Promise<MaybeResponse>;

    export type MaybeResponse = Response | undefined;
}
