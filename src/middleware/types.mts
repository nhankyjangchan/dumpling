import type { RequestContext } from '@http';

export type MiddlewareHandler<D, W, R extends string> = (
    rc: RequestContext<D, W, R>
) => undefined | Response | Promise<Response | undefined>;

export interface MiddlewareInit<D, W, R extends string> {
    readonly handler: MiddlewareHandler<D, W, R>;
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
