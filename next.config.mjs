import { withIntlayer } from "next-intlayer/server";

const API_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";
const API_URL_OBJECT = new URL(API_BASE_URL);

/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",
	poweredByHeader: false,
	compress: true,
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: `${process.env.API_URL || "http://localhost:8080"}/api/:path*`,
			},
		];
	},
	experimental: {
		swcPlugins: [
			["@intlayer/swc", {}],
		],
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "5piecesclothing.com",
				port: "",
				pathname: "/cdn/**",
			},
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: API_URL_OBJECT.protocol.replace(":", ""),
				hostname: API_URL_OBJECT.hostname,
				port: API_URL_OBJECT.port,
				pathname: "/uploads/**",
			}
		],
	},
};

export default withIntlayer(nextConfig);
