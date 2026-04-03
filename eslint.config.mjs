import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      "no-undef": "off", // Temporarily disable no-undef to see if React plugin catches it.
      // React 17+ JSX transform — no need to import React in scope
      "react/react-in-jsx-scope": "off",
      // Allow explicit any only as a warning; prefer unknown
      "@typescript-eslint/no-explicit-any": "warn",
      // Unused vars are errors; leading _ suppresses for intentional ignores
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      // 'React' is not defined errors for JSX:
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
    },
    settings: {
      react: { version: "detect" },
    },
  },
  {
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2020,
      },
    },
    rules: {
      "no-undef": "off", // MJS uses 'process' but ESLint doesn't always detect it easily
      "@typescript-eslint/no-var-requires": "off", // MJS might have some require for legacy or specific cases
    },
  },
  {
    ignores: [
      "dist/",
      "node_modules/",
      "output/",
      "*.config.*",
      "deliverables/premium-enterprise-deck/", // Ignore external/legacy JS files
    ],
  },
];
