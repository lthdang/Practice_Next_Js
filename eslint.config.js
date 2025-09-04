import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // React rules
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/no-unescaped-entities": "warn",
      "react/display-name": "off",

      // General JavaScript rules
      "no-unused-vars": "warn",
      "no-console": "warn",
      "no-debugger": "error",
      "prefer-const": "error",
      "no-var": "error",

      // Code style
      quotes: ["warn", "double"],
      semi: ["warn", "always"],
      "comma-dangle": ["warn", "always-multiline"],
      "object-curly-spacing": ["warn", "always"],
      "array-bracket-spacing": ["warn", "never"],
      indent: ["warn", 2],
      "no-multiple-empty-lines": ["warn", { max: 1 }],
      "eol-last": ["warn", "always"],
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "public/**",
      "*.config.js",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
