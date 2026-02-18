"use client";

import NavLink from "./NavLink";
import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "../Logo";
import { ShoppingCart, LogIn, Menu, X, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { LiquidButton } from "./LiquidButton";
import { LiquidCard } from "./LiquidCard";

type NavLink = { slug: string; text: string };

const MenuSidebar = ({
	toggleMenu,
	navLinks,
}: {
	toggleMenu: () => void;
	navLinks: NavLink[];
}) => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 z-50 md:hidden"
		>
			<div onClick={toggleMenu} className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

			<LiquidCard 
				variant="solid" 
				className="absolute right-0 top-0 h-full w-[80%] max-w-[300px] flex flex-col p-6 rounded-none border-l border-white/10"
			>
				<div className="flex justify-between items-center mb-10">
					<Logo />
					<LiquidButton variant="ghost" size="sm" onClick={toggleMenu} className="p-2">
						<X className="w-6 h-6" />
					</LiquidButton>
				</div>

				<div className="flex flex-col gap-6 overflow-y-auto flex-1">
					<Link
						href="/"
						className="text-2xl font-bold text-white/90 hover:text-[#58a076] transition-colors"
						onClick={toggleMenu}
					>
						Home
					</Link>
					{navLinks && navLinks.map((item, index) => (
						<Link
							key={index}
							href={`/${item.slug}`}
							className="text-2xl font-bold text-white/90 hover:text-[#58a076] transition-colors"
							onClick={toggleMenu}
						>
							{item.text}
						</Link>
					))}
				</div>

				<div className="pt-6 border-t border-white/10 mt-auto">
					<Link href="/login" onClick={toggleMenu}>
						<LiquidButton variant="primary" size="lg" className="w-full gap-2">
							<LogIn className="w-5 h-5" />
							Login
						</LiquidButton>
					</Link>
				</div>
			</LiquidCard>
		</motion.div>
	);
};

export default function HeaderBar() {
	const [menuOpened, setMenuOpened] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const toggleMenu = () => setMenuOpened(!menuOpened);
	const { cart } = useCart();
	const cartCount = cart ? cart.reduce((total, item) => total + item.quantity, 0) : 0;

	const [navLinks, setNavLinks] = useState<NavLink[]>([]);

	useEffect(() => {
		fetch("/api/page")
			.then((res) => res.json())
			.then((res) => {
				if (res.hasError) throw new Error("Error fetching nav links");
				setNavLinks(res.payload || []);
			}).catch(() => setNavLinks([]));

		const handleScroll = () => {
			setScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			className={`fixed top-0 z-40 w-full transition-all duration-500 ${
				scrolled ? "py-2 bg-[#0a2735]/80 backdrop-blur-xl border-b border-white/5" : "py-4 bg-transparent"
			}`}
		>
			<nav className="container mx-auto px-4 md:px-6 flex items-center justify-between">
				<Link href="/" className="transition-transform duration-300 hover:scale-105 active:scale-95">
					<Logo />
				</Link>

				<div className="hidden md:flex items-center gap-1">
					<NavLink href="/" text="Home" />
					{navLinks && navLinks.slice(0, 5).map((item, index) => (
						<NavLink
							key={index}
							href={`/${item.slug}`}
							text={item.text}
						/>
					))}
					{navLinks && navLinks.length > 5 && (
						<OthersDropdown navLinks={navLinks.slice(5)} />
					)}
				</div>

				<div className="flex items-center gap-3 md:gap-4">
					<Link href="/cart">
						<LiquidButton variant="secondary" size="sm" className="relative p-2 rounded-full min-w-0">
							<ShoppingCart className="w-5 h-5" />
							{cartCount > 0 && (
								<span className="absolute -top-1 -right-1 bg-[#ec848c] text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center px-1 rounded-full shadow-lg border-2 border-[#0a2735]">
									{cartCount}
								</span>
							)}
						</LiquidButton>
					</Link>

					<Link href="/login" className="hidden md:block">
						<LiquidButton variant="primary" size="md" className="gap-2">
							<LogIn className="w-4 h-4" />
							Login
						</LiquidButton>
					</Link>

					<LiquidButton variant="secondary" size="sm" onClick={toggleMenu} className="md:hidden p-2 min-w-0 rounded-full">
						<Menu className="w-6 h-6" />
					</LiquidButton>
				</div>

				<AnimatePresence>
					{menuOpened && (
						<MenuSidebar toggleMenu={toggleMenu} navLinks={navLinks} />
					)}
				</AnimatePresence>
			</nav>
		</header>
	);
}

function OthersDropdown({ navLinks }: { navLinks: NavLink[] }) {
	const [isOpen, setIsOpen] = useState(false);

	if (navLinks.length === 0) return null;
	return (
		<div className="relative group ml-2" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
			<LiquidButton 
				variant="ghost" 
				size="md" 
				className={`gap-1 ${isOpen ? "text-[#58a076]" : "text-white/70"}`}
			>
				Others
				<ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`} />
			</LiquidButton>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: 10, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 10, scale: 0.95 }}
						transition={{ duration: 0.2 }}
						className="absolute top-full left-0 mt-2 min-w-[160px] z-50"
					>
						<LiquidCard variant="glass" className="p-2 rounded-2xl">
							{navLinks.map((item, index) => (
								<Link
									key={index}
									href={`/${item.slug}`}
									className="block w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-white/80 hover:text-white hover:bg-white/10 transition-all"
								>
									{item.text}
								</Link>
							))}
						</LiquidCard>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
