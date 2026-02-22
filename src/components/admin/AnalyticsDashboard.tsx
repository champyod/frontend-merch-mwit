"use client";

import { AdminOverview } from "@/hooks/useAdmin";
import { Box, Card, Stack, Text, Grid, Heading, Flex, Spinner } from "@/components/ui/primitives";

interface AnalyticsDashboardProps {
	overview: AdminOverview | undefined;
	isLoading?: boolean;
}

export function AnalyticsDashboard({ overview, isLoading }: AnalyticsDashboardProps) {
	const data: AdminOverview = overview ?? {
		total_orders: 0,
		total_revenue: 0,
		active_users: 0,
		pending_preorders: 0,
		visible_products: 0,
		visible_sets: 0,
		preorder_products: 0,
		preorder_sets: 0,
		payment_breakdown: [],
		top_products: [],
	};
	const hasAnyData = [
		data.total_orders,
		data.total_revenue,
		data.active_users,
		data.pending_preorders,
		data.visible_products,
		data.visible_sets,
		data.preorder_products,
		data.preorder_sets,
		data.payment_breakdown?.length ?? 0,
		data.top_products?.length ?? 0,
	].some((value) => value > 0);
	const noData = !overview || !hasAnyData;

	const DataCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
		<Card className={["relative overflow-hidden", className].filter(Boolean).join(" ")}>
			<div className={noData || isLoading ? "blur-[2px] opacity-50" : ""}>{children}</div>
			{isLoading ? (
				<div className="absolute inset-0 z-10 bg-white/5 backdrop-blur-[1px] flex items-center justify-center">
					<Spinner size="md" />
				</div>
			) : noData ? (
				<div className="absolute inset-0 rounded-xl bg-white/5 backdrop-blur-sm flex items-center justify-center">
					<Text size="sm" weight="bold" color="text-slate-300">
						No data yet
					</Text>
				</div>
			) : null}
		</Card>
	);

	// Top products breakdown
	const topProductsNormalized = (data.top_products || [])
		.slice(0, 5)
		.map(p => ({
			...p,
			percent: ((p.units_sold / (data.top_products?.reduce((sum, prod) => sum + prod.units_sold, 0) || 1)) * 100).toFixed(1),
		}));

	const paymentBreakdown = data.payment_breakdown || [];
	const totalOrders = data.total_orders || 1; // Use 1 to prevent division by zero

	const toBarWidthClass = (percent: number) => {
		if (percent <= 0) return "w-0";
		if (percent < 25) return "w-1/4";
		if (percent < 50) return "w-1/2";
		if (percent < 75) return "w-3/4";
		return "w-full";
	};

	return (
		<Stack gap={8} className="pb-10">
			{/* Header */}
			<Heading level={2} size="2xl" color="text-white">
				Analytics Dashboard
			</Heading>

			{/* Core Metrics */}
			<Box>
				<Text size="lg" weight="bold" color="text-white" className="mb-4 block">
					Key Metrics
				</Text>
				<Grid cols={2} gap={4} className="md:grid-cols-4">
					<DataCard className="p-6">
						<Text size="xs" weight="bold" color="text-slate-400" uppercase tracking="widest" className="mb-2 block">
							Total Orders
						</Text>
						<Text size="3xl" weight="bold" color="text-emerald-400" className="block font-mono">
							{data.total_orders}
						</Text>
					</DataCard>
					<DataCard className="p-6">
						<Text size="xs" weight="bold" color="text-slate-400" uppercase tracking="widest" className="mb-2 block">
							Total Revenue
						</Text>
						<Text size="2xl" weight="bold" color="text-emerald-400" className="block font-mono">
							฿{Math.round(data.total_revenue).toLocaleString()}
						</Text>
					</DataCard>
					<DataCard className="p-6">
						<Text size="xs" weight="bold" color="text-slate-400" uppercase tracking="widest" className="mb-2 block">
							Active Users
						</Text>
						<Text size="3xl" weight="bold" color="text-blue-400" className="block font-mono">
							{data.active_users}
						</Text>
					</DataCard>
					<DataCard className="p-6">
						<Text size="xs" weight="bold" color="text-slate-400" uppercase tracking="widest" className="mb-2 block">
							Pending Pre-Orders
						</Text>
						<Text size="3xl" weight="bold" color="text-yellow-400" className="block font-mono">
							{data.pending_preorders}
						</Text>
					</DataCard>
				</Grid>
			</Box>

			{/* Inventory Metrics */}
			<Box>
				<Text size="lg" weight="bold" color="text-white" className="mb-4 block">
					Inventory Status
				</Text>
				<Grid cols={2} gap={4} className="md:grid-cols-4">
					<DataCard className="p-6">
						<Text size="xs" weight="bold" color="text-slate-400" uppercase tracking="widest" className="mb-2 block">
							Visible Products
						</Text>
						<Text size="3xl" weight="bold" color="text-white" className="block font-mono">
							{data.visible_products}
						</Text>
					</DataCard>
					<DataCard className="p-6">
						<Text size="xs" weight="bold" color="text-slate-400" uppercase tracking="widest" className="mb-2 block">
							Preorder Products
						</Text>
						<Text size="3xl" weight="bold" color="text-orange-400" className="block font-mono">
							{data.preorder_products}
						</Text>
					</DataCard>
					<DataCard className="p-6">
						<Text size="xs" weight="bold" color="text-slate-400" uppercase tracking="widest" className="mb-2 block">
							Visible Sets
						</Text>
						<Text size="3xl" weight="bold" color="text-white" className="block font-mono">
							{data.visible_sets}
						</Text>
					</DataCard>
					<DataCard className="p-6">
						<Text size="xs" weight="bold" color="text-slate-400" uppercase tracking="widest" className="mb-2 block">
							Preorder Sets
						</Text>
						<Text size="3xl" weight="bold" color="text-orange-400" className="block font-mono">
							{data.preorder_sets}
						</Text>
					</DataCard>
				</Grid>
			</Box>

			{/* Payment Breakdown */}
			<Box>
				<Text size="lg" weight="bold" color="text-white" className="mb-4 block">
					Payment Methods
				</Text>
				<Grid cols={1} gap={3}>
					{paymentBreakdown.length > 0 ? (
						paymentBreakdown.map((payment) => {
							const percent = ((payment.orders / totalOrders) * 100).toFixed(1);
							const barWidthClass = toBarWidthClass(Number(percent));
							return (
								<DataCard key={payment.payment_account_id} className="p-4">
									<Box className="flex items-center justify-between mb-2">
										<Text weight="bold" color="text-white">{payment.name}</Text>
										<Text size="sm" color="text-slate-400">{percent}%</Text>
									</Box>
									<Box className="space-y-1">
										<Box className="flex items-center justify-between text-sm">
											<Text color="text-slate-400">Orders:</Text>
											<Text weight="bold" color="text-white">{payment.orders}</Text>
										</Box>
										<Box className="flex items-center justify-between text-sm">
											<Text color="text-slate-400">Revenue:</Text>
											<Text weight="bold" color="text-emerald-400">฿{Math.round(payment.revenue).toLocaleString()}</Text>
										</Box>
									</Box>
									{/* Simple bar chart */}
									<div className="mt-3 h-2 bg-white/5 rounded-full overflow-hidden">
										<div
											className={`h-full bg-linear-to-r from-[#58a076] to-primary-dark transition-all ${barWidthClass}`}
										/>
									</div>
								</DataCard>
							);
						})
					) : (
						<DataCard className="p-4">
							<Text color="text-slate-400">No payment data yet.</Text>
						</DataCard>
					)}
				</Grid>
			</Box>

			{/* Top Products */}
			<Box>
				<Text size="lg" weight="bold" color="text-white" className="mb-4 block">
					Top Selling Products (Last 30 Days)
				</Text>
				<Grid cols={1} gap={3}>
					{topProductsNormalized.length > 0 ? (
						topProductsNormalized.map((product) => {
							const barWidthClass = toBarWidthClass(Number(product.percent));
							return (
								<DataCard key={product.item_id} className="p-4">
								<Box className="flex items-center justify-between mb-2">
									<Text weight="bold" color="text-white" className="truncate pr-3">
										{product.title}
									</Text>
									<Text size="sm" color="text-slate-400">{product.percent}%</Text>
								</Box>
								<Box className="flex items-center justify-between text-sm">
									<Text color="text-slate-400">Units sold:</Text>
									<Text weight="bold" color="text-blue-400">{product.units_sold}</Text>
								</Box>
								{/* Simple bar chart */}
								<div className="mt-3 h-2 bg-white/5 rounded-full overflow-hidden">
									<div
										className={`h-full bg-linear-to-r from-blue-500 to-blue-600 ${barWidthClass}`}
									/>
								</div>
								</DataCard>
							);
						})
					) : (
						<DataCard className="p-4">
							<Text color="text-slate-400">No top products yet.</Text>
						</DataCard>
					)}
				</Grid>
			</Box>

		</Stack>
	);
}
