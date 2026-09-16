import { OutgoingResponse } from '@http/response';
import type { HttpErrorInit } from './types.mts';

export class HttpError extends OutgoingResponse {
    public constructor(init?: HttpErrorInit) {
        super({
            status: init?.status ?? 500,
            message: init?.message ?? 'Internal Server Error',
            ...init
        });
    }
}
