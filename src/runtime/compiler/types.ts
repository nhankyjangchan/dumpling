import type { Middleware, $Middleware } from '~entities/middleware';
import type { $Route } from '~entities/route/types';
import type { $RequestContext } from '~runtime/http/request-context/types';

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
