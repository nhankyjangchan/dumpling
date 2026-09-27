import type { RequestContext } from '@http';
import type { Middleware } from '@middleware';

export namespace $Route {
    export interface Init {
        readonly name: Name;
        readonly type: Type;
        readonly use: readonly Middleware[];
        readonly handler: Handler;
    }

    export type Name = `${string} /${string}`;
    export type Type = 'sync' | 'async';
    export type Handler = (rc: RequestContext) => void | Promise<void>;
}
