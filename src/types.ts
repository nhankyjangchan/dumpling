export namespace $Shared {
    export type AnyConstructor<Instance = unknown> = new (...args: never[]) => Instance;
}
