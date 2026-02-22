"use client";

import { useEffect, useMemo, useState } from "react";
import Loader from "@/components/ui/Loader";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { useAdminOverview, useAdminPreorders } from "@/hooks/useAdmin";
import { useFilteredPreorders } from "@/hooks/useFilteredPreorders";
import { useLocale } from "next-intlayer";
import { normalizeLocale } from "@/lib/navigation";
import { Box, Card, Stack, Text, Flex, Heading, Button, Badge, Input } from "@/components/ui/primitives";
import { ChevronRight } from "lucide-react";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const toISODate = (date: Date): string => date.toISOString().slice(0, 10);

export default function DashboardPage() {
	const localeData = useLocale();
	const locale = normalizeLocale(localeData);
	const defaultTo = useMemo(() => toISODate(new Date()), []);
	const defaultFrom = useMemo(() => {
		const date = new Date();
		date.setDate(date.getDate() - 30);
		return toISODate(date);
	}, []);
	const [fromDate, setFromDate] = useState(defaultFrom);
	const [toDate, setToDate] = useState(defaultTo);
	const [appliedRange, setAppliedRange] = useState({ from: defaultFrom, to: defaultTo });
	const [activePreset, setActivePreset] = useState<number | null>(30);
	const [isFilterLoading, setIsFilterLoading] = useState(false);

	const applyPreset = (days: number) => {
		setIsFilterLoading(true);
		const to = new Date();
		const from = new Date();
		from.setDate(from.getDate() - days);
		const toIso = toISODate(to);
		const fromIso = toISODate(from);
		setFromDate(fromIso);
		setToDate(toIso);
		setAppliedRange({ from: fromIso, to: toIso });
		setActivePreset(days);
	};
	const { user, isLoading } = useAuth();
	const { data: overview, isFetching: isOverviewLoading } = useAdminOverview(undefined, !!user && !isLoading);
	const { data: orders = [], isLoading: isOrdersLoading } = useAdminPreorders(!!user && !isLoading);

	const handleApplyRange = () => {
		setIsFilterLoading(true);
		setAppliedRange({ from: fromDate, to: toDate });
		setActivePreset(null);
	};

	useEffect(() => {
		if (!isFilterLoading) return;
		const timer = setTimeout(() => {
			setIsFilterLoading(false);
		}, 350);
		return () => clearTimeout(timer);
	}, [isFilterLoading, appliedRange, orders]);

	const { filteredOrders, summary: filteredSummary } = useFilteredPreorders(orders, appliedRange);

	const quickActions = [
		{ href: `/${locale}/admin/map`, prefix: "View", emphasis: "feature map", suffix: "." },
		{ href: `/${locale}/admin/pages`, prefix: "Edit my", emphasis: "pages", suffix: "." },
		{ href: `/${locale}/admin/products`, prefix: "Add/Edit my", emphasis: "products", suffix: "." },
		{ href: `/${locale}/admin/sets`, prefix: "Create/Edit", emphasis: "sets", suffix: "." },
		{ href: `/${locale}/admin/preorders`, prefix: "Check customers'", emphasis: "preorders", suffix: "." },
		{ href: `/${locale}/admin/payments`, prefix: "Manage", emphasis: "payment accounts", suffix: "." },
		{ href: `/${locale}/admin/users`, prefix: "View registered", emphasis: "users", suffix: "." },
		{ href: `/${locale}/admin/settings`, prefix: "Check on my site", emphasis: "settings", suffix: "." },
	];

	if (isLoading || !user) return <Loader />;

	return (
		<Stack gap={8} className="pb-20">
			{/* Analytics Dashboard - Shows First */}
			<AnalyticsDashboard overview={overview} isLoading={isOverviewLoading} />

			{/* Filters + Table in One Card */}
			<Box>
				<Text size="lg" weight="bold" color="text-white" className="mb-4 block">
					Filtered Orders
				</Text>
				<Card className="p-6 overflow-hidden relative">
					{(isOrdersLoading || isFilterLoading) && <LoadingOverlay label="Updating orders..." />}
					<Stack gap={4}>
						<Box className="flex flex-wrap gap-2">
							{[7, 30, 90].map((days) => (
								<Button
									key={days}
									onClick={() => applyPreset(days)}
									variant={activePreset === days ? "primary" : "secondary"}
									size="sm"
								>
									Last {days} days
								</Button>
							))}
						</Box>
						<Box className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
							<Box>
								<label htmlFor="overview-from" className="text-xs text-white/60 uppercase font-bold block mb-2">
									From
								</label>
								<Input
									id="overview-from"
									type="date"
									value={fromDate}
									onChange={(event) => setFromDate(event.target.value)}
									className="rounded-lg px-3 py-2"
								/>
							</Box>
							<Box>
								<label htmlFor="overview-to" className="text-xs text-white/60 uppercase font-bold block mb-2">
									To
								</label>
								<Input
									id="overview-to"
									type="date"
									value={toDate}
									onChange={(event) => setToDate(event.target.value)}
									className="rounded-lg px-3 py-2"
								/>
							</Box>
							<Button
								onClick={handleApplyRange}
								variant={activePreset === null ? "primary" : "secondary"}
								size="md"
								className="h-11"
							>
								Apply Range
							</Button>
						</Box>

						<Flex justifyContent="between" alignItems="center" wrap="wrap" gap={3} className="pt-2">
							<Text size="sm" color="text-slate-400">
								Orders: {filteredSummary.totalOrders} | Revenue: ฿{Math.round(filteredSummary.totalRevenue).toLocaleString()} | Pending: {filteredSummary.pendingCount} | Completed: {filteredSummary.completedCount}
							</Text>
							<Text size="sm" color="text-slate-400">
								Range: {appliedRange.from} to {appliedRange.to}
							</Text>
						</Flex>

						<Box className="border border-white/10 rounded-2xl overflow-hidden">
							<Table className="text-sm">
								<TableHeader className="bg-white/5 text-slate-400">
									<TableRow className="border-white/10">
										<TableHead className="px-6 py-3 font-semibold text-left">Order</TableHead>
										<TableHead className="px-6 py-3 font-semibold text-left">Customer</TableHead>
										<TableHead className="px-6 py-3 font-semibold text-left">Status</TableHead>
										<TableHead className="px-6 py-3 font-semibold text-right">Total</TableHead>
										<TableHead className="px-6 py-3 font-semibold text-left">Date</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredOrders.length === 0 && !isOrdersLoading ? (
										<TableRow>
											<TableCell colSpan={5} className="px-6 py-12 text-center text-slate-500">
												No orders in this range.
											</TableCell>
										</TableRow>
									) : (
										filteredOrders.map((order) => (
											<TableRow key={order.id} className="border-white/5 hover:bg-white/2">
												<TableCell className="px-6 py-4 text-white font-mono">#{order.id}</TableCell>
												<TableCell className="px-6 py-4 text-white/90">{order.customer_name || "-"}</TableCell>
												<TableCell className="px-6 py-4">
													<Badge variant={order.status === "delivered" ? "success" : "default"}>{order.status || "-"}</Badge>
												</TableCell>
												<TableCell className="px-6 py-4 text-right text-emerald-400 font-bold">฿{Math.round(order.total_price || 0).toLocaleString()}</TableCell>
												<TableCell className="px-6 py-4 text-slate-400">{new Date(order.created_at).toLocaleDateString()}</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</Box>
					</Stack>
				</Card>
			</Box>

			{/* Quick Actions */}
			<Card variant="glass" className="p-6 rounded-2xl">
				<Text size="xl" weight="bold" color="text-white" className="mb-4">
					What&apos;d you like to do today?
				</Text>
				<Stack gap={3}>
					{quickActions.map((action) => (
						<Link key={action.href} href={action.href} className="block">
							<Card
								variant="outline"
								className="rounded-xl px-4 py-3 hover:bg-white/5 transition-all"
							>
								<Box className="flex items-center justify-between">
									<Text size="lg" weight="medium" color="text-white/90">
										{action.prefix} <b>{action.emphasis}</b>
										{action.suffix}
									</Text>
									<ChevronRight className="w-5 h-5 text-white/60" />
								</Box>
							</Card>
						</Link>
					))}
				</Stack>
			</Card>
		</Stack>
	);
}
