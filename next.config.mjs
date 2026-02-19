import { withIntlayer } from "next-intlayer/server";

/** @type {import('next').NextConfig} */
const nextConfig = {
	async rewrites() {
		return [
			{
				source: "/api/:slug*",
				destination: `${process.env.API_URL}/api/:slug*`,
			},
		];
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "5piecesclothing.com",
				port: "",
				pathname: "/cdn/**",
			},
		],
	},
};

export default withIntlayer(nextConfig);
