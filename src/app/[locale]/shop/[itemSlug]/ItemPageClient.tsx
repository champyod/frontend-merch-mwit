"use client";

import SocialReminder from "@/components/ui/SocialReminder";
import AddToCart from "@/components/ui/AddToCart";
import { ImageGallery } from "./ImageGallery";
import { useProduct } from "@/hooks/useProducts";
import { useIntlayer } from "next-intlayer";
import { Box, Container, Flex, Heading, Text, Card, Stack, Button } from "@/components/ui/primitives";
import Loader from "@/components/ui/Loader";
import { calculateSalePrice } from "@/lib/logic";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useLocale } from "next-intlayer";
import { buildLocalePath, normalizeLocale } from "@/lib/navigation";

export default function ItemPageClient({ itemId }: { itemId: string }) {
	const { data: item, isLoading } = useProduct(itemId);
	const t = useIntlayer("product");
	const localeData = useLocale();
	const locale = normalizeLocale(localeData);

	if (isLoading) return (
		<Box className="min-h-screen flex items-center justify-center pt-32 bg-[#0a2735]">
			<Loader />
		</Box>
	);

	if (!item) return (
		<Box className="min-h-screen pt-32 pb-20 px-4 bg-[#0a2735]">
			<Container maxWidth="4xl" className="text-center">
				<Stack gap={6}>
					<Heading level={1} size="2xl" color="text-white">{t.productNotFound.value}</Heading>
					<Link href={buildLocalePath(locale, "/")}>
						<Button variant="secondary">{t.backToHome.value}</Button>
					</Link>
				</Stack>
			</Container>
		</Box>
	);

	const salePrice = calculateSalePrice(item);

	return (
		<Box className="min-h-screen pt-32 pb-20 px-4 bg-[#0a2735]">
			<Container maxWidth="6xl">
				<Link href={buildLocalePath(locale, "/")} className="inline-flex items-center gap-2 text-white/40 hover:text-white font-bold transition-colors mb-8">
					<ChevronLeft className="w-5 h-5" />
					{t.backToHome.value}
				</Link>

				<Box className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					<Box>
						<ImageGallery images={item.images || []} />
					</Box>

					<Stack gap={8}>
						<Stack gap={4}>
							<Heading level={1} size="4xl" color="text-white" className="tracking-tight">
								{item.title}
							</Heading>
							
							<Box>
								{salePrice > 0 ? (
									<Flex gap={4} alignItems="baseline">
										<Text weight="black" color="text-[#58a076]" size="2xl" className="text-4xl">฿{salePrice.toLocaleString()}</Text>
										<Text size="lg" color="text-white/30" className="line-through">฿{item.price.toLocaleString()}</Text>
									</Flex>
								) : (
									<Text weight="black" color="text-white" size="2xl" className="text-4xl">฿{item.price.toLocaleString()}</Text>
								)}
							</Box>
						</Stack>

						<Stack gap={4}>
							<Box className="border-l-4 border-[#58a076] pl-4">
								<Text weight="bold" color="text-white" className="block mb-1">{t.material.value}</Text>
								<Text color="text-white/60">{item.material}</Text>
							</Box>
							<Text color="text-white/80" className="leading-relaxed text-lg max-w-xl">
								{item.description}
							</Text>
						</Stack>

						{item.color_size_arr && item.color_size_arr.length > 0 && (
							<Stack gap={4}>
								<Text weight="bold" size="lg" color="text-white">{t.availableVariants.value}</Text>
								<Box className="flex flex-wrap gap-3">
									{item.color_size_arr?.map(({ color, size }, idx) => (
										<Card key={idx} variant="outline" className="px-4 py-2 hover:border-[#58a076]/50 transition-colors">
											<Text weight="bold" size="sm" color="text-white">
												{color} • {t.sizeLabel.value}: {size || "N/A"}
											</Text>
										</Card>
									))}
								</Box>
							</Stack>
						)}

						<Box className="pt-6 border-t border-white/5">
							{item.is_preorder ? (
								<AddToCart item={item} />
							) : (
								<SocialReminder />
							)}
						</Box>
					</Stack>
				</Box>
			</Container>
		</Box>
	);
}
