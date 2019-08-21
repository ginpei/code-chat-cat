// this config just eliminate all errors and warnings
// remove rules from here to complete styling code
module.exports = {
  extends: './.eslintrc.ideal.js',
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'import/prefer-default-export': 'off',
    'lines-between-class-members': 'off',
    'max-len': 'off',
    'no-alert': 'off',
    'no-console': 'off',
    'no-else-return': 'off',
    'no-multi-spaces': 'off',
    'no-nested-ternary': 'off',
    'no-param-reassign': 'off',
    'no-return-assign': 'off',
    'operator-linebreak': 'off',
    'quote-props': 'off',
    'react/button-has-type': 'off',
    'react/destructuring-assignment': 'off',
    'react/jsx-boolean-value': 'off',
    'react/jsx-curly-brace-presence': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-tag-spacing': 'off',
    'react/prefer-stateless-function': 'off',
    'react/sort-comp': 'off',
    'react/static-property-placement': 'off',
    'space-before-function-paren': 'off',
  },
};
