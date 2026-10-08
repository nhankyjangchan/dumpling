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
        'no-magic-numbers': ['error', { ignore: [0, 1, 200, 500] }],
        'one-var': 'off',
        'sort-imports': 'off',
        'sort-keys': 'off',
        'no-continue': 'off',
        'no-ternary': 'off',
        'no-new-func': 'off',
        'no-empty-function': ['error', { allow: ['constructors'] }],
        'typescript/no-namespace': 'off',
        'typescript/prefer-readonly-parameter-types': 'off',
        'typescript/method-signature-style': 'off',
        'typescript/no-implied-eval': 'off',
        'typescript/no-unnecessary-type-arguments': 'off',
        'typescript/no-empty-interface': 'off',
        'typescript/no-empty-object-type': 'off',
        'oxc/no-rest-spread-properties': 'off',
        'oxc/no-optional-chaining': 'off',
        'unicorn/no-null': 'off'
    }
});
