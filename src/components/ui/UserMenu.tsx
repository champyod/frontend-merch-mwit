"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useLocale } from "next-intlayer";
import { buildLocalePath, normalizeLocale } from "@/lib/navigation";
import { Box, Button } from "./primitives";

export default function UserMenu() {
	const { user, logout } = useAuth();
	const [isOpen, setIsOpen] = useState(false);
	const localeData = useLocale();
	const locale = normalizeLocale(localeData);

	if (!user) return null;

	return (
		<Box className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-2 p-1 pr-3 rounded-full bg-white/5 hover:bg-white/10 transition-all border border-white/10 group"
			>
				<Box className="relative w-8 h-8 rounded-full overflow-hidden border border-[#58a076]/30">
					<Image
						src={user.avatar_url}
						alt={user.name}
						fill
						className="object-cover"
					/>
				</Box>
				<span className="hidden sm:inline text-sm font-bold text-white/90 group-hover:text-white transition-colors">
					{user.name.split(" ")[0]}
				</span>
				<ChevronDown className={`w-4 h-4 text-white/50 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
			</button>

			<AnimatePresence>
				{isOpen && (
					<>
							<Box 
							className="fixed inset-0 z-40" 
							onClick={() => setIsOpen(false)}
							/>
						<motion.div
							initial={{ opacity: 0, y: 10, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 10, scale: 0.95 }}
							transition={{ duration: 0.2 }}
							className="absolute right-0 mt-2 w-56 z-50 bg-[#0a2735]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl"
						>
								<Box className="px-4 py-3 border-b border-white/5 mb-1">
								<p className="text-xs font-bold text-[#58a076] uppercase tracking-wider mb-0.5">Signed in as</p>
								<p className="text-sm font-bold text-white truncate">{user.email}</p>
								</Box>

							<Link
								href={buildLocalePath(locale, "/orders")}
								onClick={() => setIsOpen(false)}
								className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-white/70 hover:text-white hover:bg-white/5 transition-all"
							>
								<ShoppingBag className="w-4 h-4 text-[#58a076]" />
								My Orders
							</Link>

							{user.role === "super-admin" && (
								<Link
									href={buildLocalePath(locale, "/admin")}
									onClick={() => setIsOpen(false)}
									className="block w-full"
								>
									<Button variant="secondary" size="md" className="w-full justify-start text-white">
										<LayoutDashboard className="w-4 h-4 text-[#58a076]" />
										/admin
									</Button>
								</Link>
							)}

								<Button
								onClick={() => {
									setIsOpen(false);
									logout();
								}}
									variant="ghost"
									size="md"
									className="w-full justify-start text-coral hover:bg-coral/10 mt-1"
							>
								<LogOut className="w-4 h-4" />
								Sign Out
								</Button>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</Box>
	);
}
