"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import Loader from "@/components/ui/Loader";
import { Preorder } from "@/types/types";
import OrderStatusStepper from "@/components/ui/OrderStatusStepper";
import { ChevronLeft, Package, MapPin, Phone, CreditCard, Mail, ExternalLink, Calendar, Clock, Receipt, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useIntlayer } from "next-intlayer";
import { Flex, Stack, Text, Heading, Container, Box, Card, Button } from "@/components/ui/primitives";
import { useMyOrder } from "@/hooks/useOrders";

export default function OrderDetailPage() {
	const { user, isLoading: isAuthLoading } = useAuth();
	const params = useParams();
	const orderId = params.orderId as string;
	
	const { data: order, isLoading: isFetching } = useMyOrder(orderId, !!user);

	const {
		backToOrders,
		orderNumber,
		viewInvoice,
		trackProgress,
		trackingNumber,
		trackShipment,
		orderSummary,
		subtotal,
		shippingCost,
		total,
		adminNote,
		customer,
		shipping,
		method,
		address,
		nameLabel,
		socialLabel,
		contactLabel,
		noAddress,
		orderNotFound
	} = useIntlayer("order-detail");

	if (isAuthLoading || (isFetching && user)) return <Loader />;
	
	if (!order) {
		return (
			<Flex className="min-h-screen bg-[#0a2735]" justifyContent="center" alignItems="center">
				<Text weight="bold" color="text-white">{orderNotFound.value}</Text>
			</Flex>
		);
	}

	const getStatusColor = (status: string) => {
		switch (status) {
			case "placed": return "bg-blue-500/20 text-blue-500";
			case "confirmed": return "bg-yellow-500/20 text-yellow-500";
			case "packed": return "bg-purple-500/20 text-purple-500";
			case "shipped": return "bg-orange-500/20 text-orange-500";
			case "delivered": return "bg-green-500/20 text-green-500";
			default: return "bg-white/10 text-white/40";
		}
	};

	return (
		<Box className="min-h-screen bg-[#0a2735] pt-32 pb-20 px-4">
			<Container maxWidth="4xl">
				<Link 
					href="/orders" 
					className="inline-flex items-center gap-2 text-white/40 hover:text-white font-bold transition-colors mb-8"
				>
					<ChevronLeft className="w-5 h-5" />
					{backToOrders.value}
				</Link>

				<Flex className="flex-col md:flex-row mb-10" justifyContent="between" alignItems="end" gap={6}>
					<Stack gap={2}>
						<Flex gap={3}>
							<Heading level={1} size="4xl" className="text-white">
								{orderNumber.value}{order.id}
							</Heading>
							<Box className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
								{order.status}
							</Box>
						</Flex>
						<Flex gap={4} className="text-white/40 text-sm font-bold">
							<Flex gap={1.5}><Calendar className="w-4 h-4" />{new Date(order.created_at).toLocaleDateString()}</Flex>
							<Flex gap={1.5}><Clock className="w-4 h-4" />{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Flex>
						</Flex>
					</Stack>
					<Flex gap={3}>
						<Box className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm font-bold hover:bg-white/10 transition-all cursor-pointer">
							<Receipt className="w-4 h-4" />
							{viewInvoice.value}
						</Box>
					</Flex>
				</Flex>

				{/* Status Stepper Card */}
				<Card className="p-8 md:p-12 mb-8 shadow-2xl">
					<Heading level={2} size="lg" className="text-white mb-12 text-center">
						{trackProgress.value}
					</Heading>
					<OrderStatusStepper currentStatus={order.status} />
					
					{order.tracking_no && (
						<Box className="mt-16 pt-8 border-t border-white/5">
							<Flex className="flex-col md:flex-row" justifyContent="between" alignItems="center" gap={6}>
								<Stack gap={1}>
									<Text size="xs" weight="bold" color="text-white/40" uppercase tracking="widest" className="text-center md:text-left">
										{trackingNumber.value}
									</Text>
									<Text size="2xl" weight="black" color="text-[#58a076]" className="text-center md:text-left">
										{order.tracking_no}
									</Text>
								</Stack>
								<Link 
									href="#"
									className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#58a076]/10 text-[#58a076] font-bold border border-[#58a076]/20 hover:bg-[#58a076]/20 transition-all group"
								>
									{trackShipment.value}
									<ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
								</Link>
							</Flex>
						</Box>
					)}
				</Card>

				<Box className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{/* Order Items */}
					<Box className="md:col-span-2 space-y-6">
						<Card className="p-8 shadow-xl">
							<Heading level={3} size="lg" className="text-white mb-6 flex items-center gap-3">
								<Package className="w-5 h-5 text-[#58a076]" />
								{orderSummary.value}
							</Heading>
							<Stack gap={6}>
								{order.items.map((item, idx) => (
									<Flex key={idx} gap={4} className="pb-6 border-b border-white/5 last:border-0 last:pb-0">
										<Box className="relative w-20 h-20 rounded-2xl bg-white/5 overflow-hidden border border-white/5 flex-shrink-0">
											{item.item.images && item.item.images.length > 0 ? (
												<Image src={item.item.images[0].url} alt={item.item.title} fill className="object-cover" />
											) : (
												<Flex className="w-full h-full text-white/10 font-black" justifyContent="center" alignItems="center">?</Flex>
											)}
										</Box>
										<Stack gap={1} className="flex-1 min-w-0">
											<Text weight="bold" color="text-white" className="truncate block">
												{item.item.title}
											</Text>
											<Flex gap={2} className="mb-2">
												<Box className="px-2 py-0.5 rounded-lg bg-white/5 text-[10px] font-black text-white/40 uppercase tracking-widest">{item.size}</Box>
												<Box className="px-2 py-0.5 rounded-lg bg-white/5 text-[10px] font-black text-white/40 uppercase tracking-widest">{item.color}</Box>
											</Flex>
											<Flex justifyContent="between">
												<Text size="xs" weight="bold" color="text-white/40">
													Qty: <Text color="text-white">{item.quantity}</Text>
												</Text>
												<Text weight="black" color="text-[#58a076]">฿{item.price.toLocaleString()}</Text>
											</Flex>
										</Stack>
									</Flex>
								))}
							</Stack>

							<Box className="mt-8 pt-8 border-t border-white/5 space-y-4">
								<Flex justifyContent="between">
									<Text size="sm" weight="bold" color="text-white/40">{subtotal.value}</Text>
									<Text size="sm" color="text-white">฿{(order.total_price - order.shipping_cost).toLocaleString()}</Text>
								</Flex>
								<Flex justifyContent="between">
									<Text size="sm" weight="bold" color="text-white/40">{shippingCost.value}</Text>
									<Text size="sm" color="text-white">฿{order.shipping_cost.toLocaleString()}</Text>
								</Flex>
								<Flex justifyContent="between" alignItems="end" className="pt-2">
									<Text size="lg" weight="bold" color="text-white">{total.value}</Text>
									<Heading level={4} size="3xl" weight="black" color="text-[#58a076]">฿{order.total_price.toLocaleString()}</Heading>
								</Flex>
							</Box>
						</Card>

						{order.note && (
							<Box className="bg-[#58a076]/5 border border-[#58a076]/20 rounded-3xl p-6">
								<Text size="xs" weight="black" color="text-[#58a076]" uppercase tracking="widest" className="block mb-3">
									{adminNote.value}
								</Text>
								<Text size="sm" color="text-white/80" className="leading-relaxed italic">
									"{order.note}"
								</Text>
							</Box>
						)}
					</Box>

					{/* Customer & Shipping Info */}
					<Stack gap={6}>
						<Card className="p-8 shadow-xl">
							<Heading level={3} size="lg" className="text-white mb-6 flex items-center gap-3">
								<User className="w-5 h-5 text-[#58a076]" />
								{customer.value}
							</Heading>
							<Stack gap={4}>
								<Stack gap={1}>
									<Text size="xs" weight="bold" color="text-white/20" uppercase tracking="widest">{nameLabel.value}</Text>
									<Text size="sm" weight="bold" color="text-white">{order.customer_name}</Text>
								</Stack>
								<Stack gap={1}>
									<Text size="xs" weight="bold" color="text-white/20" uppercase tracking="widest">{socialLabel.value}</Text>
									<Text size="sm" weight="bold" color="text-white">{order.social}</Text>
								</Stack>
								<Stack gap={1}>
									<Text size="xs" weight="bold" color="text-white/20" uppercase tracking="widest">{contactLabel.value}</Text>
									<Flex gap={2}>
										<Phone className="w-3.5 h-3.5 text-[#58a076]" />
										<Text size="sm" weight="bold" color="text-white">{order.contact_number}</Text>
									</Flex>
								</Stack>
							</Stack>
						</Card>

						<Card className="p-8 shadow-xl">
							<Heading level={3} size="lg" className="text-white mb-6 flex items-center gap-3">
								<MapPin className="w-5 h-5 text-[#58a076]" />
								{shipping.value}
							</Heading>
							<Stack gap={4}>
								<Stack gap={1}>
									<Text size="xs" weight="bold" color="text-white/20" uppercase tracking="widest">{method.value}</Text>
									<Box className="w-fit px-2.5 py-1 rounded-lg bg-white/5 text-[10px] font-black text-[#58a076] uppercase tracking-widest">
										{order.shipping_method}
									</Box>
								</Stack>
								<Stack gap={1}>
									<Text size="xs" weight="bold" color="text-white/20" uppercase tracking="widest">{address.value}</Text>
									<Text size="sm" weight="bold" color="text-white/70" className="leading-relaxed">
										{order.address || noAddress.value}
									</Text>
								</Stack>
							</Stack>
						</Card>
					</Stack>
				</Box>
			</Container>
		</Box>
	);
}