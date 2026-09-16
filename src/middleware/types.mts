import type { RequestContext } from '@http';

export type MiddlewareHandler<
    Decorations = unknown,
    WebSockets = unknown,
    Routes extends string = string
> = (
    rc: RequestContext<Decorations, WebSockets, Routes>
) => undefined | Response | Promise<Response | undefined>;

export interface MiddlewareInit<
    Decorations = unknown,
    WebSockets = unknown,
    Routes extends string = string
> {
    readonly handler: MiddlewareHandler<Decorations, WebSockets, Routes>;
    readonly manifest: MiddlewareManifest;
}

export interface MiddlewareManifest {
    readonly name: MiddlewareName;
    readonly hook: MiddlewareHook;
    readonly type: MiddlewareType;
}

export type MiddlewareName = `${string}@middleware`;
export type MiddlewareHook = 'onRequest' | 'onResponse' | 'onError';
export type MiddlewareType = 'sync' | 'async';
