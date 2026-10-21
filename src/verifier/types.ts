import type { $Shared } from '@/types';

export namespace $Verifier {
    export type Rule<Target> = readonly [
        $Shared.AnyConstructor<Target>,
        keyof Target & string,
        RegExp
    ];
}
