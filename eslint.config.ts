import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import nodePlugin from 'eslint-plugin-n';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
    eslint.configs.recommended,
    nodePlugin.configs['flat/recommended-script'],
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    prettierConfig,
    {
        ignores: ['node_modules/*', 'src/**/*.mjs', 'dist/**'],
    },
    {
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json',
                warnOnUnsupportedTypeScriptVersion: false,
            },
        },
    },
    {
        plugins: {
            prettier: prettierPlugin,
            '@stylistic/js': stylistic,
            '@stylistic/ts': stylistic,
        },
    },
    {
        files: ['**/*.ts'],
    },
    {
        rules: {
            // TS safety
            '@typescript-eslint/explicit-member-accessibility': 'warn',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-non-null-assertion': 0,
            '@typescript-eslint/no-misused-promises': 0,
            '@typescript-eslint/no-floating-promises': 0,
            '@typescript-eslint/no-confusing-void-expression': 0,
            '@typescript-eslint/no-unnecessary-condition': 0,
            '@typescript-eslint/no-unnecessary-type-parameters': 0,
            '@typescript-eslint/no-unsafe-enum-comparison': 0,
            '@typescript-eslint/restrict-template-expressions': 0,
            '@typescript-eslint/restrict-plus-operands': ['warn', { allowNumberAndString: true }],
            '@typescript-eslint/no-unused-expressions': 'warn',
            '@typescript-eslint/no-unsafe-assignment': 0,
            '@typescript-eslint/no-unsafe-member-access': 0,
            '@typescript-eslint/prefer-nullish-coalescing': 0,
            '@typescript-eslint/no-unsafe-call': 0,
            // Style
            '@stylistic/js/no-extra-semi': 'warn',
            '@stylistic/ts/semi': ['warn', 'always'],
            '@stylistic/ts/member-delimiter-style': [
                'warn',
                {
                    multiline: { delimiter: 'comma', requireLast: true },
                    singleline: { delimiter: 'comma', requireLast: false },
                    overrides: {
                        interface: {
                            singleline: { delimiter: 'semi', requireLast: false },
                            multiline: { delimiter: 'semi', requireLast: true },
                        },
                    },
                },
            ],
            quotes: ['warn', 'single'],
            'comma-dangle': ['warn', 'always-multiline'],
            'max-len': ['warn', { code: 100 }],

            // Runtime
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'n/no-process-env': 0,
            'n/no-missing-import': 0,
            'n/no-unpublished-import': 0,
            'n/no-process-exit': 0,
            'no-fallthrough': 0,
            'prefer-const': 'warn',
            'no-extra-boolean-cast': 0,
            'prettier/prettier': ['error'],
        },
    },
];
