/** @type {import("eslint").Linter.Config} */
const config = {
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: "./tsconfig.json",
	},
	plugins: ["@typescript-eslint"],
	extends: [
		"plugin:@next/next/recommended",
		"airbnb",
		"airbnb-typescript",
		"plugin:@typescript-eslint/recommended-type-checked",
		"plugin:@typescript-eslint/stylistic-type-checked",
		"prettier",
	],
	rules: {
		"react/jsx-props-no-spreading": "off",
		"react/function-component-definition": [
			2,
			{
				namedComponents: "arrow-function",
			},
		],
		"react/require-default-props": "off",
		"react/react-in-jsx-scope": "off",
		"import/extensions": "off",
		"no-shadow": "off",
		"@typescript-eslint/no-shadow": "off",
		"@typescript-eslint/array-type": "off",
		"@typescript-eslint/consistent-type-definitions": "off",
		"@typescript-eslint/consistent-type-imports": [
			"warn",
			{
				prefer: "type-imports",
				fixStyle: "inline-type-imports",
			},
		],
		"@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
		"@typescript-eslint/require-await": "off",
		"@typescript-eslint/no-misused-promises": [
			"error",
			{
				checksVoidReturn: { attributes: false },
			},
		],
	},
	ignorePatterns: ["src/components/ui", "*.cjs"],
};

module.exports = config;