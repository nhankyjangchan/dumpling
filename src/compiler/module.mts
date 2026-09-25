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
        this.#filterMiddlewares();
    }

    #filterMiddlewares(): void {
        for (const middleware of this.#plugin.middlewares) {
            switch (middleware.manifest.hook) {
                case 'onRequest':
                    this.#onRequest.push(middleware);
                    break;
                case 'onResponse':
                    this.#onResponse.push(middleware);
                    break;
                case 'onError':
                    this.#onError.push(middleware);
                    break;
            }
        }
    }
}
