import { OutgoingResponse, type $OutgoingResponse } from '@http/response';

export class HttpError extends Error {
    readonly #response: OutgoingResponse;

    public constructor(init: $OutgoingResponse.Init = {}) {
        super(init.statusText ?? 'Internal Server Error');
        this.name = 'HttpError';
        this.#response = new OutgoingResponse(init);
        this.#response.status = init.status ?? 500;
        this.#response.statusText = this.message;
    }

    public get response(): OutgoingResponse {
        return this.#response;
    }
}
