const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = [
  {
    ignores: ['**/node_modules/**', '**/.next/**', '**/dist/**', '**/BU/**', '**/backups/**'],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'prefer-rest-params': 'warn',
      'prefer-const': 'warn',
      'react/no-unescaped-entities': 'off',
      '@next/next/no-html-link-for-pages': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'react/jsx-no-undef': 'off',
    },
  },
];
