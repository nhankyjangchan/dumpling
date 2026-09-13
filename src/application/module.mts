import type { Middleware } from '@middleware';
import type { Listener, ListenerOptions } from './types.mts';

export class Application<D = any, W = any, R extends string = string> extends EventTarget {
    a: D
    w: W
    r: R

    constructor(a: D, w: W, r: R) {
        super()
        this.a = a
        this.w = w
        this.r = r
    }
}

export interface Fastibun<D = any, W = any, R extends string = string> {
    onRequest(...middlewares: Middleware[]): this;
    onResponse(...middlewares: Middleware[]): this;
    onError(...middlewares: Middleware[]): this;

    decorate(content: D): this;
    use(...plugin: Application[]): this;
    route(options: any): this;

    ready(): boolean;
    ws(): unknown;
    launch(options?: Bun.Serve.Options<W, R>): Bun.Server<W>;

    on(type: string, listener: Listener, options?: ListenerOptions): this;
    emit(e: Event): this;
    off(type: string, listener: Listener, options?: ListenerOptions): this;
}
