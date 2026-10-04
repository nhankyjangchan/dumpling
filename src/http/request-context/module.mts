import { OutgoingResponse, type $OutgoingResponse } from '@http/response';
import { HttpError } from './errors.mts';
import type { Plugin } from '@plugin';
import type { $RequestContext } from './types.mts';

export class RequestContext {
    readonly #app: Plugin;
    readonly #server: Bun.Server<$RequestContext.WebSocketData>;
    readonly #request: Bun.BunRequest<string>;
    readonly #response: OutgoingResponse;

    #state?: Partial<$RequestContext.State>;
    #error?: HttpError | undefined;

    public constructor(init: $RequestContext.Init) {
        this.#app = init.app;
        this.#server = init.server;
        this.#request = init.request;
        this.#response = new OutgoingResponse();
    }

    public get app(): Plugin {
        return this.#app;
    }

    public get server(): Bun.Server<$RequestContext.WebSocketData> {
        return this.#server;
    }

    public get request(): Bun.BunRequest<string> {
        return this.#request;
    }

    public get response(): OutgoingResponse {
        return this.#response;
    }

    public get state(): Partial<$RequestContext.State> {
        return (this.#state ??= {});
    }

    public set state(state: Partial<$RequestContext.State>) {
        this.#state = state;
    }

    public get error(): HttpError | undefined {
        return this.#error;
    }

    public set error(error: HttpError) {
        this.#error = error;
    }

    public is(type: Lowercase<string>): boolean {
        const contentType: string | null = this.#request.headers.get('content-type');
        return contentType?.toLowerCase().includes(type) ?? false;
    }

    public raise(init?: $OutgoingResponse.Init): never {
        this.#error = new HttpError(init);
        throw this.#error;
    }
}
