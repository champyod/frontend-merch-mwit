"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import Image from "next/image";

export default function UserMenu() {
	const { user, logout } = useAuth();
	const [isOpen, setIsOpen] = useState(false);

	if (!user) return null;

	return (
		<div className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-2 p-1 pr-3 rounded-full bg-white/5 hover:bg-white/10 transition-all border border-white/10 group"
			>
				<div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#58a076]/30">
					<Image
						src={user.avatar_url}
						alt={user.name}
						fill
						className="object-cover"
					/>
				</div>
				<span className="hidden sm:inline text-sm font-bold text-white/90 group-hover:text-white transition-colors">
					{user.name.split(" ")[0]}
				</span>
				<ChevronDown className={`w-4 h-4 text-white/50 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
			</button>

			<AnimatePresence>
				{isOpen && (
					<>
						<div 
							className="fixed inset-0 z-40" 
							onClick={() => setIsOpen(false)}
						></div>
						<motion.div
							initial={{ opacity: 0, y: 10, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 10, scale: 0.95 }}
							transition={{ duration: 0.2 }}
							className="absolute right-0 mt-2 w-56 z-50 bg-[#0a2735]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl"
						>
							<div className="px-4 py-3 border-b border-white/5 mb-1">
								<p className="text-xs font-bold text-[#58a076] uppercase tracking-wider mb-0.5">Signed in as</p>
								<p className="text-sm font-bold text-white truncate">{user.email}</p>
							</div>

							<Link
								href="/orders"
								onClick={() => setIsOpen(false)}
								className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-white/70 hover:text-white hover:bg-white/5 transition-all"
							>
								<ShoppingBag className="w-4 h-4 text-[#58a076]" />
								My Orders
							</Link>

							{user.role === "admin" && (
								<Link
									href="/dashboard"
									onClick={() => setIsOpen(false)}
									className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-white/70 hover:text-white hover:bg-white/5 transition-all"
								>
									<LayoutDashboard className="w-4 h-4 text-[#58a076]" />
									Admin Dashboard
								</Link>
							)}

							<button
								onClick={() => {
									setIsOpen(false);
									logout();
								}}
								className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-[#ec848c] hover:bg-[#ec848c]/10 transition-all mt-1"
							>
								<LogOut className="w-4 h-4" />
								Sign Out
							</button>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
}
