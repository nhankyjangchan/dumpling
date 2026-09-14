import type { Middleware } from '@middleware';
import type { RouteInit } from '@router';
import type { Dumpling } from './module.mts';

export type Listener = EventListener | EventListenerObject;
export type ListenerOptions = AddEventListenerOptions | boolean;

export interface DumplingImpl<D, W, R extends string> {
    onRequest(...middlewares: Middleware<D, W, R>[]): this;
    onResponse(...middlewares: Middleware<D, W, R>[]): this;
    onError(...middlewares: Middleware<D, W, R>[]): this;

    decorate(content: D): this;
    use(...plugin: Dumpling[]): this;
    route(init: RouteInit<D, W, R>): this;

    ws(): this;
    launch(): Bun.Server<W>;

    on(type: string, listener: Listener, options?: ListenerOptions): this;
    emit(e: Event): this;
    off(type: string, listener: Listener, options?: ListenerOptions): this;
}
