import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: 'src/main.mts',
    dts: true,
    format: 'esm',
    outDir: 'build',
    clean: true,
    target: 'esnext',
    platform: 'neutral',
    treeshake: true,
    sourcemap: true,
    minify: false,
    shims: false,
    exports: false,
    root: 'src',
    hash: false,
    fixedExtension: true
});
