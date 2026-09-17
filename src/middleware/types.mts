import type { RequestContext } from '@http';

export type MiddlewareHandler = (
    rc: RequestContext
) => undefined | Response | Promise<Response | undefined>;

export interface MiddlewareInit {
    readonly handler: MiddlewareHandler;
    readonly manifest: MiddlewareManifest;
}

export interface MiddlewareManifest {
    readonly name: MiddlewareName;
    readonly hook: MiddlewareHook;
    readonly type: MiddlewareType;
    readonly response: boolean;
}

export type MiddlewareName = `${string}@middleware`;
export type MiddlewareHook = 'onRequest' | 'onResponse' | 'onError';
export type MiddlewareType = 'sync' | 'async';
