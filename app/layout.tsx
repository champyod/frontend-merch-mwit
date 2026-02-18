import "./globals.css";
import Analytics from "@/components/Analytics";
import HeaderBar from "@/components/ui/HeaderBar";
import Footer from "@/components/ui/Footer";
import { Metadata } from "next";
import { BRAND_NAME, BRAND_URL, SITE_DESCRIPTION } from "./config";
import { Site } from "@/types/types";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

export const dynamic = "force-dynamic";
// ... (generateMetadata remains same)

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<Analytics />

			<body>
				<AuthProvider>
					<CartProvider>
						<HeaderBar />
						{children}
						<Footer brandName={BRAND_NAME} />
					</CartProvider>
				</AuthProvider>
			</body>
		</html>
	);
}

type GetSiteResponse = {
	errorMessage: string;
	hasError: boolean;
	metadata: null | {
		[key: string]: any;
	};
	payload: Site;
};
async function getSite() {
	try {
		const res = await fetch(`${process.env.API_URL}/api/site`, {
			next: {
				revalidate: 0,
			},
		});
		if (!res.ok) throw new Error("Failed to fetch data");
		const data: GetSiteResponse = await res.json();
		if (data.hasError) throw new Error(data.errorMessage);
		return data.payload;
	} catch (error) {
		return null;
	}
}
