import type { RequestContext } from '@http';
import type { Middleware } from '@middleware';

export namespace $Plugin {
    export type DescriptorKeys = Readonly<(keyof Descriptor)[]>;

    export interface Descriptor {
        readonly name: Name;
        readonly scope: Scope;
    }

    export type Name = `${string}@plugin`;
    export type Scope = 'self' | 'global';
}

export interface Route {
    readonly method: string;
    readonly path: `/${string}`;
    readonly middlewares: Middleware[];
    readonly handler: RouteHandler;
}

export type RouteHandler = (rc: RequestContext) => Response | Promise<Response>;
