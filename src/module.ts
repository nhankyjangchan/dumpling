import type { $Shared } from './types';

export const shared = {
    assertInitObject(input: unknown, ErrorClass: $Shared.AnyErrorConstructor): void {
        if (shared.isPlainObject(input)) {
            return;
        }
        const message = `An invalid initialization object was passed to the constructor`;
        throw new ErrorClass(message);
    },
    isPlainObject(target: unknown): boolean {
        return (
            target !== null
            && typeof target === 'object'
            && Object.getPrototypeOf(target) === Object.prototype
        );
    }
} as const;
