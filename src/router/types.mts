import type { RequestContext } from '@http';
import type { Middleware } from '@middleware';

export type RequestHandler<D, W, R extends string> = (
    rc: RequestContext<D, W, R>
) => Response | Promise<Response>;

export interface RouteInit<D, W, R extends string> {
    readonly method: string;
    readonly path: `/${string}`;
    readonly onRequest?: Middleware<D, W, R>[];
    readonly onResponse?: Middleware<D, W, R>[];
    readonly onError?: Middleware<D, W, R>[];
    readonly handler: RequestHandler<D, W, R> | Response;
}
