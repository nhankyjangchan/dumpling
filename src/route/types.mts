import type { Middleware } from '@middleware';

export namespace $Route {
    /**
     * @public
     * Route configuration object.
     */
    export interface Init {
        readonly name: Name;
        readonly path: Path;
        readonly method: Method;
        readonly middlewares: readonly Middleware[];
    }

    /**
     * @public
     * Unique route identifier.
     */
    export type Name = `${string}@route`;

    /**
     * @public
     * Route path template.
     */
    export type Path = `/${string}`;

    /**
     * @public
     * Route HTTP method.
     */
    export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
}
