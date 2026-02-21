"use client";

import { Item } from "@/types/types";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Tag } from "lucide-react";
import { Box, Flex, Stack, Text, Heading, Badge } from "@/components/ui/primitives";
import { useIntlayer, useLocale } from "next-intlayer";
import { calculateSalePrice, formatCurrency } from "@/lib/logic";
import { buildLocalePath, normalizeLocale } from "@/lib/navigation";

interface Props {
	item: Item;
}

export default function ItemCard({ item }: Props) {
	const { id, title, price, url } = item;
	const { sale } = useIntlayer("product");
	const localeData = useLocale();
	const locale = normalizeLocale(localeData);
	const href = buildLocalePath(locale, "/shop/" + title.replaceAll(" ", "-") + "-" + id);

	const salePrice = calculateSalePrice(item);

	return (
		<Link href={href} className="group relative block w-full">
			<Box className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-white/5 border border-white/10 transition-all duration-500 group-hover:border-[#58a076]/30 group-hover:shadow-[0_20px_50px_rgba(33,124,107,0.15)] group-hover:-translate-y-2">
				{/* Sale Badge */}
				{salePrice !== 0 && (
					<Box className="absolute top-5 left-5 z-20 shadow-xl">
						<Badge variant="danger" className="flex items-center gap-1.5 py-2 px-4">
							<Tag className="w-3 h-3" />
							{sale.value}
						</Badge>
					</Box>
				)}

				{/* Image */}
				<Image
					src={url || "/logo.png"}
					alt={title}
					fill
					className="object-cover transition-transform duration-700 group-hover:scale-110"
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
				/>

				{/* Overlay Gradient */}
				<Box className="absolute inset-0 bg-gradient-to-t from-[#0a2735] via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

				{/* Bottom Info */}
				<Stack className="absolute bottom-0 inset-x-0 p-8" gap={4}>
					<Heading 
						level={3} 
						size="xl" 
						weight="black"
						className="text-white leading-tight transition-colors duration-300 group-hover:text-[#92c9c4]"
					>
						{title}
					</Heading>
					
					<Flex justifyContent="between" alignItems="center" gap={4}>
						<Flex gap={3} alignItems="center">
							{salePrice !== 0 ? (
								<>
									<Text size="2xl" weight="black" color="text-white">
										{formatCurrency(salePrice)}
									</Text>
									<Text size="sm" weight="black" color="text-white/40" className="line-through">
										{formatCurrency(price)}
									</Text>
								</>
							) : (
								<Text size="2xl" weight="black" color="text-white">
									{formatCurrency(price)}
								</Text>
							)}
						</Flex>
						
						<Box className="w-10 h-10 rounded-full bg-[#58a076] flex items-center justify-center text-white opacity-0 translate-x-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 shadow-lg shadow-[#58a076]/40">
							<ArrowUpRight className="w-5 h-5" />
						</Box>
					</Flex>
				</Stack>
			</Box>
		</Link>
	);
}
