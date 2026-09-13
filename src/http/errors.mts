import type { MutableError } from './types.mts';
import type { OutgoingResponse } from './outgoing-response.mts';

export class HttpError extends Error implements MutableError {
    #response: OutgoingResponse;
    #writable: boolean;
    #readable: boolean;
    #handled: boolean;

    public constructor(
        response: OutgoingResponse,
        modifiers?: MutableError,
        options?: ErrorOptions
    ) {
        super(response.message, options);
        this.#response = response;
        this.#writable = modifiers?.writable || true;
        this.#readable = modifiers?.readable || true;
        this.#handled = modifiers?.handled || false;
    }

    public get response(): OutgoingResponse {
        return this.#response;
    }

    public set response(response: OutgoingResponse) {
        this.#response = response;
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

    public get handled(): boolean {
        return this.#handled;
    }

    public set handled(handled: boolean) {
        this.#handled = handled;
    }

    public build(): Response {
        return this.#response.build();
    }
}
