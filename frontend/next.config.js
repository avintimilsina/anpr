/** @type {import('next').NextConfig} */
const nextConfig = {
	productionBrowserSourceMaps: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "firebasestorage.googleapis.com",
				port: "",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
				port: "",
			},
		],
	},
	i18n: {
		locales: ["en", "np"],
		defaultLocale: "en",
	},
	reactStrictMode: true,
	transpilePackages: ["geist"],
};

module.exports = nextConfig;
