import type { Dumpling } from '@application';
import type { OutgoingResponse } from '../outgoing-response/_index.mjs';

export interface RequestContextImpl<
    Decorations,
    WebSockets,
    Routes extends string
> extends RequestContextInit<Decorations, WebSockets, Routes> {
    raise(init?: OutgoingResponse): never;
    build(): Response;
}

export interface RequestContextInit<Decorations, WebSockets, Routes extends string> {
    readonly app: Dumpling<Decorations, WebSockets, Routes>;
    readonly server: Bun.Server<WebSockets>;
    readonly request: Request;
    readonly response: OutgoingResponse;
}
