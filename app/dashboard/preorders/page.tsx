"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Download, CheckCircle, Package, User, Clock, ExternalLink, Loader2, MapPin, Phone, CreditCard, ShoppingBag, Truck, Edit, Save } from "lucide-react";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { LiquidCard } from "@/components/ui/LiquidCard";
import { Preorder, OrderItem } from "@/types/types";
import { useState } from "react";

interface GetPreordersResponse {
	payload?: Preorder[];
}

export default function PreordersPage() {
	const { data, refetch, isLoading } = useQuery<any, any, GetPreordersResponse, any>({
		queryKey: ["preorders"],
		queryFn: async () => {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/preorders`);
			return await res.json();
		},
	});

	const handleExport = () => {
		const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/preorders/export`;
		window.open(url, "_blank");
	};

	const updateStatus = async (id: number, status: string, trackingNo: string, note: string) => {
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/preorders/${id}/status`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status, tracking_no: trackingNo, note })
			});
			if (!res.ok) throw new Error("Failed");
			toast.success("Order status updated");
			refetch();
		} catch (e) {
			toast.error("Update failed");
		}
	};

	const markCompleted = async (id: number) => {
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/preorders/${id}/complete`, {
				method: "PUT",
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
			<div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
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
					<div className="grid grid-cols-1 gap-6">
						{pending.map(p => (
							<OrderCard 
								key={p.id} 
								preorder={p} 
								onComplete={() => markCompleted(p.id)} 
								onUpdateStatus={(s, t, n) => updateStatus(p.id, s, t, n)}
							/>
						))}
					</div>
				)}
			</div>

			{completed.length > 0 && (
				<div className="space-y-6 pt-10">
					<h2 className="text-xl font-bold text-slate-400 flex items-center gap-2">
						<CheckCircle className="w-5 h-5" /> Completed Orders ({completed.length})
					</h2>
					<div className="grid grid-cols-1 gap-6 opacity-60">
						{completed.map(p => (
							<OrderCard 
								key={p.id} 
								preorder={p} 
								isCompleted 
								onUpdateStatus={(s, t, n) => updateStatus(p.id, s, t, n)}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

function OrderCard({ 
	preorder, 
	onComplete, 
	isCompleted,
	onUpdateStatus
}: { 
	preorder: Preorder, 
	onComplete?: () => void, 
	isCompleted?: boolean,
	onUpdateStatus: (status: string, trackingNo: string, note: string) => void
}) {
	const [status, setStatus] = useState(preorder.status || "placed");
	const [trackingNo, setTrackingNo] = useState(preorder.tracking_no || "");
	const [note, setNote] = useState(preorder.note || "");
	const [isEditing, setIsEditing] = useState(false);

	const handleSave = () => {
		onUpdateStatus(status, trackingNo, note);
		setIsEditing(false);
	};

	return (
		<LiquidCard className={`p-6 space-y-6 ${isCompleted ? 'border-white/5' : 'border-emerald-500/20'}`}>
			<div className="flex flex-wrap justify-between items-start gap-4 border-b border-white/5 pb-4">
				<div className="space-y-1">
					<div className="text-sm font-bold text-white flex items-center gap-2">
						Order #{preorder.id}
						{preorder.payment_slip_url && (
							<a href={`${process.env.NEXT_PUBLIC_API_BASE_URL}${preorder.payment_slip_url}`} target="_blank" className="text-[10px] bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded-full hover:bg-emerald-500/30 transition-all flex items-center gap-1">
								<CreditCard className="w-3 h-3" /> View Slip
							</a>
						)}
						<span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60 font-black uppercase tracking-widest">
							{preorder.status}
						</span>
					</div>
					<div className="text-xs text-slate-500">{new Date(preorder.created_at).toLocaleString()}</div>
				</div>
				<div className="text-right">
					<div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Total Price</div>
					<div className="text-lg font-black text-emerald-500">฿{preorder.total_price?.toLocaleString()}</div>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{/* Customer Info */}
				<div className="space-y-3">
					<div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Customer</div>
					<div className="space-y-2">
						<div className="text-sm text-white flex items-center gap-2 font-medium">
							<User className="w-4 h-4 text-slate-500" /> {preorder.customer_name}
						</div>
						<div className="text-sm text-white flex items-center gap-2">
							<Phone className="w-4 h-4 text-slate-500" /> {preorder.contact_number || "No contact"}
						</div>
						<div className="text-sm text-emerald-500 flex items-center gap-2">
							<ExternalLink className="w-4 h-4 text-slate-500" /> 
							<a href={preorder.social.startsWith('http') ? preorder.social : `https://social.com/${preorder.social}`} target="_blank" className="hover:underline">
								{preorder.social}
							</a>
						</div>
					</div>
				</div>

				{/* Shipping & Items */}
				<div className="space-y-3">
					<div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Shipping & Items</div>
					<div className="text-xs text-slate-300 mb-2">Method: <span className="text-white font-bold">{preorder.shipping_method}</span></div>
					<div className="space-y-1">
						{preorder.items?.map((oi: OrderItem, idx: number) => (
							<div key={idx} className="text-[10px] text-white/60">
								• {oi.item?.title} ({oi.color}/{oi.size}) x{oi.quantity}
							</div>
						))}
					</div>
				</div>

				{/* Update Form */}
				<div className="lg:col-span-2 bg-white/5 p-4 rounded-2xl border border-white/5 space-y-4">
					<div className="flex items-center justify-between">
						<div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Manage Fulfillment</div>
						<button 
							onClick={() => setIsEditing(!isEditing)}
							className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 hover:underline"
						>
							{isEditing ? "Cancel" : <><Edit className="w-3 h-3" /> Edit Details</>}
						</button>
					</div>

					{isEditing ? (
						<div className="space-y-3">
							<div className="grid grid-cols-2 gap-3">
								<select 
									value={status} 
									onChange={(e) => setStatus(e.target.value)}
									className="bg-secondary border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none"
								>
									<option value="placed">Placed</option>
									<option value="confirmed">Confirmed</option>
									<option value="packed">Packed</option>
									<option value="shipped">Shipped</option>
									<option value="delivered">Delivered</option>
								</select>
								<input 
									type="text" 
									placeholder="Tracking No." 
									value={trackingNo}
									onChange={(e) => setTrackingNo(e.target.value)}
									className="bg-secondary border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none"
								/>
							</div>
							<textarea 
								placeholder="Admin Note to customer..." 
								value={note}
								onChange={(e) => setNote(e.target.value)}
								className="w-full bg-secondary border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none h-16"
							/>
							<LiquidButton onClick={handleSave} className="w-full py-2 text-xs h-auto">
								<Save className="w-3 h-3 mr-1" /> Save Updates
							</LiquidButton>
						</div>
					) : (
						<div className="space-y-2">
							<div className="flex justify-between text-[11px]">
								<span className="text-slate-500">Status:</span>
								<span className="text-white font-bold uppercase tracking-widest">{preorder.status}</span>
							</div>
							<div className="flex justify-between text-[11px]">
								<span className="text-slate-500">Tracking:</span>
								<span className="text-[#58a076] font-bold">{preorder.tracking_no || "N/A"}</span>
							</div>
							{preorder.note && (
								<div className="mt-2 text-[10px] text-white/40 italic line-clamp-2">
									Note: {preorder.note}
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			{!isCompleted && onComplete && (
				<div className="pt-4 border-t border-white/5 flex justify-end">
					<LiquidButton onClick={onComplete} className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-500 text-xs py-2 h-auto">
						Mark Fulfillment Complete
					</LiquidButton>
				</div>
			)}
		</LiquidCard>
	);
}
