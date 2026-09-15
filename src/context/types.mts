import type { Dumpling } from '@application';
import type { OutgoingResponse } from '@response';

export interface RequestContextInit<D, W, R extends string> {
    readonly app: Dumpling<D, W, R>;
    readonly server: Bun.Server<W>;
    readonly request: Request;
    readonly response: OutgoingResponse;
}
