await Bun.build({
    entrypoints: ['./src/index.mts'],
    outdir: './build',
    target: 'bun',
    format: 'esm',
    splitting: true,
    env: 'inline',
    sourcemap: 'inline',
    minify: true,
    packages: 'bundle',
    root: './src'
});
