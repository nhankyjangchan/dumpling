import { defineConfig } from 'oxfmt';

export default defineConfig({
    arrowParens: 'always',
    bracketSpacing: true,
    embeddedLanguageFormatting: 'auto',
    endOfLine: 'lf',
    experimentalOperatorPosition: 'start',
    ignorePatterns: ['node_modules/**', 'build/**', 'coverage/**'],
    insertFinalNewline: true,
    jsdoc: true,
    objectWrap: 'preserve',
    printWidth: 96,
    proseWrap: 'preserve',
    quoteProps: 'as-needed',
    semi: true,
    singleQuote: true,
    sortImports: false,
    sortPackageJson: true,
    tabWidth: 4,
    trailingComma: 'none',
    useTabs: false
});
