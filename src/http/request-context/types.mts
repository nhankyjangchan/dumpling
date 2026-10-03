import type { Plugin } from '@plugin';

export namespace $RequestContext {
    export interface Init {
        readonly app: Plugin;
        readonly server: Bun.Server<WebSocketData>;
        readonly request: Bun.BunRequest<string>;
    }

    export interface StateRegistry {}
    export type State = StateRegistry;

    export interface WebSocketRegistry {}
    export type WebSocketData = WebSocketRegistry;
}
