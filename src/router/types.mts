import type { RequestContext } from '@http';
import type { Middleware } from '@middleware';

export type RequestHandler<
    Decorations = unknown,
    WebSockets = unknown,
    Routes extends string = string
> = (rc: RequestContext<Decorations, WebSockets, Routes>) => Response | Promise<Response>;

export interface RouteInit<
    Decorations = unknown,
    WebSockets = unknown,
    Routes extends string = string
> {
    readonly method: string;
    readonly path: `/${string}`;
    readonly onRequest?: Middleware<Decorations, WebSockets, Routes>[];
    readonly onResponse?: Middleware<Decorations, WebSockets, Routes>[];
    readonly onError?: Middleware<Decorations, WebSockets, Routes>[];
    readonly handler: RequestHandler<Decorations, WebSockets, Routes> | Response;
}
