"use client";

import { toast } from "sonner";
import { Download, CheckCircle, Package, User, Clock, ExternalLink, Loader2, MapPin, Phone, CreditCard, ShoppingBag, Truck, Edit, Save, Filter } from "lucide-react";
import { Box, Card, Heading, Text, Button, Stack, Flex, Grid, Badge, Container } from "@/components/ui/primitives";
import { Preorder, OrderItem } from "@/types/types";
import { useState, useMemo } from "react";
import { useAdminPreorders, useUpdateOrderStatus, useCompletePreorder } from "@/hooks/useAdmin";
import { API_BASE_URL, API_HOST } from "@/lib/env";

export default function PreordersPage() {
	const { data: preorders = [], isLoading } = useAdminPreorders();
	const updateStatusMutation = useUpdateOrderStatus();
	const completeMutation = useCompletePreorder();

	// Filter states
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [completedFilter, setCompletedFilter] = useState<string>("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [dateFrom, setDateFrom] = useState("");
	const [dateTo, setDateTo] = useState("");

	// Apply filters
	const filteredOrders = useMemo(() => {
		return preorders.filter(order => {
			// Status filter
			if (statusFilter !== "all" && order.status !== statusFilter) return false;
			
			// Completed filter
			if (completedFilter === "pending" && order.completed !== 0) return false;
			if (completedFilter === "completed" && order.completed !== 1) return false;
			
			// Search filter (customer name, contact, social)
			if (searchQuery.trim()) {
				const query = searchQuery.toLowerCase();
				const matchName = order.customer_name?.toLowerCase().includes(query);
				const matchContact = order.contact_number?.toLowerCase().includes(query);
				const matchSocial = order.social?.toLowerCase().includes(query);
				if (!matchName && !matchContact && !matchSocial) return false;
			}
			
			// Date range filter
			if (dateFrom) {
				const orderDate = new Date(order.created_at);
				const fromDate = new Date(dateFrom);
				if (orderDate < fromDate) return false;
			}
			if (dateTo) {
				const orderDate = new Date(order.created_at);
				const toDate = new Date(dateTo);
				toDate.setHours(23, 59, 59);
				if (orderDate > toDate) return false;
			}
			
			return true;
		});
	}, [preorders, statusFilter, completedFilter, searchQuery, dateFrom, dateTo]);

	// Analytics for filtered orders
	const analytics = useMemo(() => {
		const totalOrders = filteredOrders.length;
		const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.total_price || 0), 0);
		const statusBreakdown: Record<string, number> = {};
		const paymentBreakdown: Record<string, { count: number; revenue: number }> = {};
		
		filteredOrders.forEach(order => {
			// Status
			const status = order.status || "unknown";
			statusBreakdown[status] = (statusBreakdown[status] || 0) + 1;
			
			// Payment
			const method = order.shipping_method || "unknown";
			if (!paymentBreakdown[method]) {
				paymentBreakdown[method] = { count: 0, revenue: 0 };
			}
			paymentBreakdown[method].count += 1;
			paymentBreakdown[method].revenue += order.total_price || 0;
		});
		
		return {
			totalOrders,
			totalRevenue,
			avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
			statusBreakdown,
			paymentBreakdown,
			pendingCount: filteredOrders.filter(o => o.completed === 0).length,
			completedCount: filteredOrders.filter(o => o.completed === 1).length,
		};
	}, [filteredOrders]);

	const handleExportFiltered = () => {
		try {
			const headers = ["Order ID", "Customer", "Contact", "Social", "Status", "Total (฿)", "Shipping", "Tracking", "Date", "Completed"];
			const rows = filteredOrders.map(order => [
				order.id,
				order.customer_name,
				order.contact_number || "",
				order.social || "",
				order.status || "",
				order.total_price || 0,
				order.shipping_method || "",
				order.tracking_no || "",
				new Date(order.created_at).toLocaleString(),
				order.completed === 1 ? "Yes" : "No"
			]);

			const csvContent = [
				headers.join(","),
				...rows.map(row => row.map(cell => `"${cell}"`).join(","))
			].join("\n");

			const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.setAttribute("href", url);
			link.setAttribute("download", `filtered-orders-${new Date().toISOString().split('T')[0]}.csv`);
			link.style.visibility = "hidden";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			toast.success("Filtered orders exported to CSV");
		} catch (error) {
			toast.error("Failed to export CSV");
		}
	};

	const updateStatus = async (id: number, status: string, trackingNo: string, note: string) => {
		try {
			await updateStatusMutation.mutateAsync({ id, status, tracking_no: trackingNo, note });
			toast.success("Order status updated");
		} catch (e) {
			toast.error("Update failed");
		}
	};

	const markCompleted = async (id: number) => {
		try {
			await completeMutation.mutateAsync(id);
			toast.success("Order marked as completed");
		} catch (e) {
			toast.error("Update failed");
		}
	};

	const pending = filteredOrders.filter(p => p.completed === 0);
	const completed = filteredOrders.filter(p => p.completed === 1);

	return (
		<Box className="pb-20">
			<Flex direction="col" className="md:flex-row justify-between items-start md:items-end gap-4 mb-6">
				<Stack gap={2}>
					<Heading level={1} size="3xl" color="text-white">Orders Dashboard</Heading>
					<Text color="text-slate-400">Filter, analyze and manage customer orders.</Text>
				</Stack>
			</Flex>

			<Card className="p-6">
				<Stack gap={8}>
					{/* FILTERS - TOP */}
					<Box>
						<Flex justifyContent="between" alignItems="center" className="mb-4" wrap="wrap">
							<Flex gap={2} alignItems="center">
								<Filter className="w-5 h-5 text-[#58a076]" />
								<Text weight="bold" color="text-white">Filters</Text>
							</Flex>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => {
									setStatusFilter("all");
									setCompletedFilter("all");
									setSearchQuery("");
									setDateFrom("");
									setDateTo("");
								}}
							>
								Clear All
							</Button>
						</Flex>
						
						<Grid cols={1} gap={4} className="md:grid-cols-2 lg:grid-cols-4">
							<Stack gap={2}>
								<label className="text-xs text-slate-400 uppercase font-bold">Status</label>
								<select
									value={statusFilter}
									onChange={(e) => setStatusFilter(e.target.value)}
									className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#58a076]/50"
								>
									<option value="all">All Statuses</option>
									<option value="placed">Placed</option>
									<option value="confirmed">Confirmed</option>
									<option value="packed">Packed</option>
									<option value="shipped">Shipped</option>
									<option value="delivered">Delivered</option>
								</select>
							</Stack>

							<Stack gap={2}>
								<label className="text-xs text-slate-400 uppercase font-bold">Fulfillment</label>
								<select
									value={completedFilter}
									onChange={(e) => setCompletedFilter(e.target.value)}
									className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#58a076]/50"
								>
									<option value="all">All Orders</option>
									<option value="pending">Pending</option>
									<option value="completed">Completed</option>
								</select>
							</Stack>

							<Stack gap={2}>
								<label className="text-xs text-slate-400 uppercase font-bold">Date From</label>
								<input
									type="date"
									value={dateFrom}
									onChange={(e) => setDateFrom(e.target.value)}
									className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#58a076]/50"
								/>
							</Stack>

							<Stack gap={2}>
								<label className="text-xs text-slate-400 uppercase font-bold">Date To</label>
								<input
									type="date"
									value={dateTo}
									onChange={(e) => setDateTo(e.target.value)}
									className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#58a076]/50"
								/>
							</Stack>

							<Box className="md:col-span-2 lg:col-span-4">
								<Stack gap={2}>
									<label className="text-xs text-slate-400 uppercase font-bold">Search Customer</label>
									<input
										type="text"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										placeholder="Search by name, contact, or social..."
										className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#58a076]/50 placeholder:text-slate-600"
									/>
								</Stack>
							</Box>
						</Grid>
					</Box>

					{/* ANALYTICS - BELOW FILTERS */}
					<Box className="border-t border-white/5 pt-8">
						<Flex justifyContent="end" alignItems="center" className="mb-6">
							<Button variant="outline" onClick={handleExportFiltered} className="gap-2" size="sm">
								<Download className="w-4 h-4" /> Export Filtered CSV
							</Button>
						</Flex>

						<Grid cols={2} gap={4} className="md:grid-cols-4 mb-6">
							<Card className="p-4 bg-white/5">
								<Text size="xs" weight="bold" color="text-slate-400" uppercase tracking="widest" className="mb-2 block">
									Total Orders
								</Text>
								<Text size="3xl" weight="bold" color="text-white" className="font-mono">
									{analytics.totalOrders}
								</Text>
							</Card>

							<Card className="p-4 bg-white/5">
								<Text size="xs" weight="bold" color="text-slate-400" uppercase tracking="widest" className="mb-2 block">
									Total Revenue
								</Text>
								<Text size="2xl" weight="bold" color="text-emerald-400" className="font-mono">
									฿{Math.round(analytics.totalRevenue).toLocaleString()}
								</Text>
							</Card>

							<Card className="p-4 bg-white/5">
								<Text size="xs" weight="bold" color="text-slate-400" uppercase tracking="widest" className="mb-2 block">
									Avg Order Value
								</Text>
								<Text size="2xl" weight="bold" color="text-blue-400" className="font-mono">
									฿{Math.round(analytics.avgOrderValue).toLocaleString()}
								</Text>
							</Card>

							<Card className="p-4 bg-white/5">
								<Text size="xs" weight="bold" color="text-slate-400" uppercase tracking="widest" className="mb-2 block">
									Pending / Done
								</Text>
								<Text size="2xl" weight="bold" color="text-yellow-400" className="font-mono">
									{analytics.pendingCount} / {analytics.completedCount}
								</Text>
							</Card>
						</Grid>

						{/* Status Breakdown Chart */}
						<Grid cols={1} gap={4} className="lg:grid-cols-2">
							<Card className="p-4 bg-white/5">
								<Text weight="bold" color="text-white" className="mb-4 block">Status Breakdown</Text>
								<Stack gap={3}>
									{Object.entries(analytics.statusBreakdown).map(([status, count]) => {
										const percent = analytics.totalOrders > 0 ? ((count / analytics.totalOrders) * 100).toFixed(1) : "0";
										return (
											<Box key={status}>
												<Flex justifyContent="between" className="mb-2">
													<Text size="sm" color="text-white" className="capitalize">{status}</Text>
													<Text size="sm" color="text-slate-400">{count} ({percent}%)</Text>
												</Flex>
												<div className="h-2 bg-white/5 rounded-full overflow-hidden">
													<div
														className="h-full bg-gradient-to-r from-[#58a076] to-[#217c6b]"
														style={{ width: `${percent}%` }}
													/>
												</div>
											</Box>
										);
									})}
								</Stack>
							</Card>

							{/* Shipping Method Breakdown */}
							<Card className="p-4 bg-white/5">
								<Text weight="bold" color="text-white" className="mb-4 block">Shipping Methods</Text>
								<Stack gap={3}>
									{Object.entries(analytics.paymentBreakdown).map(([method, data]) => {
										const percent = analytics.totalOrders > 0 ? ((data.count / analytics.totalOrders) * 100).toFixed(1) : "0";
										return (
											<Box key={method}>
												<Flex justifyContent="between" className="mb-1">
													<Text size="sm" color="text-white">{method}</Text>
													<Text size="sm" color="text-slate-400">{data.count}</Text>
												</Flex>
												<Text size="xs" color="text-emerald-400" className="mb-2">฿{Math.round(data.revenue).toLocaleString()}</Text>
												<div className="h-2 bg-white/5 rounded-full overflow-hidden">
													<div
														className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
														style={{ width: `${percent}%` }}
													/>
												</div>
											</Box>
										);
									})}
								</Stack>
							</Card>
						</Grid>
					</Box>

					{/* ORDER TABLE - BELOW ANALYTICS */}
					<Box className="border-t border-white/5 pt-8">
						<Stack gap={10}>
							<Stack gap={6}>
								<Heading level={2} size="xl" color="text-[#58a076]" className="flex items-center gap-2">
									<Clock className="w-5 h-5" /> Pending Fulfillment ({pending.length})
								</Heading>
								
								{isLoading ? (
									<Box className="flex justify-center p-20">
										<Loader2 className="w-10 h-10 animate-spin text-[#58a076]" />
									</Box>
								) : pending.length === 0 ? (
									<Card variant="glass" className="p-12 text-center">
										<Text color="text-slate-500">No pending orders.</Text>
									</Card>
								) : (
									<Stack gap={6}>
										{pending.map(p => (
											<OrderCard 
												key={p.id} 
												preorder={p} 
												onComplete={() => markCompleted(p.id)} 
												onUpdateStatus={(s, t, n) => updateStatus(p.id, s, t, n)}
											/>
										))}
									</Stack>
								)}
							</Stack>

							{completed.length > 0 && (
								<Stack gap={6}>
									<Heading level={2} size="xl" color="text-slate-400" className="flex items-center gap-2">
										<CheckCircle className="w-5 h-5" /> Completed Orders ({completed.length})
									</Heading>
									<Box className="opacity-60">
										<Stack gap={6}>
											{completed.map(p => (
												<OrderCard 
													key={p.id} 
													preorder={p} 
													isCompleted 
													onUpdateStatus={(s, t, n) => updateStatus(p.id, s, t, n)}
												/>
											))}
										</Stack>
									</Box>
								</Stack>
							)}
						</Stack>
					</Box>
				</Stack>
			</Card>
		</Box>
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
		<Card className={`p-6 transition-all ${isCompleted ? 'border-white/5' : 'border-[#58a076]/20'}`}>
			<Stack gap={6}>
				<Flex justifyContent="between" alignItems="start" className="border-b border-white/5 pb-4" wrap="wrap" gap={4}>
					<Stack gap={1}>
						<Flex gap={3} alignItems="center">
							<Text weight="bold" color="text-white">Order #{preorder.id}</Text>
							{preorder.payment_slip_url && (
								<a href={`${API_HOST}${preorder.payment_slip_url}`} target="_blank">
									<Badge variant="success" className="flex items-center gap-1 cursor-pointer hover:bg-[#58a076]/30">
										<CreditCard className="w-3 h-3" /> Slip
									</Badge>
								</a>
							)}
							<Badge variant="default">{preorder.status}</Badge>
						</Flex>
						<Text size="xs" color="text-slate-500">{new Date(preorder.created_at).toLocaleString()}</Text>
					</Stack>
					<Box className="text-right">
						<Text size="xs" weight="bold" color="text-slate-500" uppercase tracking="widest">Total Price</Text>
						<Heading level={3} size="xl" weight="black" color="text-[#58a076]">฿{preorder.total_price?.toLocaleString()}</Heading>
					</Box>
				</Flex>

				<Grid cols={1} className="md:grid-cols-2 lg:grid-cols-4" gap={6}>
					{/* Customer Info */}
					<Stack gap={3}>
						<Text size="xs" weight="bold" color="text-slate-500" uppercase tracking="widest">Customer</Text>
						<Stack gap={2}>
							<Flex gap={2} alignItems="center">
								<User className="w-4 h-4 text-slate-500" />
								<Text size="sm" weight="medium" color="text-white">{preorder.customer_name}</Text>
							</Flex>
							<Flex gap={2} alignItems="center">
								<Phone className="w-4 h-4 text-slate-500" />
								<Text size="sm" color="text-white">{preorder.contact_number || "No contact"}</Text>
							</Flex>
							<Flex gap={2} alignItems="center">
								<ExternalLink className="w-4 h-4 text-slate-500" /> 
								<a href={preorder.social.startsWith('http') ? preorder.social : `https://social.com/${preorder.social}`} target="_blank">
									<Text size="sm" color="text-[#58a076]" className="hover:underline">{preorder.social}</Text>
								</a>
							</Flex>
						</Stack>
					</Stack>

					{/* Shipping & Items */}
					<Stack gap={3}>
						<Text size="xs" weight="bold" color="text-slate-500" uppercase tracking="widest">Shipping & Items</Text>
						<Text size="xs" color="text-slate-300">Method: <Text weight="bold" color="text-white">{preorder.shipping_method}</Text></Text>
						<Stack gap={1}>
							{preorder.items?.map((oi: OrderItem, idx: number) => (
								<Text key={idx} size="xs" color="text-white/60">
									• {oi.item?.title} ({oi.color}/{oi.size}) x{oi.quantity}
								</Text>
							))}
						</Stack>
					</Stack>

					{/* Update Form */}
					<Box className="lg:col-span-2 bg-white/5 p-4 rounded-2xl border border-white/5">
						<Stack gap={4}>
							<Flex justifyContent="between" alignItems="center">
								<Text size="xs" weight="bold" color="text-slate-500" uppercase tracking="widest">Manage Fulfillment</Text>
								<Button 
									variant="ghost" 
									size="sm" 
									className="text-[#58a076] h-auto p-0"
									onClick={() => setIsEditing(!isEditing)}
								>
									{isEditing ? "Cancel" : <><Edit className="w-3 h-3 mr-1" /> Edit</>}
								</Button>
							</Flex>

							{isEditing ? (
								<Stack gap={3}>
									<Grid cols={2} gap={3}>
										<select 
											title="Update preorder status"
											value={status} 
											onChange={(e) => setStatus(e.target.value)}
											className="bg-[#0a2735] border border-white/10 rounded-xl p-2 text-xs text-white focus:outline-none"
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
											className="bg-[#0a2735] border border-white/10 rounded-xl p-2 text-xs text-white focus:outline-none"
										/>
									</Grid>
									<textarea 
										placeholder="Admin Note to customer..." 
										value={note}
										onChange={(e) => setNote(e.target.value)}
										className="w-full bg-[#0a2735] border border-white/10 rounded-xl p-2 text-xs text-white focus:outline-none h-16"
									/>
									<Button onClick={handleSave} size="sm" className="w-full">
										<Save className="w-3 h-3 mr-1" /> Save Updates
									</Button>
								</Stack>
							) : (
								<Stack gap={2}>
									<Flex justifyContent="between">
										<Text size="xs" color="text-slate-500">Status:</Text>
										<Text size="xs" weight="bold" uppercase tracking="widest" color="text-white">{preorder.status}</Text>
									</Flex>
									<Flex justifyContent="between">
										<Text size="xs" color="text-slate-500">Tracking:</Text>
										<Text size="xs" weight="bold" color="text-[#58a076]">{preorder.tracking_no || "N/A"}</Text>
									</Flex>
									{preorder.note && (
										<Box className="mt-2 border-t border-white/5 pt-2">
											<Text size="xs" color="text-white/40" italic className="line-clamp-2">
												Note: {preorder.note}
											</Text>
										</Box>
									)}
								</Stack>
							)}
						</Stack>
					</Box>
				</Grid>

				{!isCompleted && onComplete && (
					<Box className="pt-4 border-t border-white/5 flex justify-end">
						<Button 
							variant="secondary" 
							size="sm" 
							onClick={onComplete}
							className="bg-[#58a076]/10 text-[#58a076] hover:bg-[#58a076]/20"
						>
							Mark Fulfillment Complete
						</Button>
					</Box>
				)}
			</Stack>
		</Card>
	);
}
