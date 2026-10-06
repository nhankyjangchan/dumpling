export namespace $Plugin {
    export interface Init {
        readonly name: Name;
        readonly scope: Scope;
    }

    export type Name = `${string}@plugin`;
    export type Scope = 'self' | 'global';

    export type Status = 'pending' | 'ready' | 'failed';

    export type Access<Target> = {
        [K in keyof Target & string]: Target[K] extends Function ? K | `${K}()` : K;
    }[keyof Target & string];
}
