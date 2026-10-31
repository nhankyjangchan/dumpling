export namespace PluginErrors {
    export class Base extends Error {
        public override readonly name: string = 'PluginError';
    }

    export class Registration extends Base {
        public override readonly name: string = 'PluginRegistrationError';
    }

    export class Status extends Base {
        public override readonly name: string = 'PluginInvalidStatusError';
    }

    export class Argument extends Base {
        public override readonly name: string = 'PluginInvalidArgumentError';
    }
}
