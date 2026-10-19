import type { Middleware } from '@middleware/module';
import type { Route } from '@route/module';
import type { Plugin } from './module';

export namespace $Plugin {
    export interface View extends Init {
        readonly status: Status;
        readonly middlewares: IterableIterator<Middleware>;
        readonly plugins: IterableIterator<Plugin>;
        readonly routes: IterableIterator<Route>;
    }

    export interface Init {
        readonly name: Name;
        readonly scope: Scope;
    }

    export type Name = `${string}@plugin`;
    export type Scope = 'self' | 'global';

    export type Status = 'pending' | 'ready' | 'failed';
}
