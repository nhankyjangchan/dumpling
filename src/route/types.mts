import type { Middleware } from '@middleware';

export namespace $Route {
    export interface Init {
        readonly name: Name;
        readonly path: Path;
        readonly method: string;
        readonly handlers: readonly Middleware[];
    }

    export type Name = `${string}@route`;
    export type Path = `/${string}`;
}
