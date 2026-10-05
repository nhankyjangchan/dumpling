export namespace $Plugin {
    /**
     * @public
     * Plugin configuration object.
     */
    export interface Init {
        readonly name: Name;
        readonly scope: Scope;
    }

    /**
     * @public
     * Unique plugin identifier.
     */
    export type Name = `${string}@plugin`;

    /**
     * @public
     * Plugin content integration mode.
     */
    export type Scope = 'self' | 'global';

    /**
     * @public
     * Plugin lifecycle state.
     */
    export type Status = 'pending' | 'ready' | 'failed';

    /**
     * @internal
     * Type for protecting against typos in plugin member names.
     */
    export type Access =
        | 'middlewares'
        | 'plugins'
        | 'routes'
        | 'use()'
        | 'mount()'
        | 'route()'
        | 'ready()';
}
