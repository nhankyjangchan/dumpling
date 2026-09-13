import type { ResponseLike, Mutable } from './types.mjs';

export class OutgoingResponse implements Mutable, ResponseLike {
    #status: number;
    #message: string;
    #headers: Headers;
    #body: BodyInit | null;
    #writable: boolean;
    #readable: boolean;

    public constructor(init: ResponseLike, modifiers?: Mutable) {
        this.#status = init.status;
        this.#message = init.message;
        this.#headers = init.headers;
        this.#body = init.body;
        this.#writable = modifiers?.writable || true;
        this.#readable = modifiers?.readable || true;
    }

    public get status(): number {
        return this.#status;
    }

    public set status(status: number) {
        this.#status = status;
    }

    public get message(): string {
        return this.#message;
    }

    public set message(message: string) {
        this.#message = message;
    }

    public get headers(): Headers {
        return this.#headers;
    }

    public set headers(headers: Headers) {
        this.#headers = headers;
    }

    public get body(): BodyInit | null {
        return this.#body;
    }

    public set body(body: BodyInit | null) {
        this.#body = body;
    }

    public get writable(): boolean {
        return this.#writable;
    }

    public set writable(writable: boolean) {
        this.#writable = writable;
    }

    public get readable(): boolean {
        return this.#readable;
    }

    public set readable(readable: boolean) {
        this.#readable = readable;
    }

    public build(): Response {
        return new Response(this.#body, {
            status: this.#status,
            statusText: this.#message,
            headers: this.#headers
        });
    }
}
