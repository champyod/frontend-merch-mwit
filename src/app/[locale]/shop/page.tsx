"use client";

import ItemCard from "@/components/ui/ItemCard";
import Loader from "@/components/ui/Loader";
import { useAllProducts } from "@/hooks/useProducts";
import { Box, Container, Grid, Heading, Text, Card } from "@/components/ui/primitives";

export default function ShopPage() {
	const { data: items, isLoading } = useAllProducts();

	if (isLoading)
		return (
			<Box className="min-h-screen flex items-center justify-center pt-32">
				<Loader />
			</Box>
		);

	return (
		<Box className="min-h-screen pt-32 pb-20 px-4">
			<Container maxWidth="full">
				<Box className="mb-16">
					<Heading level={1} size="4xl" weight="black" color="text-white" className="uppercase tracking-tight">
						SHOP
					</Heading>
				</Box>

				{items && items.length > 0 ? (
					<Grid cols={1} className="sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" gap={8}>
						{items.map((item, index) => (
							<ItemCard key={index} item={item} />
						))}
					</Grid>
				) : (
					<Card variant="glass" className="py-20 text-center">
						<Text weight="bold" size="xl" color="text-white/60">No products available.</Text>
					</Card>
				)}
			</Container>
		</Box>
	);
}
