import type { $OutgoingResponse } from './types.mts';

export class OutgoingResponse {
    #status: number | undefined;
    #message: string | undefined;
    #headers: Headers | undefined;
    #body: BodyInit | null | undefined;

    public constructor(init?: $OutgoingResponse.Init) {
        this.#status = init?.status;
        this.#message = init?.message;
        this.#headers = init?.headers;
        this.#body = init?.body;
    }

    public get status(): number {
        return (this.#status ??= 200);
    }

    public set status(status: number) {
        this.#status = status;
    }

    public get message(): string {
        return (this.#message ??= 'Ok');
    }

    public set message(message: string) {
        this.#message = message;
    }

    public get headers(): Headers {
        return (this.#headers ??= new Headers());
    }

    public set headers(headers: Headers) {
        this.#headers = headers;
    }

    public get body(): BodyInit | null {
        return (this.#body ??= null);
    }

    public set body(body: BodyInit | null) {
        this.#body = body;
    }

    public build(): Response {
        return new Response(this.body, {
            status: this.status,
            statusText: this.message,
            headers: this.headers
        });
    }
}
