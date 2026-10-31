export namespace RouteErrors {
    export class Base extends Error {
        public override name = 'RouteError';
    }

    export class Registration extends Base {
        public override readonly name = 'RouteRegistrationError';
    }
}
