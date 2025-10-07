import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import {defineConfig} from "eslint/config";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}", '**/*.test.ts', '**/*.spec.ts'],
        rules: {
            '@typescript-eslint/no-unused-expressions': 'off'
        },
        plugins: {js},
        extends: ["js/recommended"],
        languageOptions: {globals: globals.browser},
      ignores: ["node_modules/**", "dist/**"],
    },
    tseslint.configs.recommended,
]);
