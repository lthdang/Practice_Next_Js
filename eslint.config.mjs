// ESLint flat config for Next.js
import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      // Apply Next.js Core Web Vitals rules without relying on plugin name resolution
      ...nextPlugin.configs["core-web-vitals"].rules,
      // Project style rules
      semi: ["error", "always"],
      quotes: ["error", "double", { avoidEscape: true }],
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
];
