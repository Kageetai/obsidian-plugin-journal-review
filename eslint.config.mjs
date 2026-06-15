import tsparser from "@typescript-eslint/parser";
import { defineConfig } from "eslint/config";
import globals from "globals";
import obsidianmd from "eslint-plugin-obsidianmd";

export default defineConfig([
	...obsidianmd.configs.recommended,
	{
		ignores: ["**/node_modules/", "**/dist/", "**/main.js"],
	},
	{
		files: ["**/*.ts", "**/*.tsx"],
		languageOptions: {
			parser: tsparser,
			parserOptions: { project: "./tsconfig.json" },
		},
	},
	{
		files: ["**/*"],
		ignores: ["**/*.ts", "**/*.tsx"],
		rules: {
			// The recommended preset also enables this typed rule for non-TypeScript files.
			"obsidianmd/no-plugin-as-component": "off",
		},
	},
	{
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},
]);
