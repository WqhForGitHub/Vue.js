module.exports = {
  root: true,
  env: { node: true, browser: true, es2021: true },
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2021, sourceType: 'module', parser: 'espree' },
  extends: [
    'eslint:recommended',
    'plugin:vue/essential',
    'plugin:prettier/recommended'
  ],
  plugins: [ 'prettier', 'vue' ],
  rules: {
    'prettier/prettier': 'warn',
    'no-console': 'off',
    'no-unused-vars': 'warn',
    'vue/multi-word-component-names': 'off'
  },
};