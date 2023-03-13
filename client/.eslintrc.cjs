module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'standard-with-typescript',
        'prettier',
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
        "prettier/prettier": ["error"],
        'react/react-in-jsx-scope': 'off',
        camelcase: 'error',
        'spaced-comment': 'error',
        'no-duplicate-imports': 'error',
        'quotes': "off",
        'import/no-default-export': 'error',
        '@typescript-eslint/no-unsafe-assignment': 1,
        'react/prop-types': 0,
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
