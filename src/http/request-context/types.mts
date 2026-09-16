import type { PlainObject } from '@utils';
import type { OutgoingResponse, OutgoingResponseInit } from '@http/response';
import type { Dumpling } from '@application';

export interface RequestContextImpl<
    Decorations extends PlainObject,
    WebSockets extends PlainObject,
    Routes extends string
> extends RequestContextInit<Decorations, WebSockets, Routes> {
    raise(init?: OutgoingResponse): never;
    build(): Response;
}

export interface RequestContextInit<
    Decorations extends PlainObject,
    WebSockets extends PlainObject,
    Routes extends string
> {
    readonly app: Dumpling<Decorations, WebSockets, Routes>;
    readonly server: Bun.Server<WebSockets>;
    readonly request: Request;
    readonly response: OutgoingResponse;
    state: PlainObject;
}

export type HttpErrorInit = OutgoingResponseInit;
