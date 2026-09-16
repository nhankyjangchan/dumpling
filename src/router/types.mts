import type { PlainObject } from '@utils';
import type { RequestContext } from '@http';
import type { Middleware } from '@middleware';

export type RouteHandler<
    Decorations extends PlainObject,
    WebSockets extends PlainObject,
    Routes extends string = string
> = (rc: RequestContext<Decorations, WebSockets, Routes>) => Response | Promise<Response>;

export interface RouteInit<
    Decorations extends PlainObject = PlainObject,
    WebSockets extends PlainObject = PlainObject,
    Routes extends string = string
> {
    readonly method: string;
    readonly path: `/${string}`;
    readonly onRequest?: Middleware<Decorations, WebSockets, Routes>[];
    readonly onResponse?: Middleware<Decorations, WebSockets, Routes>[];
    readonly onError?: Middleware<Decorations, WebSockets, Routes>[];
    readonly handler: RouteHandler<Decorations, WebSockets, Routes> | Response;
}
