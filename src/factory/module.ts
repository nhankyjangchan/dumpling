import { Compiler, type $Compiler } from '@compiler/index';
import type { Plugin } from '@plugin/module';

export namespace Factory {
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
