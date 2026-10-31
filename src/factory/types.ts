export namespace $Factory {
    export type Attempt<Output> =
        | { readonly ok: true; readonly output: Output }
        | { readonly ok: false; readonly caught: unknown };
}
