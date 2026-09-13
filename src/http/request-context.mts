import { HttpError } from './errors.mts';
import type { Application, Listener, ListenerOptions } from '@application';
import type { OutgoingResponse } from './outgoing-response.mts';
import type { MutableError } from './types.mts';

export class RequestContext<D, W, R extends string> {
    readonly #app: Application<D, W, R>;
    readonly #server: Bun.Server<W>;
    readonly #request: Request;
    readonly #response: OutgoingResponse;

    public constructor(
        app: Application<D, W, R>,
        server: Bun.Server<W>,
        request: Request,
        response: OutgoingResponse
    ) {
        this.#app = app;
        this.#server = server;
        this.#request = request;
        this.#response = response;
    }

    public get app(): Application<D, W, R> {
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

    public throw(
        response: OutgoingResponse,
        modifiers: MutableError,
        options?: ErrorOptions
    ): never {
        throw new HttpError(response, modifiers, options);
    }

    public upgrade(options?: any): boolean {
        return this.#server.upgrade(this.#request, options);
    }

    public on(type: string, listener: Listener, options?: ListenerOptions): this {
        this.#app.addEventListener(type, listener, options);
        return this;
    }

    public emit(e: Event): this {
        this.#app.dispatchEvent(e);
        return this;
    }

    public off(type: string, listener: Listener, options?: ListenerOptions): this {
        this.#app.removeEventListener(type, listener, options);
        return this;
    }
}
