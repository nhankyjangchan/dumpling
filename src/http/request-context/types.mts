import type { Dumpling } from '@application';
import type { OutgoingResponse } from '../outgoing-response/_index.mjs';

// prettier-ignore
export interface RequestContextImpl<D, W, R extends string> extends RequestContextInit<D, W, R> {
    raise(init?: OutgoingResponse): never;
    build(): Response;
}

export interface RequestContextInit<D, W, R extends string> {
    readonly app: Dumpling<D, W, R>;
    readonly server: Bun.Server<W>;
    readonly request: Request;
    readonly response: OutgoingResponse;
}
