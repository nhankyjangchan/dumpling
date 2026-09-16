import type { Middleware } from '@middleware';
import type { RouteInit } from '@router';
import type { Dumpling } from './module.mts';

export type Listener = EventListener | EventListenerObject;
export type ListenerOptions = AddEventListenerOptions | boolean;

export interface DumplingImplDumpling<
    Decorations = unknown,
    WebSockets = unknown,
    Routes extends string = string
> {
    onRequest(...middlewares: Middleware<Decorations, WebSockets, Routes>[]): this;
    onResponse(...middlewares: Middleware<Decorations, WebSockets, Routes>[]): this;
    onError(...middlewares: Middleware<Decorations, WebSockets, Routes>[]): this;

    decorate(content: Decorations): this;
    use(...plugin: Dumpling[]): this;
    route(init: RouteInit<Decorations, WebSockets, Routes>): this;

    ws(): this;
    launch(): Bun.Server<WebSockets>;

    on(type: string, listener: Listener, options?: ListenerOptions): this;
    emit(event: Event): this;
    off(type: string, listener: Listener, options?: ListenerOptions): this;
}
