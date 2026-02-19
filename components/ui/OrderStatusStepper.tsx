"use client";

import React from "react";
import { Check, Package, Truck, ShoppingBag, CreditCard, Home } from "lucide-react";
import { Box, Flex, Text } from "./primitives";
import { useIntlayer } from "next-intlayer";

export default function OrderStatusStepper({ currentStatus }: { currentStatus: string }) {
	const { statusPlaced, statusConfirmed, statusPacked, statusShipped, statusDelivered } = useIntlayer("order-detail");

	const steps = [
		{ id: "placed", label: statusPlaced.value, icon: ShoppingBag },
		{ id: "confirmed", label: statusConfirmed.value, icon: CreditCard },
		{ id: "packed", label: statusPacked.value, icon: Package },
		{ id: "shipped", label: statusShipped.value, icon: Truck },
		{ id: "delivered", label: statusDelivered.value, icon: Home },
	];

	const currentStepIndex = steps.findIndex(step => step.id === currentStatus);

	return (
		<Box className="w-full py-6">
			<Box className="flex items-center justify-between relative">
				{/* Progress Line */}
				<Box className="absolute top-1/2 left-0 w-full h-1 bg-white/5 -translate-y-1/2 z-0" />
				<Box 
					className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-[#217c6b] to-[#58a076] -translate-y-1/2 z-0 transition-all duration-1000"
					style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
				/>

				{steps.map((step, index) => {
					const isCompleted = index < currentStepIndex;
					const isCurrent = index === currentStepIndex;
					const Icon = step.icon;

					return (
						<Box key={step.id} className="relative z-10 flex flex-col items-center">
							<Box 
								className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
									isCompleted || isCurrent 
										? "bg-[#0a2735] border-[#58a076] text-[#58a076] shadow-[0_0_15px_rgba(88,160,118,0.3)]" 
										: "bg-[#0a2735] border-white/10 text-white/30"
								}`}
							>
								{isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
							</Box>
							<Text 
								size="xs"
								weight="bold"
								uppercase
								tracking="wide"
								className={`absolute top-full mt-3 transition-colors duration-500 whitespace-nowrap ${
									isCompleted || isCurrent ? "text-white" : "text-white/30"
								}`}
							>
								{step.label}
							</Text>
						</Box>
					);
				})}
			</Box>
		</Box>
	);
}
