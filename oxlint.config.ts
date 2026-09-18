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
    ignorePatterns: ['node_modules/**', 'build/**', 'tests/**', 'coverage/**'],
    options: {
        denyWarnings: true,
        reportUnusedDisableDirectives: 'deny',
        respectEslintDisableDirectives: true,
        typeAware: true,
        typeCheck: true
    },
    rules: {
        'no-magic-numbers': ['error', { ignore: [200, 500] }],
        'one-var': 'off',
        'class-methods-use-this': ['error', { exceptMethods: ['raise'] }],
        'sort-imports': 'off',
        'sort-keys': 'off',
        'typescript/no-namespace': 'off',
        'typescript/require-array-sort-compare': 'off',
        'typescript/prefer-readonly-parameter-types': 'off',
        'typescript/method-signature-style': 'off',
        'typescript/only-throw-error': ['off', { allow: ['HttpError'] }],
        'oxc/no-rest-spread-properties': 'off',
        'oxc/no-optional-chaining': 'off',
        'unicorn/no-null': 'off',
        'unicorn/no-array-sort': 'off',
        'unicorn/no-array-callback-reference': 'off'
    }
});
