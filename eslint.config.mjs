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
		// Local utility scripts and tests run in Node, not inside Obsidian's plugin runtime.
		files: ["scripts/**/*.ts", "tests/**/*.ts"],
		rules: {
			"import/no-nodejs-modules": "off",
			"no-restricted-imports": "off",
		},
	},
	{
		files: ["package.json"],
		rules: {
			"depend/ban-dependencies": [
				"error",
				{
					presets: ["native", "microutilities", "preferred"],
					allowed: ["moment"],
				},
			],
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
