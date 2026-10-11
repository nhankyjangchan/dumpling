import type { $RequestContext } from '@http';
import type { Middleware, $Middleware } from '@middleware';
import type { $Route } from '@route';

export namespace $Compiler {
    export type ServeRoutes = Bun.Serve.Routes<$RequestContext.WebSocketData, $Route.Path>;

    export type ServeHandler = Bun.Serve.Handler<
        Bun.BunRequest,
        Bun.Server<$RequestContext.WebSocketData>,
        Response | undefined
    >;

    export interface Composer {
        onRequest: Middleware[];
        onResponse: Middleware[];
        onError: Middleware[];
    }

    export interface Segments {
        params: string[];
        args: $Middleware.Handler[];
    }
}
