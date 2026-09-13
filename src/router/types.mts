import type { Middleware } from '@middleware';
import type { RequestContext } from '@http';

export type RouteOptions = {
    method?: string;
    path?: `/${string}`;
    onRequest?: Middleware[];
    onResponse?: Middleware[];
    onError?: Middleware[];
    handler: Response | ((rc: RequestContext) => Response | Promise<Response>)
};
