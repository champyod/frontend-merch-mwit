"use client";

import { useMemo, useState } from "react";
import { CircleDot, Loader2, Users } from "lucide-react";
import { toast } from "sonner";
import { useAdminUsers, useExportAdminUsers } from "@/hooks/useAdmin";
import {
	AdminUserRole,
	AdminUserSort,
	AdminUserStatus,
	buildAdminUsersExportFileName,
	downloadBlobFile,
	formatAdminDate,
} from "@/lib/adminUsers";
import { Badge, Box, Button, Card, Flex, Grid, Heading, Input, Stack, Text } from "@/components/ui/primitives";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminUsersPageContent() {
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState<AdminUserStatus>("all");
	const [role, setRole] = useState<AdminUserRole>("all");
	const [sort, setSort] = useState<AdminUserSort>("created_desc");
	const [page, setPage] = useState(1);

	const filters = useMemo(
		() => ({ search, status, role, sort, page, limit: 20 }),
		[search, status, role, sort, page],
	);

	const { data, isLoading } = useAdminUsers(filters);
	const exportUsersMutation = useExportAdminUsers();

	const users = data?.items ?? [];
	const total = data?.total ?? 0;
	const limit = data?.limit ?? 20;
	const totalPages = Math.max(1, Math.ceil(total / limit));

	const onExportUsers = async () => {
		try {
			const blob = await exportUsersMutation.mutateAsync({ search, status, role, sort });
			downloadBlobFile(blob, buildAdminUsersExportFileName());
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Export failed");
		}
	};

	return (
		<Box className="p-6 space-y-6 pb-20">
			<Flex justifyContent="between" className="gap-3">
				<Stack gap={1}>
					<Heading level={1} size="3xl" color="text-white">Registered Users</Heading>
					<Text size="sm" color="text-slate-400">Customer and super-admin activity overview.</Text>
				</Stack>
				<Button type="button" variant="primary" onClick={onExportUsers} isLoading={exportUsersMutation.isPending}>
					Export CSV
				</Button>
			</Flex>

			<Grid cols={1} gap={3} className="md:grid-cols-4">
				<Input
					id="admin-users-search"
					label="Search"
					placeholder="Search by name or email"
					value={search}
					onChange={(event) => {
						setSearch(event.target.value);
						setPage(1);
					}}
				/>

				<Stack gap={2}>
					<Text size="sm" weight="medium" color="text-slate-400">Status</Text>
					<Select
						value={status}
						onValueChange={(value: AdminUserStatus) => {
							setStatus(value);
							setPage(1);
						}}
					>
						<SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
							<SelectValue placeholder="All statuses" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All statuses</SelectItem>
							<SelectItem value="active">Active</SelectItem>
							<SelectItem value="inactive">Inactive</SelectItem>
						</SelectContent>
					</Select>
				</Stack>

				<Stack gap={2}>
					<Text size="sm" weight="medium" color="text-slate-400">Role</Text>
					<Select
						value={role}
						onValueChange={(value: AdminUserRole) => {
							setRole(value);
							setPage(1);
						}}
					>
						<SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
							<SelectValue placeholder="All roles" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All roles</SelectItem>
							<SelectItem value="super-admin">Super-admin</SelectItem>
							<SelectItem value="customer">Customer</SelectItem>
						</SelectContent>
					</Select>
				</Stack>

				<Stack gap={2}>
					<Text size="sm" weight="medium" color="text-slate-400">Sort</Text>
					<Select
						value={sort}
						onValueChange={(value: AdminUserSort) => {
							setSort(value);
							setPage(1);
						}}
					>
						<SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
							<SelectValue placeholder="Newest joined" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="created_desc">Newest joined</SelectItem>
							<SelectItem value="created_asc">Oldest joined</SelectItem>
							<SelectItem value="last_active_desc">Recently active</SelectItem>
							<SelectItem value="last_active_asc">Least recently active</SelectItem>
						</SelectContent>
					</Select>
				</Stack>
			</Grid>

			{isLoading ? (
				<Flex justifyContent="center" className="p-20">
					<Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
				</Flex>
			) : users.length === 0 ? (
				<Card variant="glass" className="text-center p-16">
					<Stack gap={3} alignItems="center">
						<Users className="w-10 h-10 text-slate-600" />
						<Text color="text-slate-400">No users found.</Text>
					</Stack>
				</Card>
			) : (
				<Stack gap={4}>
					<Stack gap={4}>
						{users.map((user) => (
							<Card key={user.uuid} variant="glass" className="p-4">
								<Flex justifyContent="between" alignItems="start" className="gap-4">
									<Stack gap={1}>
										<Heading level={3} size="lg" color="text-white">{user.name || "Unnamed"}</Heading>
										<Text size="sm" color="text-slate-400">{user.email}</Text>
										<Text size="xs" color="text-slate-500">Joined: {formatAdminDate(user.created_at)}</Text>
										<Text size="xs" color="text-slate-500">Last active: {formatAdminDate(user.last_active_at)}</Text>
									</Stack>

									<Stack gap={2} alignItems="end">
										<Badge variant="success">{user.role}</Badge>
										<Flex gap={1} alignItems="center">
											<CircleDot className={`w-3 h-3 ${user.is_active ? "text-emerald-400" : "text-slate-500"}`} />
											<Text size="xs" color={user.is_active ? "text-emerald-400" : "text-slate-500"}>
												{user.is_active ? "Active" : "Inactive"}
											</Text>
										</Flex>
									</Stack>
								</Flex>
							</Card>
						))}
					</Stack>

					<Flex justifyContent="between" alignItems="center" className="pt-2 gap-4">
						<Text size="sm" color="text-slate-400">Showing {users.length} of {total} users</Text>
						<Flex gap={2} alignItems="center">
							<Button type="button" variant="secondary" size="sm" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page <= 1}>
								Prev
							</Button>
							<Text size="sm" color="text-slate-300">Page {page} / {totalPages}</Text>
							<Button type="button" variant="secondary" size="sm" onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))} disabled={page >= totalPages}>
								Next
							</Button>
						</Flex>
					</Flex>
				</Stack>
			)}
		</Box>
	);
}
