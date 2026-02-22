"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useLocale } from "next-intlayer";
import { normalizeLocale } from "@/lib/navigation";
import { useAdminSets, useDisableSet, useRestoreSet } from "@/hooks/useAdmin";
import { AdminSetStatusFilter, getAdminSetImage, getAdminSetStateLabels } from "@/lib/adminSets";
import { Badge, Box, Button, Card, Flex, Grid, Heading, Input, Stack, Text } from "@/components/ui/primitives";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminSetsPageContent() {
	const localeData = useLocale();
	const locale = normalizeLocale(localeData);

	const [search, setSearch] = useState("");
	const [status, setStatus] = useState<AdminSetStatusFilter>("");
	const { data: sets = [], isLoading } = useAdminSets(search, status);
	const disableSetMutation = useDisableSet();
	const restoreSetMutation = useRestoreSet();

	const onDisableSet = async (setId: number) => {
		if (!confirm("Disable this set?")) return;
		try {
			await disableSetMutation.mutateAsync(setId);
			toast.success("Set disabled");
		} catch {
			toast.error("Disable failed");
		}
	};

	const onRestoreSet = async (setId: number) => {
		try {
			await restoreSetMutation.mutateAsync(setId);
			toast.success("Set restored");
		} catch {
			toast.error("Restore failed");
		}
	};

	return (
		<Box className="p-6 pb-20 space-y-6">
			<Flex justifyContent="between" alignItems="end" className="gap-4">
				<Stack gap={1}>
					<Heading level={1} size="3xl" color="text-white">Sets</Heading>
					<Text color="text-slate-400">Box set management (search, filter, edit, disable).</Text>
				</Stack>
				<Link href={`/${locale}/admin/sets/add`}>
					<Button variant="primary">+ Add Set</Button>
				</Link>
			</Flex>

			<Grid cols={1} gap={3} className="md:grid-cols-3">
				<Input
					id="admin-sets-search"
					label="Search"
					value={search}
					onChange={(event) => setSearch(event.target.value)}
					placeholder="Search by title"
				/>

				<Stack gap={2}>
					<Text size="sm" weight="medium" color="text-slate-400">Status</Text>
					<Select value={status} onValueChange={(value: AdminSetStatusFilter) => setStatus(value)}>
						<SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
							<SelectValue placeholder="All status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="">All status</SelectItem>
							<SelectItem value="shown">Shown</SelectItem>
							<SelectItem value="hidden">Hidden</SelectItem>
							<SelectItem value="enabled">Enabled</SelectItem>
							<SelectItem value="disabled">Disabled</SelectItem>
						</SelectContent>
					</Select>
				</Stack>
			</Grid>

			{isLoading ? (
				<Text color="text-slate-400">Loading sets...</Text>
			) : sets.length === 0 ? (
				<Card variant="glass" className="p-8 text-center">
					<Text color="text-slate-400">No sets found.</Text>
				</Card>
			) : (
				<Grid cols={1} gap={4} className="lg:grid-cols-2">
					{sets.map((setItem) => {
						const image = getAdminSetImage(setItem);
						const labels = getAdminSetStateLabels(setItem);

						return (
							<Card key={setItem.id} variant="glass" className="p-4">
								<Flex gap={4}>
									<Box className="w-24 h-24 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
										{image ? (
											<img src={image} alt={setItem.title} className="w-full h-full object-cover" />
										) : (
											<Flex alignItems="center" justifyContent="center" className="w-full h-full">
												<Text size="xs" color="text-slate-500">No image</Text>
											</Flex>
										)}
									</Box>

									<Stack gap={2} className="flex-1 min-w-0">
										<Heading level={3} size="lg" color="text-white" className="truncate">{setItem.title}</Heading>
										<Text size="sm" color="text-slate-400" className="line-clamp-2">{setItem.description || "No description"}</Text>

										<Flex gap={2} wrap="wrap">
											<Badge variant="success">฿{setItem.price}</Badge>
											<Badge variant={setItem.is_preorder === 1 ? "warning" : "default"}>{labels.preorder}</Badge>
											<Badge variant={setItem.hidden === 1 ? "danger" : "info"}>{labels.visibility}</Badge>
											<Badge variant={setItem.enabled === 1 ? "success" : "default"}>{labels.enabled}</Badge>
										</Flex>

										<Flex gap={2} className="mt-1">
											<Link href={`/${locale}/admin/sets/edit/${setItem.id}`}>
												<Button variant="secondary" size="sm">Edit</Button>
											</Link>
											{setItem.enabled === 1 ? (
												<Button type="button" variant="danger" size="sm" onClick={() => onDisableSet(setItem.id)}>
													Disable
												</Button>
											) : (
												<Button type="button" variant="secondary" size="sm" onClick={() => onRestoreSet(setItem.id)}>
													Restore
												</Button>
											)}
										</Flex>
									</Stack>
								</Flex>
							</Card>
						);
					})}
				</Grid>
			)}
		</Box>
	);
}
