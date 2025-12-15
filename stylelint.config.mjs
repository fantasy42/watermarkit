/** @type {import('stylelint').Config} */
const config = {
  extends: ['stylelint-config-standard'],
  rules: {
    // Too opinionated?
    'no-descending-specificity': null,

    'alpha-value-notation': null,
    'custom-property-pattern': null,
    'media-feature-range-notation': null,
    'no-empty-source': null,
    'selector-class-pattern': null,
    'string-no-newline': null,
    'value-keyword-case': null,
    'import-notation': null,

    // Responsibility of prettier:
    'at-rule-empty-line-before': null,
    'comment-empty-line-before': null,
    'custom-property-empty-line-before': null,
    'declaration-empty-line-before': null,
    'rule-empty-line-before': null,

    // Don't assume we use a preprocessor
    'property-no-vendor-prefix': null,
    'property-no-deprecated': null,
    'declaration-property-value-keyword-no-deprecated': null,
  },
  ignoreFiles: ['coverage/**/*'],
};

export default config;
