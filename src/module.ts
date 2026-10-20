import type { $Shared } from './types';

export const shared = {
    assertInitObject(actual: unknown, errorClass: $Shared.AnyErrorConstructor): void {
        if (shared.isPlainObject(actual)) {
            return;
        }
        const message = `An invalid initialization object was passed to the constructor`;
        throw new errorClass(message);
    },
    isPlainObject(target: unknown): boolean {
        return (
            !!target
            && typeof target === 'object'
            && Object.getPrototypeOf(target) === Object.prototype
        );
    }
} as const;
