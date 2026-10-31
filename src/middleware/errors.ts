export namespace MiddlewareErrors {
    export class Base extends Error {
        public override readonly name: string = 'MiddlewareError';
    }

    export class Registration extends Base {
        public override readonly name: string = 'MiddlewareRegistrationError';
    }
}
