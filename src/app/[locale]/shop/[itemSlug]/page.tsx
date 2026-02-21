import { Item } from "@/types/types";
import { Metadata } from "next";
import { BRAND_NAME, BRAND_URL, SITE_DESCRIPTION } from "@/config";
import ItemPageClient from "./ItemPageClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ itemSlug: string }>;
}): Promise<Metadata> {
	const { itemSlug } = await params;
	const itemSlugArr = itemSlug.split("-");
	const itemId = itemSlugArr[itemSlugArr.length - 1];
	const item = await getItem(itemId);

	return {
		title: item?.title,
		description: SITE_DESCRIPTION,
		metadataBase: new URL(BRAND_URL),
		openGraph: {
			title: `${item?.title} | ${BRAND_NAME}`,
			description: SITE_DESCRIPTION,
			url: BRAND_URL,
			siteName: `${BRAND_NAME}`,
			images: [
				{
					url: item?.images?.[0]?.url || "/images/hero.webp",
					width: 512,
					height: 512,
				},
			],
			locale: "en-US",
			type: "website",
		},
	};
}

async function getItem(itemId: string) {
	try {
		const res = await fetch(`${process.env.API_URL}/api/products/${itemId}`, {
			next: { revalidate: 0 },
		});
		const data = await res.json();
		return data.payload as Item;
	} catch (error) {
		return null;
	}
}

export default async function ItemPage({ params }: { params: Promise<{ itemSlug: string }> }) {
	const { itemSlug } = await params;
	const itemSlugArr = itemSlug.split("-");
	const itemId = itemSlugArr[itemSlugArr.length - 1].trim();

	return <ItemPageClient itemId={itemId} />;
}
