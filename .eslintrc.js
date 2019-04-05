module.exports = {
  rules: {
    'no-console': 'off',
    'vue/no-unused-vars': 'error'
  },
  "parserOptions": {
    "parser": "babel-eslint",
    "sourceType": "module"
  },
  "env": {
    "es6": true
  },
  extends: [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    //'plugin:vue/recommended',
    "plugin:vue/base"
  ],
}