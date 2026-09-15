import type { RequestContext } from '@context';
import type { Middleware } from '@middleware';

export type Listener = EventListener | EventListenerObject;
export type ListenerOptions = AddEventListenerOptions | boolean;

export type RouteHandler<D, W, R extends string> = (rc: RequestContext<D, W, R>) => Response;

export interface DumplingInit {
    name: `${string}@plugin`;
}

export interface RouteInit<D, W, R extends string> {
    method: string;
    path: string;
    onRequest: Middleware<D, W, R>[];
    onResponse: Middleware<D, W, R>[];
    onError: Middleware<D, W, R>[];
    handler: RouteHandler<D, W, R>;
}
