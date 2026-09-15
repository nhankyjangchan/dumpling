import type { Dumpling } from '@application';
import type { OutgoingResponse } from '@response';
import type { RequestContextInit } from './types.mts';

export class RequestContext<D, W, R extends string> implements RequestContextInit<D, W, R> {
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
}
