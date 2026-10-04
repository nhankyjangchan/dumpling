export namespace $OutgoingResponse {
    export interface Init {
        readonly status?: number;
        readonly message?: string;
        readonly headers?: Headers;
        readonly body?: BodyInit | null;
    }
}
