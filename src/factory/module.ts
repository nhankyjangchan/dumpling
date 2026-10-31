import { Compiler, type $Compiler } from '@compiler/index';
import type { Plugin } from '@plugin/module';
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
        collectSelfRoutes(routes, plugin);
        return Compiler.merge(...routes);
    }

    function collectSelfRoutes(routes: $Compiler.ServeRoutes[], plugin: Plugin): void {
        for (const child of plugin.plugins) {
            if (child.scope === 'self') {
                routes.push(Compiler.compile(child));
            }
            collectSelfRoutes(routes, child);
        }
    }
}
