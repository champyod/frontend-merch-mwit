"use client";

import Link from "next/link";
import { useLocale } from "next-intlayer";
import { normalizeLocale } from "@/lib/navigation";
import { Box, Card, Heading, Stack, Text, Grid, Badge } from "@/components/ui/primitives";
import { ArrowRight } from "lucide-react";

export default function AdminFeatureMapPage() {
	const localeData = useLocale();
	const locale = normalizeLocale(localeData);

	const links = {
		dashboard: `/${locale}/admin`,
		paymentMethods: `/${locale}/admin/payment-methods`,
		products: `/${locale}/admin/products`,
		sets: `/${locale}/admin/sets`,
		preorders: `/${locale}/admin/preorders`,
		pages: `/${locale}/admin/pages`,
		settings: `/${locale}/admin/settings`,
		users: `/${locale}/admin/users`,
	};

	return (
		<Stack gap={6} className="pb-20">
			<Stack gap={2}>
				<Heading level={1} size="3xl" color="text-white">
					Admin Feature Map
				</Heading>
				<Text color="text-slate-400">
					Overview of how payment, products, sets, orders, and dashboard analytics are connected.
				</Text>
			</Stack>

			<Card className="p-6">
				<Stack gap={4}>
					<Text weight="bold" size="lg" color="text-white">Main Data Flow</Text>
					<Box className="flex flex-wrap items-center gap-2 text-sm">
						<Badge variant="info">Payment Methods</Badge>
						<ArrowRight className="w-4 h-4 text-slate-500" />
						<Badge variant="default">Products</Badge>
						<ArrowRight className="w-4 h-4 text-slate-500" />
						<Badge variant="default">Sets (multiple products)</Badge>
						<ArrowRight className="w-4 h-4 text-slate-500" />
						<Badge variant="success">Preorders / Orders</Badge>
						<ArrowRight className="w-4 h-4 text-slate-500" />
						<Badge variant="warning">Dashboard Analytics + Tables</Badge>
					</Box>
				</Stack>
			</Card>

			<Grid cols={1} gap={4} className="md:grid-cols-2">
				<Card className="p-5">
					<Stack gap={2}>
						<Text weight="bold" color="text-white">1) Payment Methods</Text>
						<Text size="sm" color="text-slate-400">Contains account information list (name, PromptPay ID, active/inactive).</Text>
						<Link href={links.paymentMethods} className="text-sm text-emerald-400 hover:text-emerald-300">Open Payment Methods →</Link>
					</Stack>
				</Card>

				<Card className="p-5">
					<Stack gap={2}>
						<Text weight="bold" color="text-white">2) Products</Text>
						<Text size="sm" color="text-slate-400">Each product links to a payment account and can be included in sets.</Text>
						<Link href={links.products} className="text-sm text-emerald-400 hover:text-emerald-300">Open Products →</Link>
					</Stack>
				</Card>

				<Card className="p-5">
					<Stack gap={2}>
						<Text weight="bold" color="text-white">3) Sets</Text>
						<Text size="sm" color="text-slate-400">A set connects multiple products with quantity and uses a payment account.</Text>
						<Link href={links.sets} className="text-sm text-emerald-400 hover:text-emerald-300">Open Sets →</Link>
					</Stack>
				</Card>

				<Card className="p-5">
					<Stack gap={2}>
						<Text weight="bold" color="text-white">4) Preorders / Orders</Text>
						<Text size="sm" color="text-slate-400">Operational records for customers, status updates, totals, and fulfillment tracking.</Text>
						<Link href={links.preorders} className="text-sm text-emerald-400 hover:text-emerald-300">Open Preorders →</Link>
					</Stack>
				</Card>
			</Grid>

			<Card className="p-6">
				<Stack gap={3}>
					<Text weight="bold" color="text-white">Dashboard / Tables / Logs</Text>
					<Text size="sm" color="text-slate-400">
						Dashboard aggregates data from products, sets, and preorders into analytics cards and order tables.
					</Text>
					<Link href={links.dashboard} className="text-sm text-emerald-400 hover:text-emerald-300">Open Admin Dashboard →</Link>
				</Stack>
			</Card>

			<Card className="p-6">
				<Stack gap={2}>
					<Text weight="bold" color="text-white">Related Admin Pages</Text>
					<Box className="flex flex-wrap gap-3 text-sm">
						<Link href={links.pages} className="text-slate-300 hover:text-white">Pages</Link>
						<Link href={links.settings} className="text-slate-300 hover:text-white">Settings</Link>
						<Link href={links.users} className="text-slate-300 hover:text-white">Users</Link>
					</Box>
				</Stack>
			</Card>
		</Stack>
	);
}
