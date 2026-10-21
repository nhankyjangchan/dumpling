import { HttpError } from '@http/errors';
import { OutgoingResponse, type $OutgoingResponse } from '@http/outgoing-response';
import type { Plugin } from '@plugin/module';
import type { $RequestContext } from './types';

export class RequestContext {
    readonly #app: Plugin;
    readonly #server: Bun.Server<$RequestContext.WebSocketData>;
    readonly #request: Bun.BunRequest<string>;

    #response?: OutgoingResponse;
    #error?: HttpError;
    #state?: $RequestContext.State;

    public shouldBuild: boolean = true;
    public catched?: unknown;

    public constructor(init: $RequestContext.Init) {
        this.#app = init.app;
        this.#server = init.server;
        this.#request = init.request;
    }

    public get app(): Plugin {
        return this.#app;
    }

    public get server(): Bun.Server<$RequestContext.WebSocketData> {
        return this.#server;
    }

    public get request(): Bun.BunRequest<string> {
        return this.#request;
    }

    public get response(): OutgoingResponse {
        return (this.#response ??= new OutgoingResponse());
    }

    public get error(): HttpError {
        return (this.#error ??= new HttpError());
    }

    public get state(): $RequestContext.State {
        return (this.#state ??= {});
    }

    public set state(state: $RequestContext.State) {
        this.#state = state;
    }

    public is(type: Lowercase<string>): boolean {
        const contentType: string | null = this.#request.headers.get('content-type');
        return contentType?.toLowerCase().includes(type) ?? false;
    }

    public raise(init?: $OutgoingResponse.Init): never {
        this.#error ??= new HttpError(init);
        throw this.#error;
    }

    public build(): Response | undefined {
        if (!this.shouldBuild) {
            return undefined;
        }
        return this.response.build();
    }
}
