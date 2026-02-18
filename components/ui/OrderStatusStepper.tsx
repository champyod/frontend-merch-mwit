"use client";

import React from "react";
import { Check, Package, Truck, ShoppingBag, CreditCard, Home } from "lucide-react";

const steps = [
	{ id: "placed", label: "Placed", icon: ShoppingBag },
	{ id: "confirmed", label: "Confirmed", icon: CreditCard },
	{ id: "packed", label: "Packed", icon: Package },
	{ id: "shipped", label: "Shipped", icon: Truck },
	{ id: "delivered", label: "Delivered", icon: Home },
];

export default function OrderStatusStepper({ currentStatus }: { currentStatus: string }) {
	const currentStepIndex = steps.findIndex(step => step.id === currentStatus);

	return (
		<div className="w-full py-6">
			<div className="flex items-center justify-between relative">
				{/* Progress Line */}
				<div className="absolute top-1/2 left-0 w-full h-1 bg-white/5 -translate-y-1/2 z-0"></div>
				<div 
					className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-[#217c6b] to-[#58a076] -translate-y-1/2 z-0 transition-all duration-1000"
					style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
				></div>

				{steps.map((step, index) => {
					const isCompleted = index < currentStepIndex;
					const isCurrent = index === currentStepIndex;
					const Icon = step.icon;

					return (
						<div key={step.id} className="relative z-10 flex flex-col items-center">
							<div 
								className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
									isCompleted || isCurrent 
										? "bg-[#0a2735] border-[#58a076] text-[#58a076] shadow-[0_0_15px_rgba(88,160,118,0.3)]" 
										: "bg-[#0a2735] border-white/10 text-white/30"
								}`}
							>
								{isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
							</div>
							<span 
								className={`absolute top-full mt-3 text-[10px] font-bold uppercase tracking-wider transition-colors duration-500 whitespace-nowrap ${
									isCompleted || isCurrent ? "text-white" : "text-white/30"
								}`}
							>
								{step.label}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
