export namespace MiddlewareErrors {
    export class Base extends Error {
        public override name = 'MiddlewareError';
    }

    export class Registration extends Base {
        public override readonly name = 'MiddlewareRegistrationError';
    }
}
