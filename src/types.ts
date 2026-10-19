export namespace $Shared {
    export type AnyConstructor<Instance = unknown> = abstract new (...args: never[]) => Instance;
}
