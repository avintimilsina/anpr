/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
	plugins: ["prettier-plugin-tailwindcss"],
	endOfLine: "lf",
	trailingComma: "es5",
	semi: true,
	singleQuote: false,
	tabWidth: 2,
	useTabs: true,
};

export default config;
