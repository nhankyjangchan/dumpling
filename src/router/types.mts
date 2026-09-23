import type { RequestContext } from '@http';
import type { Middleware } from '@middleware';

export namespace $Router {
    export type RouteKeys = Readonly<(keyof Route)[]>;

    export interface Route {
        readonly method: string;
        readonly path: `/${string}`;
        readonly use: readonly Middleware[];
        readonly handler: Handler;
    }

    export type RouteId = `${string} /${string}`;
    export type Handler = (rc: RequestContext) => void | Promise<void>;
}
