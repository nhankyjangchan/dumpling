import { HttpError } from './errors.mts';
import type { PlainObject } from '@utils';
import type { Dumpling } from '@application';
import type { OutgoingResponse } from '@http/response';
import type { RequestContextImpl, RequestContextInit } from './types.mts';

export class RequestContext<
    Decorations extends PlainObject,
    WebSockets extends PlainObject,
    Routes extends string
> implements RequestContextImpl<Decorations, WebSockets, Routes> {
    readonly #app: Dumpling<Decorations, WebSockets, Routes>;
    readonly #server: Bun.Server<WebSockets>;
    readonly #request: Request;
    readonly #response: OutgoingResponse;
    public state: PlainObject;

    public constructor(init: RequestContextInit<Decorations, WebSockets, Routes>) {
        this.#app = init.app;
        this.#server = init.server;
        this.#request = init.request;
        this.#response = init.response;
        this.state = {};
    }

    public get app(): Dumpling<Decorations, WebSockets, Routes> {
        return this.#app;
    }

    public get server(): Bun.Server<WebSockets> {
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
