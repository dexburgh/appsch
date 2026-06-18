// @ts-check
import nextPlugin from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["node_modules/**", ".next/**", "dist/**"] },
  ...tseslint.configs.strictTypeChecked,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: { parserOptions: { project: ["./tsconfig.json"] } },
    plugins: { "@next/next": nextPlugin },
    rules: { "@next/next/no-img-element": "warn" }
  }
);
