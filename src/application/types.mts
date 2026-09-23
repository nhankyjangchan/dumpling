export namespace $Plugin {
    export type DescriptorKeys = Readonly<(keyof Descriptor)[]>;

    export interface Descriptor {
        readonly name: Name;
        readonly scope: Scope;
    }

    export type Name = `${string}@plugin`;
    export type Scope = 'self' | 'global';
}
