export interface Mutable {
    writable: boolean;
    readable: boolean;
}

export interface MutableError extends Mutable {
    handled: boolean;
}

export type PartialMutable = Partial<Mutable>;

export type PartialResponseLike = Partial<ResponseLike>;

export interface ResponseLike {
    status: number;
    message: string;
    headers: Headers;
    body: BodyInit | null;
}
