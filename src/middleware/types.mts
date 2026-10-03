import type { RequestContext } from '@http';

export namespace $Middleware {
    export interface Init {
        readonly name: Name;
        readonly hook: Hook;
        readonly mode: Mode;
        readonly flow: Flow;
        readonly handler: Handler;
    }

    export type Name = `${string}@middleware`;
    export type Hook = 'onRequest' | 'onResponse' | 'onError';
    export type Mode = 'async' | 'sync';
    export type Flow = 'halt' | 'pass';
    export type Handler = (rc: RequestContext) => MaybeResponse | Promise<MaybeResponse>;

    export type MaybeResponse = Response | void;
}
