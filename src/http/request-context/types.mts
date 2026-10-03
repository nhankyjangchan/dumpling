import type { Dumpling } from '@application';

export namespace $RequestContext {
    export interface Init {
        readonly app: Dumpling;
        readonly server: Bun.Server<WebSocketData>;
        readonly request: Bun.BunRequest<string>;
    }

    export interface StateRegistry {}
    export type State = StateRegistry;

    export interface WebSocketRegistry {}
    export type WebSocketData = WebSocketRegistry;
}
