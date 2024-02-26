/** @type {import('next').NextConfig} */
const nextConfig = {
	productionBrowserSourceMaps: true,
	images: {
		domains: ["firebasestorage.googleapis.com"],
	},
	i18n: {
		locales: ["en", "np"],
		defaultLocale: "en",
	},
	reactStrictMode: true,
};

module.exports = nextConfig;
