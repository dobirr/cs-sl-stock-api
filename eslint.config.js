import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';

export default defineConfig([
  globalIgnores(['node_modules/**', 'coverage/**', 'dist/**']),
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'object-curly-newline': [
        'error',
        {
          ImportDeclaration: 'never',
          ExportDeclaration: 'never',
        },
      ],
    },
  },
]);
