export namespace Shared {
    export function assertPlainObject(input: unknown, message: string): void {
        if (isPlainObject(input)) {
            return;
        }
        throw new TypeError(message);
    }

    function isPlainObject(target: unknown): boolean {
        return (
            target !== null
            && typeof target === 'object'
            && Object.getPrototypeOf(target) === Object.prototype
        );
    }
}
