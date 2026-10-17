import type { $RequestContext } from '@http/request-context/types';
import type { Middleware, $Middleware } from '@middleware/index';
import type { $Route } from '@route/types';

export namespace $Compiler {
    export type ServeRoutes = Bun.Serve.Routes<$RequestContext.WebSocketData, $Route.Path>;

    export type ServeHandler = Bun.Serve.Handler<
        Bun.BunRequest,
        Bun.Server<$RequestContext.WebSocketData>,
        Response | undefined
    >;

    export interface Composer {
        readonly onRequest: Middleware[];
        readonly onResponse: Middleware[];
        readonly onError: Middleware[];
    }

    export interface Segments {
        readonly params: string[];
        readonly args: $Middleware.Handler[];
    }
}
