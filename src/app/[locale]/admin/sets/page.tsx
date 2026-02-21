"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdminSets, useDisableSet } from "@/hooks/useAdmin";
import { toast } from "sonner";
import { useLocale } from "next-intlayer";
import { normalizeLocale } from "@/lib/navigation";

export default function AdminSetsPage() {
	const localeData = useLocale();
	const locale = normalizeLocale(localeData);
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState("");
	const { data: sets = [], isLoading } = useAdminSets(search, status);
	const disableMutation = useDisableSet();

	const disableSet = async (setId: number) => {
		if (!confirm("Disable this set?")) return;
		try {
			await disableMutation.mutateAsync(setId);
			toast.success("Set disabled");
		} catch {
			toast.error("Disable failed");
		}
	};

	return (
		<div className="p-6 pb-20 space-y-6">
			<div className="flex items-end justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-white">Sets</h1>
					<p className="text-slate-400">Box set management (search, filter, edit, disable).</p>
				</div>
				<Link href={`/${locale}/admin/sets/add`} className="px-4 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-400 transition-all">+ Add Set</Link>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
				<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by title" className="bg-white/5 border border-white/10 rounded-xl p-3 text-white" />
				<select title="Filter status" value={status} onChange={(event) => setStatus(event.target.value)} className="bg-white/5 border border-white/10 rounded-xl p-3 text-white">
					<option value="">All status</option>
					<option value="shown">Shown</option>
					<option value="hidden">Hidden</option>
					<option value="enabled">Enabled</option>
					<option value="disabled">Disabled</option>
				</select>
			</div>

			{isLoading ? (
				<p className="text-slate-400">Loading sets...</p>
			) : sets.length === 0 ? (
				<div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-slate-400">No sets found.</div>
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					{sets.map((setItem) => {
						const image = setItem.images?.[0]?.url || setItem.images?.[0]?.URL;
						return (
							<div key={setItem.id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
								<div className="flex gap-4">
									<div className="w-24 h-24 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
										{image ? <img src={image} alt={setItem.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">No image</div>}
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-lg font-bold text-white truncate">{setItem.title}</p>
										<p className="text-sm text-slate-400 line-clamp-2">{setItem.description || "No description"}</p>
										<div className="mt-2 flex gap-2 text-xs">
											<span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300">฿{setItem.price}</span>
											<span className={`px-2 py-1 rounded ${setItem.is_preorder === 1 ? "bg-amber-500/20 text-amber-300" : "bg-slate-500/20 text-slate-300"}`}>{setItem.is_preorder === 1 ? "Preorder" : "Normal"}</span>
											<span className={`px-2 py-1 rounded ${setItem.hidden === 1 ? "bg-red-500/20 text-red-300" : "bg-blue-500/20 text-blue-300"}`}>{setItem.hidden === 1 ? "Hidden" : "Shown"}</span>
											<span className={`px-2 py-1 rounded ${setItem.enabled === 1 ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-500/20 text-slate-300"}`}>{setItem.enabled === 1 ? "Enabled" : "Disabled"}</span>
										</div>
										<div className="mt-3 flex gap-2">
											<Link href={`/${locale}/admin/sets/edit/${setItem.id}`} className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20">Edit</Link>
											<button onClick={() => disableSet(setItem.id)} className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 text-sm hover:bg-red-500/30">Disable</button>
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
