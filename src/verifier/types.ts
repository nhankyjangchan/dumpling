export namespace $Verifier {
    export type Rule<Target> = readonly [AnyConstructor<Target>, keyof Target & string, RegExp];
    // oxlint-disable-next-line typescript/no-explicit-any
    export type AnyConstructor<Instance = any> = new (...args: any[]) => Instance;
}
