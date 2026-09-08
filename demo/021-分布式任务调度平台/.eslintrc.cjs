module.exports = {
  root: true,
  env: { node: true, browser: true, es2021: true },
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2021, sourceType: 'module', parser: '@typescript-eslint/parser' },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-essential',
    'plugin:prettier/recommended'
  ],
  plugins: [ 'prettier', '@typescript-eslint', 'vue' ],
  rules: {
    'prettier/prettier': 'warn',
    'no-console': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/multi-word-component-names': 'off'
  },
};