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
            '@typescript-eslint/no-explicit-any': 'warn',
            'simple-import-sort/imports': [
                'warn',
                {
                    groups: [
                        // 1) reflect-metadata
                        ['^\\u0000?reflect-metadata$'],

                        // 2) otros side-effect imports
                        ['^\\u0000'],

                        // 3) Node built-ins
                        ['^node:'],

                        // 4) npm packages (scoped que NO sean @videomatt, o no-scoped),
                        //    **sin aceptar slash extra**.
                        ['^@(?!videomatt)[^/]+(?:\\/[^/]+)?$', '^[^./@][^/]+$'],

                        // 5) tu alias interno y tus rutas absolutas
                        ['^@videomatt', '^src/'],

                        // 6) imports relativos
                        ['^\\.'],
                    ],
                },
            ],
        },
    },
];
