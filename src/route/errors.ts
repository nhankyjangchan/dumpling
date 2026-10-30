export namespace RouteErrors {
    export class Default extends Error {
        public override name = 'RouteError';
    }

    export class FailedRegistration extends Default {
        public override readonly name = 'RouteRegistrationError';
    }
}
