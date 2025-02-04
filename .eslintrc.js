module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'standard',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    semi: 'off',
    'space-before-function-paren': 'off',
    'comma-dangle': ['off', 'always'],
    'prefer-template': 'warn',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error'
  },
}
