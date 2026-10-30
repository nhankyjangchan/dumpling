import type { $Shared } from './types';

export namespace Shared {
    export function assertPlainObject(
        input: unknown,
        ErrorClass: $Shared.AnyErrorConstructor
    ): void {
        if (_isPlainObject(input)) {
            return;
        }
        const message = 'A plain object was expected;';
        throw new ErrorClass(message);
    }

    function _isPlainObject(target: unknown): boolean {
        return (
            target !== null
            && typeof target === 'object'
            && Object.getPrototypeOf(target) === Object.prototype
        );
    }
}
