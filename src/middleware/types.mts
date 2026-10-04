import type { RequestContext } from '@http';

export namespace $Middleware {
    export type Init =
        | InitVariant<'async', 'halt'>
        | InitVariant<'async', 'pass'>
        | InitVariant<'sync', 'halt'>
        | InitVariant<'sync', 'pass'>;

    type InitVariant<TMode extends Mode, TFlow extends Flow> = CommonInit & {
        readonly mode: TMode;
        readonly flow: TFlow;
        readonly handler: InitHandler<HandlerReturn<TMode, TFlow>>;
    };

    interface CommonInit {
        readonly name: Name;
        readonly hook: Hook;
    }

    type InitHandler<Out> = (rc: RequestContext) => Out;

    type HandlerReturn<TMode extends Mode, TFlow extends Flow> = TMode extends 'async'
        ? TFlow extends 'halt'
            ? Promise<MaybeResponse>
            : Promise<void>
        : TFlow extends 'halt'
          ? MaybeResponse
          : undefined;

    export type Name = `${string}@middleware`;
    export type Hook = 'onRequest' | 'onResponse' | 'onError';
    export type Mode = 'async' | 'sync';
    export type Flow = 'halt' | 'pass';
    export type Handler = InitHandler<MaybeResponse | Promise<MaybeResponse>>;

    export type MaybeResponse = Response | void;
}
