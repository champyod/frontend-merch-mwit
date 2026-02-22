"use client";

import { useMemo, useState } from "react";
import Loader from "@/components/ui/Loader";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { useAdminOverview } from "@/hooks/useAdmin";
import { useLocale } from "next-intlayer";
import { normalizeLocale } from "@/lib/navigation";
import { Box, Card, Stack, Text } from "@/components/ui/primitives";
import { ChevronRight } from "lucide-react";

const toISODate = (date: Date): string => date.toISOString().slice(0, 10);

const toStartOfDayRFC3339 = (dateValue: string): string => {
	return `${dateValue}T00:00:00Z`;
};

const toEndOfDayRFC3339 = (dateValue: string): string => {
	return `${dateValue}T23:59:59Z`;
};

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

	const applyPreset = (days: number) => {
		const to = new Date();
		const from = new Date();
		from.setDate(from.getDate() - days);
		const toIso = toISODate(to);
		const fromIso = toISODate(from);
		setFromDate(fromIso);
		setToDate(toIso);
		setAppliedRange({ from: fromIso, to: toIso });
	};
	const { user, isLoading } = useAuth();
	const { data: overview } = useAdminOverview(
		{
			from: toStartOfDayRFC3339(appliedRange.from),
			to: toEndOfDayRFC3339(appliedRange.to),
		},
		!!user && !isLoading,
	);

	const quickActions = [
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
		<>
			<h1 className="text-2xl pb-1 font-bold">
									Hi <i>{user.name || user.role}</i>
								</h1>			<h2 className="text-3xl font-bold">Admin Panel</h2>
			<div className="mt-4 mb-4 bg-white/10 p-3 rounded-lg border border-white/10">
				<div className="flex flex-wrap gap-2 mb-3">
					<button type="button" onClick={() => applyPreset(7)} className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20">Last 7 days</button>
					<button type="button" onClick={() => applyPreset(30)} className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20">Last 30 days</button>
					<button type="button" onClick={() => applyPreset(90)} className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20">Last 90 days</button>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
					<div>
						<label htmlFor="overview-from" className="text-xs text-white/60 uppercase">From</label>
						<input
							id="overview-from"
							type="date"
							value={fromDate}
							onChange={(event) => setFromDate(event.target.value)}
							className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
						/>
					</div>
					<div>
						<label htmlFor="overview-to" className="text-xs text-white/60 uppercase">To</label>
						<input
							id="overview-to"
							type="date"
							value={toDate}
							onChange={(event) => setToDate(event.target.value)}
							className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
						/>
					</div>
					<button
						type="button"
						onClick={() => setAppliedRange({ from: fromDate, to: toDate })}
						className="h-10.5 px-4 rounded-lg bg-emerald-500 text-white hover:bg-emerald-400"
					>
						Apply Range
					</button>
				</div>
			</div>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 mb-6">
				<div className="bg-white/10 p-3 rounded-lg border border-white/10">
					<p className="text-xs text-white/60 uppercase">Orders</p>
					<p className="text-xl font-bold text-white">{overview?.total_orders ?? 0}</p>
				</div>
				<div className="bg-white/10 p-3 rounded-lg border border-white/10">
					<p className="text-xs text-white/60 uppercase">Revenue</p>
					<p className="text-xl font-bold text-white">฿{Math.round(overview?.total_revenue ?? 0).toLocaleString()}</p>
				</div>
				<div className="bg-white/10 p-3 rounded-lg border border-white/10">
					<p className="text-xs text-white/60 uppercase">Active Users</p>
					<p className="text-xl font-bold text-white">{overview?.active_users ?? 0}</p>
				</div>
				<div className="bg-white/10 p-3 rounded-lg border border-white/10">
					<p className="text-xs text-white/60 uppercase">Pending</p>
					<p className="text-xl font-bold text-white">{overview?.pending_preorders ?? 0}</p>
				</div>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-8">
				<div className="bg-white/10 p-4 rounded-lg border border-white/10">
					<p className="text-sm text-white/70 font-semibold mb-3">Top Products (30d)</p>
					{(overview?.top_products?.length ?? 0) === 0 ? (
						<p className="text-sm text-white/50">No product sales data.</p>
					) : (
						<div className="space-y-2">
							{overview?.top_products?.map((row) => (
								<div key={row.item_id} className="flex items-center justify-between text-sm border border-white/10 rounded-md px-3 py-2">
									<span className="text-white/90 truncate pr-3">{row.title}</span>
									<span className="text-emerald-300 font-semibold">{row.units_sold}</span>
								</div>
							))}
						</div>
					)}
				</div>
				<div className="bg-white/10 p-4 rounded-lg border border-white/10">
					<p className="text-sm text-white/70 font-semibold mb-3">Payment Breakdown (30d)</p>
					{(overview?.payment_breakdown?.length ?? 0) === 0 ? (
						<p className="text-sm text-white/50">No payment breakdown data.</p>
					) : (
						<div className="space-y-2">
							{overview?.payment_breakdown?.map((row) => (
								<div key={row.payment_account_id} className="border border-white/10 rounded-md px-3 py-2 text-sm">
									<div className="flex items-center justify-between gap-3">
										<span className="text-white/90 truncate">{row.name}</span>
										<span className="text-white/70">{row.orders} orders</span>
									</div>
									<p className="text-emerald-300 font-semibold mt-1">฿{Math.round(row.revenue).toLocaleString()}</p>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
			<Card variant="glass" className="mt-10 p-5 rounded-2xl">
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
		</>
	);
}
