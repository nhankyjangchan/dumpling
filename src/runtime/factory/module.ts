import { Compiler, type $Compiler } from '~runtime/compiler';
import type { Plugin } from '~entities/plugin/module';
import type { $Factory } from './types';

export namespace Factory {
    export function attempt<Output>(fn: () => Output): $Factory.Attempt<Output> {
        try {
            return { ok: true, output: fn() };
        } catch (error: unknown) {
            return { ok: false, caught: error };
        }
    }

    export function compileToRoutes(plugin: Plugin): $Compiler.ServeRoutes {
        const routes: $Compiler.ServeRoutes[] = [Compiler.compile(plugin)];
        _collectSelfRoutes(routes, plugin);
        return Compiler.merge(...routes);
    }

    function _collectSelfRoutes(routes: $Compiler.ServeRoutes[], plugin: Plugin): void {
        for (const child of plugin.plugins) {
            if (child.scope === 'self') {
                routes.push(Compiler.compile(child));
            }
            _collectSelfRoutes(routes, child);
        }
    }
}
