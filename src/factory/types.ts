export namespace $Factory {
    export type Result<Output> =
        | { readonly ok: true; readonly output: Output }
        | { readonly ok: false; readonly caught: unknown };
}
