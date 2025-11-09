import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      "playwright-report/**",
      "test-results/**",
      "temp/**",
      "*.min.js",
    ],
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.browser,
        ...globals.es2021,
        console: "readonly",
      },
    },
    rules: {
      indent: "off",
      "linebreak-style": ["error", "unix"],
      quotes: ["warn", "double", { allowTemplateLiterals: true, avoidEscape: true }],
      semi: ["error", "always"],
      "no-unused-vars": "warn",
      "no-console": "off",
      "no-debugger": "error",
      "no-alert": "warn",
      eqeqeq: "error",
      curly: "error",
      "brace-style": ["warn", "1tbs", { allowSingleLine: true }],
      "comma-dangle": ["warn", "always-multiline"],
      "no-trailing-spaces": "warn",
      "eol-last": "warn",
      "space-before-function-paren": "off",
      "keyword-spacing": "warn",
      "space-infix-ops": "warn",
      "object-curly-spacing": ["warn", "always"],
      "array-bracket-spacing": ["warn", "never"],
      "max-len": ["warn", { code: 120, ignoreUrls: true, ignoreStrings: true }],
    },
  },
  {
    files: ["tests/**/*.js", "*.spec.js", "*.test.js", "playwright.config.js", "*.config.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
];
