import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default [
    {
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
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
        },
    },
];
