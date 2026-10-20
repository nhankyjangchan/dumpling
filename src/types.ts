export namespace $Shared {
    export type AnyErrorConstructor<Instance extends Error = Error> = new (
        message?: string,
        options?: ErrorOptions
    ) => Instance;

    export type AnyConstructor<Instance = unknown> = new (...args: never[]) => Instance;
}
