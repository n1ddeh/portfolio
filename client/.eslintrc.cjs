module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'standard-with-typescript',
        'prettier',
        'prettier/prettier',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:prettier/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:react-hooks/recommended',
    ],
    parser: '@typescript-eslint/parser',
    ignorePatterns: ['*.cjs', 'vite.config.ts'],
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            extends: [
                'plugin:@typescript-eslint/recommended',
                'plugin:@typescript-eslint/recommended-requiring-type-checking',
            ],
            parserOptions: {
                project: ['tsconfig.json'],
            },
        },
    ],
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: ['react', '@typescript-eslint', 'prettier', 'html', 'import'],
    rules: {
        'react/react-in-jsx-scope': 'off',
        camelcase: 'error',
        'spaced-comment': 'error',
        quotes: ['error', 'single'],
        'no-duplicate-imports': 'error',
        'import/no-default-export': 'error',
        '@typescript-eslint/no-unsafe-assignment': 1,
        'react/prop-types': 0,
        "prettier/prettier": ["error", { "singleQuote": true }]
    },
    settings: {
        'import/resolver': {
            typescript: {},
        },
        react: {
            version: '^18.2.0',
        },
    },
}
