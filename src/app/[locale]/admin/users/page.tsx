"use client";

import { useAdminUsers } from "@/hooks/useAdmin";
import { Loader2, Users, CircleDot } from "lucide-react";

export default function AdminUsersPage() {
	const { data: users = [], isLoading } = useAdminUsers();

	return (
		<div className="p-6 space-y-6 pb-20">
			<div>
				<h1 className="text-3xl font-bold text-white">Registered Users</h1>
				<p className="text-slate-400">Customer and super-admin activity overview.</p>
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
			)}
		</div>
	);
}
