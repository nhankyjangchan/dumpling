import type { Middleware } from '@middleware';

export namespace $Route {
    export interface Init {
        readonly name: Name;
        readonly path: Path;
        readonly method: Method;
        readonly middlewares: readonly Middleware[];
    }

    export type Name = `${string}@route`;
    export type Path = `/${string}`;

    export type Method =
        | 'GET'
        | 'HEAD'
        | 'OPTIONS'
        | 'TRACE'
        | 'QUERY'
        | 'PUT'
        | 'DELETE'
        | 'POST'
        | 'PATCH'
        | 'CONNECT'
        | (string & {});
}
