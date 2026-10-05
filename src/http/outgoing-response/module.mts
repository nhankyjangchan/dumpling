import type { $OutgoingResponse } from './types.mts';

export class OutgoingResponse {
    #status: number;
    #statusText: string;
    #headers: Headers;
    #body: BodyInit | null;

    public constructor(init?: $OutgoingResponse.Init) {
        this.#status = init?.status ?? 200;
        this.#statusText = init?.statusText ?? 'OK';
        this.#headers = init?.headers ?? new Headers();
        this.#body = init?.body ?? null;
    }

    public get status(): number {
        return this.#status;
    }

    public set status(status: number) {
        this.#status = status;
    }

    public get statusText(): string {
        return this.#statusText;
    }

    public set statusText(statusText: string) {
        this.#statusText = statusText;
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

    public build(): Response {
        return new Response(this.#body, {
            status: this.#status,
            statusText: this.#statusText,
            headers: this.#headers
        });
    }
}
