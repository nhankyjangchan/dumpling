import { HttpError } from './errors.mts';
import type { Dumpling } from '@application';
import type { OutgoingResponse } from '@http/response';
import type { RequestContextImpl, RequestContextInit } from './types.mts';

export class RequestContext implements RequestContextImpl {
    readonly #app: Dumpling;
    readonly #server: Bun.Server<undefined>;
    readonly #request: Request;
    readonly #response: OutgoingResponse;
    public state: Record<PropertyKey, unknown>;

    public constructor(init: RequestContextInit) {
        this.#app = init.app;
        this.#server = init.server;
        this.#request = init.request;
        this.#response = init.response;
        this.state = {};
    }

    public get app(): Dumpling {
        return this.#app;
    }

    public get server(): Bun.Server<undefined> {
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
