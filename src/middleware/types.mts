import type { PlainObject } from '@utils';
import type { RequestContext } from '@http';

export type MiddlewareHandler<
    Decorations extends PlainObject = PlainObject,
    WebSockets extends PlainObject = PlainObject,
    Routes extends string = string
> = (
    rc: RequestContext<Decorations, WebSockets, Routes>
) => undefined | Response | Promise<Response | undefined>;

export interface MiddlewareInit<
    Decorations extends PlainObject = PlainObject,
    WebSockets extends PlainObject = PlainObject,
    Routes extends string = string
> {
    readonly handler: MiddlewareHandler<Decorations, WebSockets, Routes>;
    readonly manifest: MiddlewareManifest;
}

export interface MiddlewareManifest {
    readonly name: `${string}@middleware`;
    readonly hook: 'onRequest' | 'onResponse' | 'onError';
    readonly type: 'sync' | 'async';
    readonly response: 'true' | 'false';
}
