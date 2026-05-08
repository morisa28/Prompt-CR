import js from "@eslint/js";
import tseslint from "typescript-eslint";

const browserGlobals = {
  document: "readonly",
  fetch: "readonly",
  navigator: "readonly",
  window: "readonly",
};

export default [
  {
    ignores: ["legacy/**", "node_modules/**", "coverage/**", "dist/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.ts", "tests/**/*.ts", "scripts/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": "off",
      "no-undef": "off",
    },
  },
  {
    files: ["public/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: browserGlobals,
      sourceType: "script",
    },
    rules: {
      "no-console": "off",
    },
  },
];
