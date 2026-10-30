import { Compiler, type $Compiler } from '@compiler/index';
import type { Plugin } from '@plugin/module';
import type { $Factory } from './types';

export namespace Factory {
    export function attempt<Output>(fn: () => Output): $Factory.Result<Output> {
        try {
            return { ok: true, output: fn() };
        } catch (error: unknown) {
            return { ok: false, caught: error };
        }
    }

    export function compileToRoutes(plugin: Plugin): $Compiler.ServeRoutes {
        const routes: $Compiler.ServeRoutes[] = [Compiler.compile(plugin)];
        _collectSelf(routes, plugin);
        return Compiler.merge(...routes);
    }

    function _collectSelf(routes: $Compiler.ServeRoutes[], current: Plugin): void {
        for (const child of current.plugins) {
            if (child.scope === 'self') {
                routes.push(Compiler.compile(child));
            }
            _collectSelf(routes, child);
        }
    }
}
