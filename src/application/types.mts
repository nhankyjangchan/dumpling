import type { RequestContext } from '@http';
import type { Middleware } from '@middleware';

export namespace $Plugin {
    export type ManifestKeys = Readonly<(keyof Manifest)[]>;

    export interface Manifest {
        readonly name: Name;
        readonly injectable: boolean;
        readonly plugins: Name[];
    }

    export type Name = `${string}@plugin`;
}

export interface Route {
    readonly method: string;
    readonly path: `/${string}`;
    readonly middlewares: Middleware[];
    readonly handler: RouteHandler;
}

export type RouteHandler = (rc: RequestContext) => Response | Promise<Response>;
