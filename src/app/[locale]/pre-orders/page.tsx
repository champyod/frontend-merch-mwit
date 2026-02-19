"use client";

import ItemCard from "@/components/ui/ItemCard";
import { usePreorderItems } from "@/hooks/useProducts";
import { Box, Container, Grid, Heading, Text, Card } from "@/components/ui/primitives";
import Loader from "@/components/ui/Loader";

export default function PreordersPage() {
	const { data: items, isLoading } = usePreorderItems();

	if (isLoading) return (
		<Box className="min-h-screen flex items-center justify-center pt-32">
			<Loader />
		</Box>
	);

	return (
		<Box className="min-h-screen pt-32 pb-20 px-4">
			<Container maxWidth="full">
				<Box className="mb-16">
					<Heading level={1} size="4xl" weight="black" color="text-white" className="uppercase tracking-tight">
						PRE-ORDERS
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
						<Text weight="bold" size="xl" color="text-white/60">No pre-order items available.</Text>
					</Card>
				)}
			</Container>
		</Box>
	);
}
