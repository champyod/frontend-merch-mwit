"use client";

import { useState } from "react";
import { useAdminUsers } from "@/hooks/useAdmin";
import { Loader2, Users, CircleDot } from "lucide-react";

export default function AdminUsersPage() {
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
	const [role, setRole] = useState<"all" | "super-admin" | "customer">("all");
	const [sort, setSort] = useState<"created_desc" | "created_asc" | "last_active_desc" | "last_active_asc">("created_desc");
	const [page, setPage] = useState(1);

	const { data, isLoading } = useAdminUsers({ search, status, role, sort, page, limit: 20 });
	const users = data?.items ?? [];
	const total = data?.total ?? 0;
	const limit = data?.limit ?? 20;
	const totalPages = Math.max(1, Math.ceil(total / limit));

	const onStatusChange = (value: "all" | "active" | "inactive") => {
		setStatus(value);
		setPage(1);
	};

	const onRoleChange = (value: "all" | "super-admin" | "customer") => {
		setRole(value);
		setPage(1);
	};

	const onSearchChange = (value: string) => {
		setSearch(value);
		setPage(1);
	};

	const onSortChange = (value: "created_desc" | "created_asc" | "last_active_desc" | "last_active_asc") => {
		setSort(value);
		setPage(1);
	};

	return (
		<div className="p-6 space-y-6 pb-20">
			<div>
				<h1 className="text-3xl font-bold text-white">Registered Users</h1>
				<p className="text-slate-400">Customer and super-admin activity overview.</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-4 gap-3">
				<input
					title="Search users"
					placeholder="Search by name or email"
					value={search}
					onChange={(event) => onSearchChange(event.target.value)}
					className="bg-white/5 border border-white/10 rounded-xl p-3 text-white"
				/>
				<select
					title="Filter by status"
					value={status}
					onChange={(event) => onStatusChange(event.target.value as "all" | "active" | "inactive")}
					className="bg-white/5 border border-white/10 rounded-xl p-3 text-white"
				>
					<option value="all">All statuses</option>
					<option value="active">Active</option>
					<option value="inactive">Inactive</option>
				</select>
				<select
					title="Filter by role"
					value={role}
					onChange={(event) => onRoleChange(event.target.value as "all" | "super-admin" | "customer")}
					className="bg-white/5 border border-white/10 rounded-xl p-3 text-white"
				>
					<option value="all">All roles</option>
					<option value="super-admin">Super-admin</option>
					<option value="customer">Customer</option>
				</select>
				<select
					title="Sort users"
					value={sort}
					onChange={(event) => onSortChange(event.target.value as "created_desc" | "created_asc" | "last_active_desc" | "last_active_asc")}
					className="bg-white/5 border border-white/10 rounded-xl p-3 text-white"
				>
					<option value="created_desc">Newest joined</option>
					<option value="created_asc">Oldest joined</option>
					<option value="last_active_desc">Recently active</option>
					<option value="last_active_asc">Least recently active</option>
				</select>
			</div>

			{isLoading ? (
				<div className="flex justify-center p-20">
					<Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
				</div>
			) : users.length === 0 ? (
				<div className="text-center p-16 bg-white/5 rounded-2xl border border-white/10">
					<Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
					<p className="text-slate-400">No users found.</p>
				</div>
			) : (
				<>
					<div className="grid grid-cols-1 gap-4">
						{users.map((user) => (
							<div key={user.uuid} className="bg-white/5 rounded-2xl border border-white/10 p-4">
								<div className="flex items-start justify-between gap-4">
									<div>
										<p className="text-lg font-bold text-white">{user.name || "Unnamed"}</p>
										<p className="text-sm text-slate-400">{user.email}</p>
										<p className="text-xs text-slate-500 mt-2">Joined: {new Date(user.created_at).toLocaleString()}</p>
										<p className="text-xs text-slate-500">Last active: {user.last_active_at ? new Date(user.last_active_at).toLocaleString() : "Never"}</p>
									</div>
									<div className="text-right">
										<span className="inline-block px-2 py-1 text-xs rounded bg-emerald-500/20 text-emerald-400 uppercase font-bold tracking-wide">{user.role}</span>
										<div className="mt-3 flex items-center justify-end gap-1 text-xs">
											<CircleDot className={`w-3 h-3 ${user.is_active ? "text-emerald-400" : "text-slate-500"}`} />
											<span className={user.is_active ? "text-emerald-400" : "text-slate-500"}>{user.is_active ? "Active" : "Inactive"}</span>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
					<div className="flex items-center justify-between gap-4 pt-2">
						<p className="text-sm text-slate-400">
							Showing {users.length} of {total} users
						</p>
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={() => setPage((prev) => Math.max(1, prev - 1))}
								disabled={page <= 1}
								className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm disabled:opacity-50"
							>
								Prev
							</button>
							<span className="text-sm text-slate-300">Page {page} / {totalPages}</span>
							<button
								type="button"
								onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))}
								disabled={page >= totalPages}
								className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm disabled:opacity-50"
							>
								Next
							</button>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
