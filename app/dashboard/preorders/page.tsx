"use client";

import { toast } from "sonner";
import { Download, CheckCircle, Package, User, Clock, ExternalLink, Loader2, MapPin, Phone, CreditCard, ShoppingBag, Truck, Edit, Save } from "lucide-react";
import { Box, Card, Heading, Text, Button, Stack, Flex, Grid, Badge, Container } from "@/components/ui/primitives";
import { Preorder, OrderItem } from "@/types/types";
import { useState } from "react";
import { useAdminPreorders, useUpdateOrderStatus, useCompletePreorder } from "@/hooks/useAdmin";

export default function PreordersPage() {
	const { data: preorders = [], isLoading } = useAdminPreorders();
	const updateStatusMutation = useUpdateOrderStatus();
	const completeMutation = useCompletePreorder();

	const handleExport = () => {
		const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/preorders/export`;
		window.open(url, "_blank");
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

	const pending = preorders.filter(p => p.completed === 0);
	const completed = preorders.filter(p => p.completed === 1);

	return (
		<Box className="pb-20">
			<Flex direction="col" className="md:flex-row justify-between items-start md:items-end gap-4 mb-10">
				<Stack gap={2}>
					<Heading level={1} size="3xl" color="text-white">Preorders Dashboard</Heading>
					<Text color="text-slate-400">Track and manage all customer orders.</Text>
				</Stack>
				<Button variant="outline" onClick={handleExport} className="gap-2">
					<Download className="w-4 h-4" /> Export CSV Report
				</Button>
			</Flex>

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
								<a href={`${process.env.NEXT_PUBLIC_API_BASE_URL}${preorder.payment_slip_url}`} target="_blank">
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
