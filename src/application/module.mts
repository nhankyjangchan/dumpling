import { RequestContext } from '@context';
import { Middleware } from '@middleware';
import { OutgoingResponse } from '@response';
import type { DumplingInit, Listener, ListenerOptions, RouteInit } from './types.mts';

export class Dumpling<D = any, W = any, R extends string = string> extends EventTarget {
    #plugins: Map<string, Dumpling>
    #routes: Map<string, RouteInit<D, W, R>>;

    public constructor(init: DumplingInit) {
        super();
        this.#plugins = new Map();
        this.#routes = new Map();
    }

    public onRequest(...middlewares: Middleware<D, W, R>[]): this {
        return this;
    }

    public onResponse(...middlewares: Middleware<D, W, R>[]): this {
        return this;
    }

    public onError(...middlewares: Middleware<D, W, R>[]): this {
        return this;
    }

    public decorate(_content: D): this{
        return this;
    }

    public use(..._plugin: Dumpling[]): this {
        return this;
    }

    public route(init: RouteInit<D, W, R>): this {
        const key: string = `${init.method} ${init.path}`;
        if (this.#routes.has(key))
            throw new Error(`Route "${key}" already exists`);
        this.#routes.set(key, init);
        return this;
    }

    public ws(_ws: Bun.WebSocketHandler<W>): this {
        return this
    }

    public on(type: string, listener: Listener, options?: ListenerOptions): this {
        this.addEventListener(type, listener, options);
        return this;
    }

    public emit(event: Event): this {
        this.dispatchEvent(event);
        return this;
    }

    public off(type: string, listener: Listener, options?: ListenerOptions): this {
        this.removeEventListener(type, listener, options);
        return this;
    }

    public launch(): Bun.Server<W> {
        return Bun.serve<W, R>({
            fetch() {
                return new Response('hi');
            }
        });
    }
}
