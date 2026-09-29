import type { RequestContext } from '@http';

export namespace $Middleware {
    export interface Init {
        readonly name: Name;
        readonly hook: Hook;
        readonly type: Type;
        readonly handler: Handler;
    }

    export type Name = `${string}@middleware`;
    export type Hook = 'onRequest' | 'onResponse' | 'onError';
    export type Type = 'sync#skip' | 'sync#check' | 'async#skip' | 'async#check';
    export type Handler = (rc: RequestContext) => Response | void | Promise<Response | void>;
}
