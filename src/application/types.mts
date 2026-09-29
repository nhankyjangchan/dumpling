export namespace $Plugin {
    export interface Init {
        readonly name: Name;
        readonly scope: Scope;
    }

    export type Name = `${string}@plugin`;
    export type Scope = 'self' | 'global';
}
