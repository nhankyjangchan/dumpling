import { OutgoingResponse } from '../outgoing-response/_index.mts';
import type { OutgoingResponseInit } from '../outgoing-response/_index.mts';

export class HttpError extends OutgoingResponse {
    public constructor(init?: OutgoingResponseInit) {
        super({
            status: init?.status ?? 500,
            message: init?.message ?? 'Internal Server Error',
            ...init
        });
    }
}
