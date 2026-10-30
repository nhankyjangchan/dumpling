export namespace MiddlewareErrors {
    export class Default extends Error {
        public override name = 'MiddlewareError';
    }

    export class InvalidInit extends Default {
        public override readonly name = 'MiddlewareInitError';
    }

    export class FailedRegistration extends Default {
        public override readonly name = 'MiddlewareRegistrationError';
    }
}
