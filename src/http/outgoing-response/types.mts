export interface OutgoingResponseImpl extends OutgoingResponseInit {
    toResponse(): Response;
}

export interface OutgoingResponseInit {
    status?: number;
    message?: string;
    headers?: Headers;
    body?: BodyInit | null;
}
