const path = require("path");

const buildEslintCommand = (filenames) => `echo linstaged failed`
	// `cd frontend && next lint --fix --file ..\\${filenames
	// 	.map((f) => path.relative(process.cwd(), f))
	// 	.join(" --file ")}`;

module.exports = {
	"*.{js,jsx,ts,tsx,css}": [
		buildEslintCommand,
		"prettier --write --ignore-unknown",
	],
	"*.{json,md}": ["prettier --write --ignore-unknown"],
};
