import { OutgoingResponse, type $OutgoingResponse } from '@http/response';

export class HttpError extends Error {
    readonly #response: OutgoingResponse;

    public constructor(init: $OutgoingResponse.Init = {}) {
        init.status ??= 500;
        init.message ??= 'Internal Server Error';
        super(init.message);
        this.name = 'HttpError';
        this.#response = new OutgoingResponse(init);
    }

    public get response(): OutgoingResponse {
        return this.#response;
    }
}
