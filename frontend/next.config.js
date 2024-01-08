/** @type {import('next').NextConfig} */
const nextConfig = {
	productionBrowserSourceMaps: true,
	i18n: {
		locales: ["en", "np"],
		defaultLocale: "en",
	},
	reactStrictMode: true,
};

module.exports = nextConfig;
