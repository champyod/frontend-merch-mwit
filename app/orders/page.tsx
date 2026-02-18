"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";
import { Preorder } from "@/types/types";
import { useIntlayer } from "next-intlayer";
import { Container, Stack, Heading, Text, Box } from "@/components/ui/primitives";
import { OrderCard } from "@/components/orders/OrderCard";
import { EmptyState } from "@/components/orders/EmptyState";

export default function OrdersPage() {
	const { user, isLoading } = useAuth();
	const router = useRouter();
	const [orders, setOrders] = useState<Preorder[]>([]);
	const [isFetching, setIsFetching] = useState(true);

	const { title, subtitle } = useIntlayer("orders-list");

	useEffect(() => {
		if (!isLoading && !user) {
			router.push("/");
			return;
		}

		if (user) {
			fetch("/api/me/orders")
				.then((res) => res.json())
				.then((data) => {
					if (!data.hasError) {
						setOrders(data.payload || []);
					}
				})
				.catch((err) => console.error("Error fetching orders:", err))
				.finally(() => setIsFetching(false));
		}
	}, [user, isLoading, router]);

	if (isLoading || (isFetching && user)) return <Loader />;

	return (
		<Box className="min-h-screen bg-[#0a2735] pt-32 pb-20 px-4">
			<Container maxWidth="4xl">
				<Stack gap={2} className="mb-10">
					<Heading level={1} size="4xl" weight="extrabold" color="text-white">
						{title}
					</Heading>
					<Text color="text-white/60">
						{subtitle}
					</Text>
				</Stack>

				{orders.length === 0 ? (
					<EmptyState />
				) : (
					<Stack gap={6}>
						{orders.map((order) => (
							<OrderCard key={order.id} order={order} />
						))}
					</Stack>
				)}
			</Container>
		</Box>
	);
}