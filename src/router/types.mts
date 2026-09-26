import type { RequestContext } from '@http';
import type { Middleware } from '@middleware';

export namespace $Route {
    export type InitKeys = Readonly<(keyof Init)[]>;

    export interface Init {
        readonly name: Name;
        readonly type: Type;
        readonly handler: Handler;
        readonly use: readonly Middleware[];
    }

    export type Name = `${string} /${string}`;
    export type Type = 'sync' | 'async';
    export type Handler = (rc: RequestContext) => void | Promise<void>;
}
