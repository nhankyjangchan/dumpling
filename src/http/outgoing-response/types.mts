export namespace $OutgoingResponse {
    export interface Init {
        status?: number;
        message?: string;
        headers?: Headers;
        body?: BodyInit | null;
    }
}
