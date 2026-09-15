import type { RequestContext } from '@context';

export type MiddlewareHandler<D, W, R extends string> = (
    rc: RequestContext<D, W, R>
) => undefined | Response | Promise<Response | undefined>;

export interface MiddlewareInit<D, W, R extends string> {
    readonly handler: MiddlewareHandler<D, W, R>;
    readonly manifest: MiddlewareManifest;
}

export interface MiddlewareManifest {
    readonly name: `${string}@middleware`;
    readonly hook: 'onRequest' | 'onResponse' | 'onError';
    readonly type: 'sync' | 'async';
}
