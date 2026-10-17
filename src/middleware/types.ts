import type { RequestContext } from '@http/request-context/module';

export namespace $Middleware {
    export type Init =
        | InitVariant<'async', 'halt'>
        | InitVariant<'async', 'pass'>
        | InitVariant<'sync', 'halt'>
        | InitVariant<'sync', 'pass'>;

    interface InitVariant<SelectedMode extends Mode, SelectedFlow extends Flow> extends CommonInit {
        readonly mode: SelectedMode;
        readonly flow: SelectedFlow;
        readonly handler: InitHandler<HandlerReturn<SelectedMode, SelectedFlow>>;
    }

    interface CommonInit {
        readonly name: Name;
        readonly hook: Hook;
    }

    type HandlerReturn<
        SelectedMode extends Mode,
        SelectedFlow extends Flow
    > = SelectedMode extends 'async'
        ? SelectedFlow extends 'halt'
            ? Promise<MaybeResponse>
            : Promise<undefined>
        : SelectedFlow extends 'halt'
          ? MaybeResponse
          : undefined;

    export type Name = `${string}@middleware`;
    export type Hook = 'onRequest' | 'onResponse' | 'onError';
    export type Mode = 'async' | 'sync';
    export type Flow = 'halt' | 'pass';
    export type Handler = InitHandler<MaybeResponse | Promise<MaybeResponse>>;

    type InitHandler<Out> = (rc: RequestContext) => Out;
    type MaybeResponse = Response | undefined;
}
