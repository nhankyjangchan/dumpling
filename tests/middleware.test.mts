import { describe, test, expect } from 'bun:test';
import { Middleware, MiddlewareError, type $Middleware } from '@middleware';

const createManifest = (): $Middleware.Manifest => ({
    name: 'example@middleware',
    hook: 'onRequest',
    type: 'sync#skip'
});

const createInit = (): $Middleware.Init => ({
    handler: (): undefined => {},
    manifest: createManifest()
});

describe('Middleware', (): void => {
    describe('constructor', (): void => {
        test('Creates an instance from a valid init', (): void => {
            const middleware = new Middleware(createInit());
            expect(middleware).toBeInstanceOf(Middleware);
        });

        test('Stores the exact handler reference', (): void => {
            const init = createInit();
            const middleware = new Middleware(init);
            expect(middleware.handler).toBe(init.handler);
        });

        test('Stores a copy of the manifest, not the same reference', (): void => {
            const init = createInit();
            const middleware = new Middleware(init);
            expect(middleware.manifest).not.toBe(init.manifest);
            expect(middleware.manifest).toEqual(init.manifest);
        });

        test('Freezes the stored manifest', (): void => {
            const middleware = new Middleware(createInit());
            expect(Object.isFrozen(middleware.manifest)).toBe(true);
        });

        test('Does not reflect later mutations of the input manifest', (): void => {
            const init = createInit();
            const middleware = new Middleware(init);
            (init.manifest as { name: string }).name = 'mutated@middleware';
            expect(middleware.manifest.name).toBe('example@middleware');
        });

        test('Throws on null', (): void => {
            expect((): Middleware => new Middleware(null as never)).toThrow();
        });

        test('Throws on undefined', (): void => {
            expect((): Middleware => new Middleware(undefined as never)).toThrow();
        });

        test('Throws on primitives', (): void => {
            expect((): Middleware => new Middleware('x' as never)).toThrow();
            expect((): Middleware => new Middleware(42 as never)).toThrow();
            expect((): Middleware => new Middleware(true as never)).toThrow();
        });

        test('Throws when handler is missing', (): void => {
            const init = { manifest: createManifest() };
            expect((): Middleware => new Middleware(init as never)).toThrow();
        });

        test('Throws when manifest is missing', (): void => {
            const init = { handler: (): undefined => {} };
            expect((): Middleware => new Middleware(init as never)).toThrow();
        });

        test('Throws when handler is not a function', (): void => {
            const init = { handler: 'nope', manifest: createManifest() };
            expect((): Middleware => new Middleware(init as never)).toThrow();
        });

        test('Throws on extra key in init', (): void => {
            const init = { ...createInit(), extra: 1 };
            expect((): Middleware => new Middleware(init as never)).toThrow();
        });

        test('Throws on extra key in manifest', (): void => {
            const init = createInit();
            //@ts-ignore
            (init.manifest as Record<string, unknown>).extra = 1;
            expect((): Middleware => new Middleware(init)).toThrow();
        });

        test('Throws on invalid manifest.name', (): void => {
            const init = createInit();
            (init.manifest as { name: string }).name = 'example';
            expect((): Middleware => new Middleware(init)).toThrow();
        });

        test('Throws on unknown hook', (): void => {
            const init = createInit();
            (init.manifest as { hook: string }).hook = 'onWhatever';
            expect((): Middleware => new Middleware(init)).toThrow();
        });

        test('Throws on case-mismatched hook', (): void => {
            const init = createInit();
            (init.manifest as { hook: string }).hook = 'ONREQUEST';
            expect((): Middleware => new Middleware(init)).toThrow();
        });

        test('Throws on unknown type', (): void => {
            const init = createInit();
            (init.manifest as { type: string }).type = 'parallel';
            expect((): Middleware => new Middleware(init)).toThrow();
        });
    });

    describe('constructor error type', (): void => {
        test('Throws MiddlewareError on null', (): void => {
            expect((): Middleware => new Middleware(null as never)).toThrow(MiddlewareError);
        });

        test('Throws MiddlewareError when handler is missing', (): void => {
            const init = { manifest: createManifest() };
            expect((): Middleware => new Middleware(init as never)).toThrow(MiddlewareError);
        });

        test('Throws MiddlewareError when manifest is invalid', (): void => {
            const init = createInit();
            (init.manifest as { hook: string }).hook = 'onWhatever';
            expect((): Middleware => new Middleware(init)).toThrow(MiddlewareError);
        });

        test('Error message is not empty', (): void => {
            try {
                new Middleware(null as never);
                throw new Error('expected to throw');
            } catch (error) {
                expect(error).toBeInstanceOf(MiddlewareError);
                expect((error as MiddlewareError).message.length).toBeGreaterThan(0);
            }
        });
    });

    describe('handler getter', (): void => {
        test('Returns a function', (): void => {
            const middleware = new Middleware(createInit());
            expect(middleware.handler).toBeFunction();
        });
    });

    describe('manifest getter', (): void => {
        test('Returns an object', (): void => {
            const middleware = new Middleware(createInit());
            expect(middleware.manifest).toBeObject();
        });

        test('Returns every field unchanged', (): void => {
            const middleware = new Middleware(createInit());
            expect(middleware.manifest.name).toBe('example@middleware');
            expect(middleware.manifest.hook).toBe('onRequest');
            expect(middleware.manifest.type).toBe('sync#skip');
        });

        test('Throws on attempted mutation', (): void => {
            const middleware = new Middleware(createInit());
            expect((): string => {
                (middleware.manifest as { name: string }).name = 'mutated';
                return middleware.manifest.name;
            }).toThrow();
        });
    });

    describe('isInit', (): void => {
        test('Returns true for a valid init', (): void => {
            expect(Middleware.isInit(createInit())).toBe(true);
        });

        test('Returns false for null', (): void => {
            expect(Middleware.isInit(null)).toBe(false);
        });

        test('Returns false for undefined', (): void => {
            expect(Middleware.isInit(undefined)).toBe(false);
        });

        test('Returns false for primitives', (): void => {
            expect(Middleware.isInit('x')).toBe(false);
            expect(Middleware.isInit(42)).toBe(false);
            expect(Middleware.isInit(true)).toBe(false);
            expect(Middleware.isInit(Symbol('s'))).toBe(false);
        });

        test('Returns false for a function', (): void => {
            expect(Middleware.isInit((): void => {})).toBe(false);
        });

        test('Returns false when handler is missing', (): void => {
            expect(Middleware.isInit({ manifest: createManifest() })).toBe(false);
        });

        test('Returns false when manifest is missing', (): void => {
            expect(Middleware.isInit({ handler: (): undefined => {} })).toBe(false);
        });

        test('Returns false when handler is not a function', (): void => {
            expect(Middleware.isInit({ handler: 42, manifest: createManifest() })).toBe(false);
        });

        test('Returns false when manifest is invalid', (): void => {
            expect(
                Middleware.isInit({
                    handler: (): undefined => {},
                    manifest: { name: 'x' }
                })
            ).toBe(false);
        });

        test('Returns false on extra key', (): void => {
            expect(Middleware.isInit({ ...createInit(), extra: 1 })).toBe(false);
        });
    });

    describe('isManifest', (): void => {
        test('Returns true for a valid manifest', (): void => {
            expect(Middleware.isManifest(createManifest())).toBe(true);
        });

        test('Returns true for every valid hook/type/exit combination', (): void => {
            const hooks = ['onRequest', 'onResponse', 'onError'] as const;
            const types = ['sync#skip', 'sync#check', 'async#skip', 'async#check'] as const;

            for (const hook of hooks) {
                for (const type of types) {
                    expect(Middleware.isManifest({ name: 'x@middleware', hook, type })).toBe(
                        true
                    );
                }
            }
        });

        test('Returns false for null', (): void => {
            expect(Middleware.isManifest(null)).toBe(false);
        });

        test('Returns false for undefined', (): void => {
            expect(Middleware.isManifest(undefined)).toBe(false);
        });

        test('Returns false for primitives', (): void => {
            expect(Middleware.isManifest('x')).toBe(false);
            expect(Middleware.isManifest(42)).toBe(false);
            expect(Middleware.isManifest(true)).toBe(false);
        });

        test('Returns false for a function', (): void => {
            expect(Middleware.isManifest((): void => {})).toBe(false);
        });

        test('Returns false for an empty object', (): void => {
            expect(Middleware.isManifest({})).toBe(false);
        });

        test('Returns false when a key is missing', (): void => {
            const manifest: Record<string, unknown> = { ...createManifest() };
            delete manifest['hook'];
            expect(Middleware.isManifest(manifest)).toBe(false);
        });

        test('Returns false on extra key', (): void => {
            expect(Middleware.isManifest({ ...createManifest(), extra: 'x' })).toBe(false);
        });

        test('Returns false when name does not end with @middleware', (): void => {
            expect(Middleware.isManifest({ ...createManifest(), name: 'example' })).toBe(false);
        });

        test('Returns false on unknown hook', (): void => {
            expect(Middleware.isManifest({ ...createManifest(), hook: 'onWhatever' })).toBe(
                false
            );
        });

        test('Returns false on case-mismatched hook', (): void => {
            expect(Middleware.isManifest({ ...createManifest(), hook: 'ONREQUEST' })).toBe(
                false
            );
        });

        test('Returns false on unknown type', (): void => {
            expect(Middleware.isManifest({ ...createManifest(), type: 'parallel' })).toBe(
                false
            );
        });

        test('Returns false on case-mismatched type', (): void => {
            expect(Middleware.isManifest({ ...createManifest(), type: 'SYNC' })).toBe(false);
        });

        test('Returns false on unknown exit', (): void => {
            expect(Middleware.isManifest({ ...createManifest(), exit: 'maybe' })).toBe(false);
        });

        test('Returns false on case-mismatched exit', (): void => {
            expect(Middleware.isManifest({ ...createManifest(), exit: 'TRUE' })).toBe(false);
        });

        test('Returns false when a value is not a string', (): void => {
            expect(Middleware.isManifest({ ...createManifest(), name: 42 })).toBe(false);
            expect(Middleware.isManifest({ ...createManifest(), exit: false })).toBe(false);
        });
    });

    describe('MiddlewareError', (): void => {
        test('Is an instance of Error', (): void => {
            const error = new MiddlewareError('msg');
            expect(error).toBeInstanceOf(Error);
        });

        test('Has its own name', (): void => {
            const error = new MiddlewareError('msg');
            expect(error.name).toBe('MiddlewareError');
        });

        test('Preserves the message', (): void => {
            const error = new MiddlewareError('very specific message');
            expect(error.message).toBe('very specific message');
        });
    });

    describe('guards never throw', (): void => {
        const hostile: readonly unknown[] = [
            null,
            undefined,
            0,
            -1,
            NaN,
            Infinity,
            -Infinity,
            0n,
            '',
            'x',
            true,
            false,
            Symbol('s'),
            (): void => {},
            [],
            [1, 2, 3],
            Object.create(null),
            new Map(),
            new Set(),
            new Date(),
            /regex/
        ];

        for (const [index, input] of hostile.entries()) {
            test(`isInit(${index}) returns false without throwing`, (): void => {
                expect((): boolean => Middleware.isInit(input)).not.toThrow();
                expect(Middleware.isInit(input)).toBe(false);
            });

            test(`isManifest(${index}) returns false without throwing`, (): void => {
                expect((): boolean => Middleware.isManifest(input)).not.toThrow();
                expect(Middleware.isManifest(input)).toBe(false);
            });
        }
    });

    describe('documented edge cases', (): void => {
        test('Rejects an empty array with the 4 properties attached', (): void => {
            const fake: unknown[] & Record<string, unknown> = [] as never;
            fake['name'] = 'x@middleware';
            fake['hook'] = 'onRequest';
            fake['type'] = 'async#check';

            expect(Middleware.isManifest(fake)).toBe(false);
        });

        test('Rejects a non-empty array even with the 4 properties attached', (): void => {
            const fake = [1, 2] as unknown[] & Record<string, unknown>;
            fake['name'] = 'x@middleware';
            fake['hook'] = 'onRequest';
            fake['type'] = 'async#skip';
            expect(Middleware.isManifest(fake)).toBe(false);
        });

        test('Rejects an object created with Object.create(null)', (): void => {
            const manifest = Object.create(null) as Record<string, unknown>;
            manifest['name'] = 'x@middleware';
            manifest['hook'] = 'onRequest';
            manifest['type'] = 'sync#skip';
            expect(Middleware.isManifest(manifest)).toBe(false);
        });

        test('Rejects a class instance with the 4 own fields', (): void => {
            class FakeManifest {
                readonly name = 'x@middleware';
                readonly hook = 'onRequest';
                readonly type = 'async#check';
            }
            expect(Middleware.isManifest(new FakeManifest())).toBe(false);
        });

        test('Rejects a class instance with an extra prototype method', (): void => {
            class FakeManifest {
                readonly name = 'x@middleware';
                readonly hook = 'onRequest';
                readonly type = 'async#check';

                public toString(): string {
                    return 'fake';
                }
            }
            expect(Middleware.isManifest(new FakeManifest())).toBe(false);
        });

        test('Accepts a Proxy wrapping a valid manifest', (): void => {
            const proxy = new Proxy(createManifest(), {});
            expect(Middleware.isManifest(proxy)).toBe(true);
        });

        test('Ignores non-enumerable properties', (): void => {
            const manifest = createManifest();
            Object.defineProperty(manifest, 'hidden', {
                value: 42,
                enumerable: false
            });
            expect(Middleware.isManifest(manifest)).toBe(true);
        });

        test('Ignores symbol-keyed properties', (): void => {
            const manifest = createManifest();
            //@ts-ignore
            (manifest as Record<symbol, unknown>)[Symbol('meta')] = 'anything';
            expect(Middleware.isManifest(manifest)).toBe(true);
        });
    });

    describe('unsupported hostile inputs', (): void => {
        test('Rejects a function with attached properties', (): void => {
            const fake = (): void => {};
            (fake as unknown as Record<string, unknown>)['not-name'] = 'x@middleware';
            (fake as unknown as Record<string, unknown>)['hook'] = 'onRequest';
            (fake as unknown as Record<string, unknown>)['type'] = 'sync';
            (fake as unknown as Record<string, unknown>)['exit'] = 'false';
            expect(Middleware.isManifest(fake)).toBe(false);
        });

        test('Rejects a manifest with numeric values', (): void => {
            expect(
                Middleware.isManifest({
                    name: 'x@middleware',
                    hook: 'onRequest',
                    type: 'sync',
                    exit: 1 as never
                })
            ).toBe(false);
        });

        test('Rejects a manifest with boolean values', (): void => {
            expect(
                Middleware.isManifest({
                    name: 'x@middleware',
                    hook: 'onRequest',
                    type: 'sync',
                    exit: true as never
                })
            ).toBe(false);
        });

        test('Rejects a manifest with nested objects instead of strings', (): void => {
            expect(
                Middleware.isManifest({
                    name: { toString: () => 'x@middleware' } as never,
                    hook: 'onRequest',
                    type: 'sync',
                    exit: 'false'
                })
            ).toBe(false);
        });

        test('Rejects a frozen valid manifest? no — accepts it', (): void => {
            const frozen = Object.freeze(createManifest());
            expect(Middleware.isManifest(frozen)).toBe(true);
        });
    });
});
