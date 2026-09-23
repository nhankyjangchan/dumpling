import type { Dumpling } from '@application';
import type { Middleware } from '@middleware';

export class JITCompiler {
    readonly #plugin: Dumpling;
    #onRequest: Middleware[];
    #onResponse: Middleware[];
    #onError: Middleware[];

    public constructor(plugin: Dumpling) {
        this.#plugin = plugin;
        this.#onRequest = [];
        this.#onResponse = [];
        this.#onError = [];
    }

    #filterMiddlewares(): void {
        this.#plugin.middlewares.forEach((mw: Middleware): void => {
            if (mw.manifest.hook === 'onRequest') {
                this.#onRequest.push(mw);
            } else if (mw.manifest.hook === 'onResponse') {
                this.#onResponse.push(mw);
            } else if (mw.manifest.hook === 'onError') {
                this.#onError.push(mw);
            }
        });
    }
}
