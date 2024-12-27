module.exports = {
    root: true,
    env: {
      browser: true,
      es2021: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:vue/vue3-recommended',
      'plugin:prettier/recommended', // Enables Prettier rules
    ],
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    rules: {
      // Add your custom rules here
      'no-console': 'warn',
      'no-debugger': 'warn',
    },
  };
  