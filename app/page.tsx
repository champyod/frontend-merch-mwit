"use client";

import ItemCard from "@/components/ui/ItemCard";
import { BRAND_NAME } from "./config";
import { ShoppingBag, ChevronDown } from "lucide-react";
import { Box, Card, Heading, Button, Text, Container, Flex, Stack } from "@/components/ui/primitives";
import { useIntlayer } from "next-intlayer";
import Link from "next/link";
import { useAllProducts } from "@/hooks/useProducts";
import { useSite } from "@/hooks/useSite";

export default function Home() {
	const t = useIntlayer("home");
	const { data: items } = useAllProducts();
	const { data: site } = useSite();

	const backgroundImageUrl = site?.image_url || "/images/hero.webp";

	return (
		<Box as="main" className="min-h-screen">
			{/* Hero Section */}
			<section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-4">
				<Box 
					className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
					style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
				>
					<Box className="absolute inset-0 bg-[#0a2735]/60 backdrop-blur-[2px]" />
				</Box>

				<Container maxWidth="4xl" className="relative z-10 text-center">
					<Stack gap={8}>
						<Stack gap={4}>
							<Text weight="bold" tracking="widest" uppercase size="sm" color="text-[#58a076]">
								{t.welcome.value}
							</Text>
							<Heading level={1} size="4xl" weight="black" color="text-white" className="md:text-8xl tracking-tighter drop-shadow-2xl">
								{BRAND_NAME}
							</Heading>
						</Stack>

						<Text size="lg" color="text-white/70" className="md:text-xl max-w-2xl mx-auto leading-relaxed">
							{t.description.value}
						</Text>

						<Flex direction="col" className="sm:flex-row justify-center pt-4" gap={4}>
							<a href="#products">
								<Button variant="primary" size="lg" className="gap-2">
									<ShoppingBag className="w-5 h-5" />
									{t.shopNow.value}
								</Button>
							</a>
							<Link href="/pre-orders">
								<Button variant="secondary" size="lg">
									{t.viewPreorders.value}
								</Button>
							</Link>
						</Flex>
					</Stack>
				</Container>

				<Box className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce">
					<Text size="xs" weight="bold" uppercase tracking="widest" color="text-white">{t.scroll.value}</Text>
					<ChevronDown className="w-4 h-4 text-white" />
				</Box>
			</section>

			{/* Products Section */}
			<section id="products">
				<Container maxWidth="full" className="py-32">
					<Flex direction="col" className="md:flex-row md:items-end justify-between mb-16" gap={4}>
						<Stack gap={2}>
							<Flex gap={2} alignItems="center">
								<Box className="w-8 h-[2px] bg-[#58a076]" />
								<Text weight="black" uppercase tracking="widest" size="xs" color="text-[#58a076]">{t.collection.value}</Text>
							</Flex>
							<Heading level={2} size="4xl" weight="black" color="text-white" className="tracking-tight">
								{t.newArrivals.value}
							</Heading>
						</Stack>
						<Text size="sm" weight="medium" color="text-white/40" className="max-w-xs">
							{t.qualityNotice.value}
						</Text>
					</Flex>

					{items && items.length > 0 ? (
						<Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
							{items.map((item, index) => (
								<ItemCard key={index} item={item} />
							))}
						</Box>
					) : (
						<Card variant="glass" className="py-20 text-center">
							<Text weight="bold" size="xl" color="text-white/60">{t.noProducts.value}</Text>
						</Card>
					)}
				</Container>
			</section>
		</Box>
	);
}
