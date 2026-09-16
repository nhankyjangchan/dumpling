import { defineConfig } from 'oxlint';

export default defineConfig({
    categories: {
        correctness: 'deny',
        nursery: 'deny',
        pedantic: 'deny',
        perf: 'deny',
        restriction: 'deny',
        style: 'deny',
        suspicious: 'deny'
    },
    env: {
        builtin: true,
        node: true,
        browser: true
    },
    ignorePatterns: ['node_modules/**', 'dist/**', 'build/**', 'out/**', 'coverage/**'],
    options: {
        denyWarnings: true,
        reportUnusedDisableDirectives: 'deny',
        respectEslintDisableDirectives: true,
        typeAware: true,
        typeCheck: true
    }
});
