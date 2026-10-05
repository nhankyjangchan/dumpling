import type { $RequestContext } from '@http';
import type { $Route } from '@route';

export namespace $Compiler {
    export type ServeRoutes = Bun.Serve.Routes<$RequestContext.WebSocketData, $Route.Path>;

    export type ServeHandler = Bun.Serve.Handler<
        Bun.BunRequest,
        Bun.Server<$RequestContext.WebSocketData>,
        Response | undefined
    >;
}
