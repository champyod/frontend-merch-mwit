import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: process.env.NEXT_PUBLIC_BRAND_NAME || "SampleStore",
		short_name: process.env.NEXT_PUBLIC_BRAND_NAME || "SampleStore",
		icons: [
			{
				src: "/images/logo.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/images/logo.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
		theme_color: "#ffffff",
		background_color: "#ffffff",
		display: "standalone",
	};
}
