"use client";

import Loader from "@/components/ui/Loader";
import { useAuth } from "@/contexts/auth-context";
import { Item } from "@/types/types";
import Link from "next/link";
import { useState } from "react";
import { useAdminCollections, useAdminProducts } from "@/hooks/useAdmin";
import { Box, Card, Heading, Text, Button, Stack, Flex, Grid, Badge } from "@/components/ui/primitives";
import { calculateSalePrice } from "@/lib/logic";
import { navigateWithLocale, normalizeLocale } from "@/lib/navigation";
import { useLocale } from "next-intlayer";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
	const localeData = useLocale();
	const locale = normalizeLocale(localeData);
	const router = useRouter();
	const { user, isLoading: isAuthLoading } = useAuth();
	const [collectionName, setCollectionName] = useState("");

	const { data: products = [] } = useAdminProducts(collectionName, !!user);
	const { data: collections = [] } = useAdminCollections(!!user);

	if (isAuthLoading || !user) return <Loader />;

	return (
		<Box className="pb-20">
			<Flex justifyContent="between" alignItems="center" className="mb-8">
				<Heading level={1} size="3xl" color="text-white">Products</Heading>
				<Button variant="primary" size="md" onClick={() => navigateWithLocale(router, locale, "/admin/products/add")}>
					+ Add Product
				</Button>
			</Flex>

			<Card variant="glass" className="p-6">
				<Stack gap={6}>
					<Box>
						<Text weight="bold" size="lg" color="text-white" className="block mb-4">My Inventory</Text>
						
						<Stack gap={2}>
							<label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Filter by collection</label>
							<select
								aria-label="Filter products by collection"
								onChange={({ target }) => setCollectionName(target.value)}
								value={collectionName}
								className="bg-white/5 border border-white/10 rounded-xl p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#58a076]/50 w-full max-w-xs"
							>
								<option value="" className="bg-[#0a2735]">All Collections</option>
								{collections.map((collection) => (
									<option key={collection.id} value={collection.name} className="bg-[#0a2735]">
										{collection.name}
									</option>
								))}
							</select>
						</Stack>
					</Box>

					{products.length === 0 ? (
						<Box className="py-20 text-center">
							<Text color="text-slate-500" italic>No products in inventory.</Text>
						</Box>
					) : (
						<Grid cols={1} className="sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" gap={6}>
							{products.map((product) => (
								<ItemCard item={product} key={product.id} locale={locale} />
							))}
						</Grid>
					)}
				</Stack>
			</Card>
		</Box>
	);
}

function ItemCard({ item, locale }: { item: Item; locale: "th" | "en" }) {
	const {
		id,
		title,
		price,
		discount,
		discount_type,
		url,
		name,
		hidden,
		last_edited_by_name,
		slug,
		text,
	} = item;
	const href = `/${locale}/admin/products/edit/${id}`;

	const salePrice = calculateSalePrice(item);

	return (
		<Link href={href} className="group">
			<Card 
				variant="outline" 
				className={`p-4 h-full transition-all hover:border-[#58a076]/50 hover:bg-white/5 ${hidden === 1 ? "opacity-50" : ""}`}
			>
				<Stack gap={4}>
					<Box className="relative aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/5">
						<img
							className="object-cover w-full h-full transition-transform group-hover:scale-110"
							src={url || "/images/logo.png"}
							alt={title}
						/>
						{hidden === 1 && (
							<Box className="absolute inset-0 flex items-center justify-center bg-[#0a2735]/60">
								<Badge variant="default">Hidden</Badge>
							</Box>
						)}
					</Box>

					<Stack gap={1}>
						<Flex justifyContent="between">
							<Badge variant="info">{name}</Badge>
							{text && <Badge variant="success">{text}</Badge>}
						</Flex>
						<Text weight="bold" color="text-white" className="truncate block mt-2">{title}</Text>
						
						<Box className="mt-1">
							{salePrice > 0 ? (
								<Flex gap={2} alignItems="baseline">
									<Text weight="black" color="text-[#58a076]" size="lg">฿{salePrice.toLocaleString()}</Text>
									<Text size="xs" color="text-slate-500" className="line-through">฿{price.toLocaleString()}</Text>
								</Flex>
							) : (
								<Text weight="black" color="text-white" size="lg">฿{price.toLocaleString()}</Text>
							)}
						</Box>
					</Stack>

					<Box className="pt-2 border-t border-white/5">
						<Text size="xs" color="text-slate-500">Edited by: {last_edited_by_name}</Text>
					</Box>
				</Stack>
			</Card>
		</Link>
	);
}
