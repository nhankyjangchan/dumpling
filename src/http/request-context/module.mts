import { HttpError } from './errors.mts';
import type { Dumpling } from '@application';
import type { OutgoingResponse } from '../outgoing-response/_index.mts';
import type { RequestContextImpl, RequestContextInit } from './types.mts';

export class RequestContext<D, W, R extends string> implements RequestContextImpl<D, W, R> {
    readonly #app: Dumpling<D, W, R>;
    readonly #server: Bun.Server<W>;
    readonly #request: Request;
    readonly #response: OutgoingResponse;

    public constructor(init: RequestContextInit<D, W, R>) {
        this.#app = init.app;
        this.#server = init.server;
        this.#request = init.request;
        this.#response = init.response;
    }

    public get app(): Dumpling<D, W, R> {
        return this.#app;
    }

    public get server(): Bun.Server<W> {
        return this.#server;
    }

    public get request(): Request {
        return this.#request;
    }

    public get response(): OutgoingResponse {
        return this.#response;
    }

    public raise(init?: OutgoingResponse): never {
        throw new HttpError(init);
    }

    public build(): Response {
        return this.#response.toResponse();
    }
}
