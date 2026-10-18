import type { Plugin } from '@plugin/module';

export namespace PluginEvents {
    export class Ready extends Event {
        readonly #plugin: Plugin;

        public constructor(plugin: Plugin, init?: Bun.EventInit) {
            super('ready', init);
            this.#plugin = plugin;
        }

        public get plugin(): Plugin {
            return this.#plugin;
        }
    }

    export class Failed extends Event {
        readonly #plugin: Plugin;
        readonly #cause: unknown;

        public constructor(plugin: Plugin, cause: unknown, init?: Bun.EventInit) {
            super('failed', init);
            this.#plugin = plugin;
            this.#cause = cause;
        }

        public get plugin(): Plugin {
            return this.#plugin;
        }

        public get cause(): unknown {
            return this.#cause;
        }
    }
}
