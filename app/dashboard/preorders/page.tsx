"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Download, CheckCircle, Package, User, Clock, ExternalLink, Loader2 } from "lucide-react";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { LiquidCard } from "@/components/ui/LiquidCard";
import { Preorder } from "@/types/types";

interface GetPreordersResponse {
	payload?: Preorder[];
}

export default function PreordersPage() {
	const { data, refetch, isLoading } = useQuery<any, any, GetPreordersResponse, any>({
		queryKey: ["preorders"],
		queryFn: async () => {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/preorders`, {
				headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
			});
			return await res.json();
		},
	});

	const handleExport = () => {
		const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/preorders/export`;
		window.open(url, "_blank");
	};

	const markCompleted = async (id: number) => {
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/preorders/${id}/complete`, {
				method: "PUT",
				headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
			});
			if (!res.ok) throw new Error("Failed");
			toast.success("Order marked as completed");
			refetch();
		} catch (e) {
			toast.error("Update failed");
		}
	};

	const preorders = data?.payload || [];
	const pending = preorders.filter(p => p.completed === 0);
	const completed = preorders.filter(p => p.completed === 1);

	return (
		<div className="p-6 space-y-8 pb-20">
			<div className="flex justify-between items-end">
				<div className="space-y-2">
					<h1 className="text-3xl font-bold text-white">Preorders Dashboard</h1>
					<p className="text-slate-400">Track and manage all customer orders.</p>
				</div>
				<LiquidButton variant="outline" onClick={handleExport} className="flex items-center gap-2">
					<Download className="w-4 h-4" /> Export CSV Report
				</LiquidButton>
			</div>

			<div className="space-y-6">
				<h2 className="text-xl font-bold text-emerald-500 flex items-center gap-2">
					<Clock className="w-5 h-5" /> Pending Fulfillment ({pending.length})
				</h2>
				
				{isLoading ? (
					<div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-emerald-500" /></div>
				) : pending.length === 0 ? (
					<LiquidCard className="p-12 text-center text-slate-500">No pending orders.</LiquidCard>
				) : (
					<div className="grid grid-cols-1 gap-4">
						{pending.map(p => (
							<OrderCard key={p.id} preorder={p} onComplete={() => markCompleted(p.id)} />
						))}
					</div>
				)}
			</div>

			{completed.length > 0 && (
				<div className="space-y-6 pt-10">
					<h2 className="text-xl font-bold text-slate-400 flex items-center gap-2">
						<CheckCircle className="w-5 h-5" /> Completed Orders ({completed.length})
					</h2>
					<div className="grid grid-cols-1 gap-4 opacity-60">
						{completed.map(p => (
							<OrderCard key={p.id} preorder={p} isCompleted />
						))}
					</div>
				</div>
			)}
		</div>
	);
}

function OrderCard({ preorder, onComplete, isCompleted }: { preorder: Preorder, onComplete?: () => void, isCompleted?: boolean }) {
	return (
		<LiquidCard className={`p-5 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between ${isCompleted ? 'border-white/5' : 'border-emerald-500/20'}`}>
			<div className="flex items-center gap-4 min-w-[250px]">
				<div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
					{preorder.image_url ? (
						<img src={preorder.image_url} alt="" className="w-full h-full object-cover" />
					) : (
						<div className="w-full h-full flex items-center justify-center text-slate-700"><Package /></div>
					)}
				</div>
				<div>
					<div className="font-bold text-white leading-tight">{preorder.title}</div>
					<div className="text-xs text-slate-500 mt-1">ID: #{preorder.id} • {new Date(preorder.created_at).toLocaleDateString()}</div>
				</div>
			</div>

			<div className="grid grid-cols-2 md:flex items-center gap-8 flex-grow">
				<div className="space-y-1">
					<div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Customer</div>
					<div className="text-sm text-white flex items-center gap-1.5"><User className="w-3 h-3" /> {preorder.customer_name}</div>
				</div>
				<div className="space-y-1">
					<div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Contact</div>
					<a href={preorder.social} target="_blank" className="text-sm text-emerald-500 hover:underline flex items-center gap-1">
						Social <ExternalLink className="w-3 h-3" />
					</a>
				</div>
				<div className="space-y-1">
					<div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Variant</div>
					<div className="text-sm text-white">{preorder.color} / {preorder.size}</div>
				</div>
			</div>

			{!isCompleted && onComplete && (
				<LiquidButton onClick={onComplete} size="sm" className="w-full md:w-auto bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-500">
					Mark Completed
				</LiquidButton>
			)}
		</LiquidCard>
	);
}