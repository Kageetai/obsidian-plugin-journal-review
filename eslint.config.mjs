import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	{
		ignores: ["**/node_modules/", "**/dist/", "**/main.js"],
	},
	{
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},
);
