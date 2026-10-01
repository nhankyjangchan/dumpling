import type { RequestContext } from '@http';

export namespace $Middleware {
    export interface Init {
        readonly name: Name;
        readonly hook: Hook;
        readonly type: Type;
        readonly check: boolean;
        readonly handler: Handler;
    }

    export type Name = `${string}@middleware`;
    export type Hook = 'onRequest' | 'onResponse' | 'onError';
    export type Type = 'sync' | 'async';
    export type Handler = (rc: RequestContext) => Response | void | Promise<Response | void>;
}
