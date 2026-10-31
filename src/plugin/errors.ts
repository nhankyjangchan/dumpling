export namespace PluginErrors {
    export class Base extends Error {
        public override name = 'PluginError';
    }

    export class Registration extends Base {
        public override readonly name = 'PluginRegistrationError';
    }

    export class InvalidStatus extends Base {
        public override readonly name = 'PluginInvalidStatusError';
    }

    export class InvalidArgument extends Base {
        public override readonly name = 'PluginInvalidArgumentError';
    }
}
