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
    globals: {
        Bun: 'readonly'
    },
    ignorePatterns: ['node_modules/**', 'dist/**', 'build/**', 'out/**', 'coverage/**'],
    options: {
        denyWarnings: true,
        reportUnusedDisableDirectives: 'deny',
        respectEslintDisableDirectives: true,
        typeAware: true,
        typeCheck: true
    },
    rules: {
        'no-magic-numbers': 'off',
        'require-unicode-regexp': 'off',
        'one-var': 'off',
        'class-methods-use-this': ['error', { exceptMethods: ['raise'] }],
        'sort-imports': 'off',
        'sort-keys': 'off',
        'typescript/no-empty-interface': 'off',
        'typescript/prefer-readonly-parameter-types': 'off',
        'typescript/method-signature-style': 'off',
        'typescript/no-non-null-assertion': 'off',
        'typescript/only-throw-error': ['deny', { allow: ['HttpError'] }],
        'oxc/no-rest-spread-properties': 'off',
        'oxc/no-optional-chaining': 'off',
        'unicorn/no-null': 'off'
    }
});
