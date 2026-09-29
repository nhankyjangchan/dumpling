import type { Dumpling } from '@application';

export namespace $RequestContext {
    export interface Init {
        readonly app: Dumpling;
        readonly server: Bun.Server<undefined>;
        readonly request: Request;
    }
}
