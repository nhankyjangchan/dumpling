export namespace $OutgoingResponse {
    export interface Init {
        readonly status?: number;
        readonly statusText?: string;
        readonly headers?: Headers;
        readonly body?: BodyInit | null;
    }
}
