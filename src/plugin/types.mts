export namespace $Plugin {
    export interface Init {
        readonly name: Name;
        readonly scope: Scope;
    }

    export type Name = `${string}@plugin`;
    export type Scope = 'self' | 'global';

    export type Status = 'pending' | 'ready' | 'failed';

    export type Access<Target> = {
        [Member in keyof Target & string]: Target[Member] extends CallableFunction
            ? `${Member}()`
            : Member;
    }[keyof Target & string];
}
