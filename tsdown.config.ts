import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: './main.ts',
    dts: true,
    format: 'esm',
    outDir: 'build',
    clean: true,
    target: 'esnext',
    platform: 'neutral',
    treeshake: true,
    sourcemap: false,
    minify: false,
    shims: false,
    exports: false,
    root: '.',
    hash: false,
    fixedExtension: true
});
