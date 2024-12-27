import vue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';

export default [
  {
    files: ['**/*.vue', '**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: vueParser, // Use the actual imported parser module
      parserOptions: {
        parser: '@babel/eslint-parser',
        ecmaVersion: 'latest',
        sourceType: 'module',
        requireConfigFile: false,
      },
    },
    plugins: {
      vue,
    },
    rules: {
      ...vue.configs.recommended.rules,
      'no-console': 'warn',
      'no-debugger': 'warn',
    },
  },
];
