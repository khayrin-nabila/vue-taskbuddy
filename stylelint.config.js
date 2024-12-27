export default {
    extends: [
      'stylelint-config-standard-scss', // Base SCSS rules
      'stylelint-config-html',          // For HTML and Vue files
      'stylelint-config-tailwindcss',   // TailwindCSS specific rules
      'stylelint-config-recommended-vue', // Recommended Vue rules
    ],
    rules: {
      indentation: [2, { baseIndentLevel: 0, ignore: ['inside-block'] }],
      'string-quotes': ['single', { avoidEscape: true }],
      'at-rule-no-unknown': [true, { ignoreAtRules: ['tailwind', 'apply', 'variants', 'screen'] }],
      'declaration-property-value-no-unknown': true,
    },
    overrides: [
      {
        files: ['**/*.vue', '**/*.html', '**/*.css'], // Handle Vue, HTML, and CSS files
        customSyntax: 'postcss-html', // Use postcss-html for embedded styles
      },
    ],
    ignoreFiles: ['**/*.vue'],
  };
  