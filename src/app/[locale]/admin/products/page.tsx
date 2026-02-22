"use client";

import Loader from "@/components/ui/Loader";
import { useAuth } from "@/contexts/auth-context";
import { Item } from "@/types/types";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useAdminCollections, useAdminProducts } from "@/hooks/useAdmin";
import { Box, Card, Heading, Text, Button, Stack, Flex, Grid, Badge } from "@/components/ui/primitives";
import { calculateSalePrice } from "@/lib/logic";
import { navigateWithLocale, normalizeLocale } from "@/lib/navigation";
import { useLocale } from "next-intlayer";
import { useRouter } from "next/navigation";

const PAGE_SIZE = 12;
type ProductSort = "latest" | "title_asc" | "price_asc" | "price_desc";

export default function ProductsPage() {
	const localeData = useLocale();
	const locale = normalizeLocale(localeData);
	const router = useRouter();
	const { user, isLoading: isAuthLoading } = useAuth();
	const [collectionName, setCollectionName] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState<ProductSort>("latest");
	const [currentPage, setCurrentPage] = useState(1);

	const { data: products = [] } = useAdminProducts(collectionName, !!user);
	const { data: collections = [] } = useAdminCollections(!!user);

	const filteredAndSortedProducts = useMemo(() => {
		const normalizedSearch = searchTerm.trim().toLowerCase();
		const filtered = normalizedSearch.length === 0
			? products
			: products.filter((product) =>
				product.title.toLowerCase().includes(normalizedSearch) ||
				(product.name || "").toLowerCase().includes(normalizedSearch),
			);

		const sorted = [...filtered];
		switch (sortBy) {
			case "title_asc":
				sorted.sort((left, right) => left.title.localeCompare(right.title));
				break;
			case "price_asc":
				sorted.sort((left, right) => left.price - right.price);
				break;
			case "price_desc":
				sorted.sort((left, right) => right.price - left.price);
				break;
			case "latest":
			default:
				sorted.sort((left, right) => right.id - left.id);
				break;
		}

		return sorted;
	}, [products, searchTerm, sortBy]);

	const totalPages = Math.max(1, Math.ceil(filteredAndSortedProducts.length / PAGE_SIZE));
	const safeCurrentPage = Math.min(currentPage, totalPages);
	const paginatedProducts = useMemo(() => {
		const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
		return filteredAndSortedProducts.slice(startIndex, startIndex + PAGE_SIZE);
	}, [filteredAndSortedProducts, safeCurrentPage]);

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
						<Stack gap={4}>
							<Stack gap={2}>
								<label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Search</label>
								<input
									type="text"
									placeholder="Search by product title or collection"
									value={searchTerm}
									onChange={({ target }) => {
										setCurrentPage(1);
										setSearchTerm(target.value);
									}}
									className="bg-white/5 border border-white/10 rounded-xl p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#58a076]/50 w-full md:max-w-md"
								/>
							</Stack>
							<label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Filter by collection</label>
							<select
								aria-label="Filter products by collection"
								onChange={({ target }) => {
									setCurrentPage(1);
									setCollectionName(target.value);
								}}
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
								<Stack gap={2}>
									<label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sort by</label>
									<select
										aria-label="Sort products"
										value={sortBy}
										onChange={({ target }) => {
											setCurrentPage(1);
											setSortBy(target.value as ProductSort);
										}}
										className="bg-white/5 border border-white/10 rounded-xl p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#58a076]/50 w-full max-w-xs"
									>
										<option value="latest" className="bg-[#0a2735]">Latest updated</option>
										<option value="title_asc" className="bg-[#0a2735]">Title A-Z</option>
										<option value="price_asc" className="bg-[#0a2735]">Price low-high</option>
										<option value="price_desc" className="bg-[#0a2735]">Price high-low</option>
									</select>
								</Stack>
						</Stack>
					</Box>

						{filteredAndSortedProducts.length === 0 ? (
						<Box className="py-20 text-center">
								<Text color="text-slate-500" italic>No products matched your filters.</Text>
						</Box>
					) : (
							<Stack gap={4}>
								<Grid cols={1} className="sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" gap={6}>
									{paginatedProducts.map((product) => (
										<ItemCard item={product} key={product.id} locale={locale} />
									))}
								</Grid>
								<Flex justifyContent="between" alignItems="center" className="pt-2">
									<Text size="sm" color="text-slate-400">
										Page {safeCurrentPage} of {totalPages}
									</Text>
									<Flex gap={2}>
										<Button
											variant="secondary"
											size="sm"
											disabled={safeCurrentPage <= 1}
											onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
										>
											Previous
										</Button>
										<Button
											variant="secondary"
											size="sm"
											disabled={safeCurrentPage >= totalPages}
											onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
										>
											Next
										</Button>
									</Flex>
								</Flex>
							</Stack>
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
