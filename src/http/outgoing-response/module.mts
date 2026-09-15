import type { OutgoingResponseImpl, OutgoingResponseInit } from './types.mts';

export class OutgoingResponse implements OutgoingResponseImpl {
    #status: number;
    #message: string;
    #headers: Headers;
    #body: BodyInit | null;

    public constructor(init?: OutgoingResponseInit) {
        this.#status = init?.status ?? 200;
        this.#message = init?.message ?? 'Ok';
        this.#headers = init?.headers ?? new Headers();
        this.#body = init?.body ?? null;
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

    public toResponse(): Response {
        return new Response(this.#body, {
            status: this.#status,
            statusText: this.#message,
            headers: this.#headers
        });
    }
}
