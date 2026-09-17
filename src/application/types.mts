import type { RequestContext } from '@http';
import type { Middleware } from '@middleware';

export interface PluginManifest {
    readonly name: PluginName;
    readonly dependencies: PluginName[];
}

export type PluginName = `${string}@plugin`;

export interface RouteInit {
    readonly method: string;
    readonly path: `/${string}`;
    readonly middlewares: Middleware[];
    readonly handler: RouteHandler;
}

export type RouteHandler = (rc: RequestContext) => Response | Promise<Response>;
