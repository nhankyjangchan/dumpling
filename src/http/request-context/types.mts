import type { OutgoingResponse, OutgoingResponseInit } from '@http/response';
import type { Dumpling } from '@application';

export interface RequestContextImpl extends RequestContextInit {
    raise(init?: OutgoingResponse): never;
    build(): Response;
}

export interface RequestContextInit {
    readonly app: Dumpling;
    readonly server: Bun.Server<undefined>;
    readonly request: Request;
    readonly response: OutgoingResponse;
    state: Record<PropertyKey, unknown>;
}

export type HttpErrorInit = OutgoingResponseInit;
