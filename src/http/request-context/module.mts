import { OutgoingResponse } from '@http/response';
import { HttpError } from './errors.mts';
import type { Dumpling } from '@application';
import type { $RequestContext } from './types.mts';

export class RequestContext {
    readonly #app: Dumpling;
    readonly #server: Bun.Server<undefined>;
    readonly #request: Request;
    readonly #response: OutgoingResponse;
    public state: Record<PropertyKey, unknown>;

    public constructor(init: $RequestContext.Init) {
        this.#app = init.app;
        this.#server = init.server;
        this.#request = init.request;
        this.#response = new OutgoingResponse();
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
}
