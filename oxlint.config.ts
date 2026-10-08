import { defineConfig } from 'oxlint';

export default defineConfig({
    categories: {
        correctness: 'error',
        nursery: 'error',
        pedantic: 'error',
        perf: 'error',
        restriction: 'error',
        style: 'error',
        suspicious: 'error'
    },
    env: {
        builtin: true,
        node: true,
        browser: true
    },
    globals: {
        Bun: 'readonly'
    },
    ignorePatterns: ['node_modules/**', 'tests/**', 'build/**'],
    options: {
        denyWarnings: true,
        reportUnusedDisableDirectives: 'error',
        respectEslintDisableDirectives: false,
        typeAware: true,
        typeCheck: true
    },
    plugins: ['eslint', 'unicorn', 'typescript', 'oxc', 'import', 'promise', 'node'],
    rules: {
        'no-magic-numbers': ['error', { ignore: [0, 1, 200, 500] }],
        'one-var': 'off',
        'sort-imports': 'off',
        'sort-keys': 'off',
        'no-continue': 'off',
        'no-ternary': 'off',
        'no-new-func': 'off',
        'no-empty-function': ['error', { allow: ['constructors'] }],
        'import/no-named-export': 'off',
        'import/prefer-default-export': 'off',
        'import/group-exports': 'off',
        'import/consistent-type-specifier-style': 'off',
        'import/no-default-export': 'off',
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
