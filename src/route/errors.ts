export namespace RouteErrors {
    export class Base extends Error {
        public override readonly name: string = 'RouteError';
    }

    export class Registration extends Base {
        public override readonly name: string = 'RouteRegistrationError';
    }
}
