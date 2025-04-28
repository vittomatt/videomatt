// eslint.config.js (CommonJS style)
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const prettier = require('eslint-plugin-prettier');

module.exports = [
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
        plugins: {
            '@typescript-eslint': tseslint,
            'simple-import-sort': simpleImportSort,
            prettier: prettier,
        },
        rules: {
            ...tseslint.configs.recommended.rules,
            ...prettier.configs.recommended.rules,
            '@typescript-eslint/no-unused-vars': 'off',
            'simple-import-sort/imports': [
                'warn',
                {
                    groups: [
                        // 1 — reflect-metadata
                        ['^\\u0000?reflect-metadata$'],

                        // 2 — any other side-effect import
                        ['^\\u0000'],

                        // 3 — built-ins of Node
                        ['^node:'],

                        // 4 — external npm packages:
                        //     4a) @scope/package that is not @videomatt
                        //     4b) packages without scope
                        ['^@(?!videomatt)(?:[\\w-]+)', '^\\w'],

                        // 5 — your internal alias @videomatt/*
                        ['^@videomatt'],

                        // 6 — other absolute imports from your repo (if you have them)
                        ['^'],

                        // 7 — relative imports (“./” and “../”)
                        ['^\\.'],
                    ],
                },
            ],
        },
    },
];
