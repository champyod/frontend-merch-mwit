"use client";

import NavLink from "./NavLink";
import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "../Logo";
import { ShoppingCart, LogIn, Menu, X, ChevronRight, LayoutDashboard, Home, Shirt, ClipboardList, Shield } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Card, Button, Text, Container, Stack, Flex } from "./primitives";
import { useAuth } from "@/contexts/auth-context";
import UserMenu from "./UserMenu";
import Image from "next/image";
import { useIntlayer } from "next-intlayer";
import LocaleSwitcher from "./LocaleSwitcher";
import { usePages } from "@/hooks/useSite";
import { MenuItem } from "@/types/types";
import { useLocale } from "next-intlayer";
import { buildLocalePath, normalizeLocale } from "@/lib/navigation";

const MenuSidebar = ({
	toggleMenu,
	navLinks,
}: {
	toggleMenu: () => void;
	navLinks: MenuItem[];
}) => {
	const { user, isLoading, login } = useAuth();
	const t = useIntlayer("header");
	const localeData = useLocale();
	const locale = normalizeLocale(localeData);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 z-50 md:hidden"
		>
			<Box onClick={toggleMenu} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

			<Card 
				variant="solid" 
				className="absolute right-0 top-0 h-full w-[80%] max-w-75 flex flex-col p-6 rounded-none border-l border-white/10"
			>
				<Flex justifyContent="between" alignItems="center" className="mb-10">
					<Logo />
					<Button variant="ghost" size="sm" onClick={toggleMenu} className="p-2 min-w-0">
						<X className="w-6 h-6" />
					</Button>
				</Flex>

				<Stack gap={6} className="overflow-y-auto flex-1">
					<Link
						href={buildLocalePath(locale, "/")}
						className="text-2xl font-bold text-white/90 hover:text-[#58a076] transition-colors"
						onClick={toggleMenu}
					>
						{t.home.value}
					</Link>
					{navLinks && navLinks.map((item, index) => (
						<Link
							key={index}
							href={buildLocalePath(locale, `/${item.slug}`)}
							className="text-2xl font-bold text-white/90 hover:text-[#58a076] transition-colors"
							onClick={toggleMenu}
						>
							{item.text}
						</Link>
					))}
				</Stack>

				<Box className="pt-6 border-t border-white/10 mt-auto">
					{isLoading ? (
						<Box className="h-11 w-full rounded-xl bg-white/10 animate-pulse" />
					) : user ? (
						<Stack gap={4}>
							<Flex alignItems="center" gap={3} className="px-4 py-3 rounded-xl bg-white/5 border border-white/10">
								<Box className="relative w-10 h-10 rounded-full overflow-hidden border border-[#58a076]/30">
									<Image
										src={user.avatar_url}
										alt={user.name}
										fill
										className="object-cover"
									/>
								</Box>
								<Box className="flex-1 min-w-0">
									<Text size="sm" weight="bold" color="text-white" className="truncate block">{user.name}</Text>
									<Text size="xs" weight="bold" color="text-white/40" uppercase tracking="wide" className="truncate block">{user.role}</Text>
								</Box>
							</Flex>
							<Link href={buildLocalePath(locale, "/orders")} onClick={toggleMenu} className="w-full">
								<Button variant="secondary" size="lg" className="w-full gap-2 justify-start">
									<ShoppingCart className="w-5 h-5" />
									{t.myOrders.value}
								</Button>
							</Link>
							{user.role === "super-admin" && (
															<Link href={buildLocalePath(locale, "/admin")} onClick={toggleMenu} className="w-full">
																<Button variant="primary" size="lg" className="w-full gap-2 justify-start">
																	<LayoutDashboard className="w-5 h-5" />
																	{t.adminDashboard.value}
																</Button>
															</Link>							)}
						</Stack>
					) : (
						<Button 
							variant="primary" 
							size="lg" 
							className="w-full gap-2"
							onClick={() => {
								toggleMenu();
								login();
							}}
						>
							<LogIn className="w-5 h-5" />
							{t.login.value}
						</Button>
					)}
				</Box>
			</Card>
		</motion.div>
	);
};

export default function HeaderBar() {
	const [menuOpened, setMenuOpened] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const toggleMenu = () => setMenuOpened(!menuOpened);
	const { cart } = useCart();
	const { user, isLoading, login } = useAuth();
	const t = useIntlayer("header");
	const { data: navLinks = [] } = usePages();
	const localeData = useLocale();
	const locale = normalizeLocale(localeData);

	const cartCount = cart ? cart.reduce((total, item) => total + item.quantity, 0) : 0;
	const quickLinks = [
		{ href: "/", text: t.home.value, icon: Home },
		{ href: "/shop", text: "Shop", icon: Shirt },
		{ href: "/pre-orders", text: "Pre-orders", icon: ClipboardList },
	];

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<Box
			as="header"
			className={`fixed top-0 z-40 w-full transition-all duration-500 ${
				scrolled ? "py-2 bg-[#0a2735]/80 backdrop-blur-xl border-b border-white/5" : "py-4 bg-transparent"
			}`}
		>
			<Container as="nav" maxWidth="full" className="px-4 md:px-6 flex items-center justify-between relative">
				<Link href={buildLocalePath(locale, "/")} className="transition-transform duration-300 hover:scale-105 active:scale-95 z-10">
					<Logo />
				</Link>

				<Box className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
					<Flex as="ul" alignItems="center" gap={1}>
						{quickLinks.map((item, index) => {
							const Icon = item.icon;
							return (
								<Link
									key={`${item.href}-${index}`}
									href={buildLocalePath(locale, item.href)}
									className="px-3 py-2 rounded-xl transition-all duration-300 hover:bg-white/10 text-white/80 hover:text-white"
								>
									<Flex gap={2} alignItems="center">
										<Icon className="w-4 h-4" />
										<Text size="sm" weight="bold">{item.text}</Text>
									</Flex>
								</Link>
							);
						})}
						{user?.role === "super-admin" && <AdminDropdown />}
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
					</Flex>
				</Box>

				<Flex alignItems="center" gap={{ initial: 3, md: 4 }} className="z-10">
					<Link href={buildLocalePath(locale, "/cart")}>
						<Button variant="secondary" size="sm" className="relative p-2 rounded-full min-w-0">
							<ShoppingCart className="w-5 h-5" />
							{cartCount > 0 && (
								<Box className="absolute -top-1 -right-1 bg-coral text-white text-[10px] font-bold min-w-4.5 h-4.5 flex items-center justify-center px-1 rounded-full shadow-lg border-2 border-[#0a2735]">
									{cartCount}
								</Box>
							)}
						</Button>
					</Link>

					<LocaleSwitcher />

					<Box className="hidden md:block">
						{isLoading ? (
							<Box className="h-10 w-24 rounded-full bg-white/10 animate-pulse" />
						) : user ? (
							<UserMenu />
						) : (
							<Button variant="primary" size="md" className="gap-2" onClick={login}>
								<LogIn className="w-4 h-4" />
								{t.loginShort.value}
							</Button>
						)}
					</Box>

					<Button variant="secondary" size="sm" onClick={toggleMenu} className="md:hidden p-2 min-w-0 rounded-full">
						<Menu className="w-6 h-6" />
					</Button>
				</Flex>

				<AnimatePresence>
					{menuOpened && (
						<MenuSidebar toggleMenu={toggleMenu} navLinks={navLinks} />
					)}
				</AnimatePresence>
			</Container>
		</Box>
	);
}

function AdminDropdown() {
	const [isOpen, setIsOpen] = useState(false);
	const localeData = useLocale();
	const locale = normalizeLocale(localeData);

	const adminLinks = [
		          { href: "/admin", text: "Dashboard" },
		          { href: "/admin/products", text: "Products" },
		          { href: "/admin/preorders", text: "Preorders" },
		          { href: "/admin/pages", text: "Pages" },
		          { href: "/admin/settings", text: "Settings" },	];

	return (
		<Box className="relative ml-1" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
			<Button
				variant="ghost"
				size="md"
				className={`gap-2 ${isOpen ? "text-[#58a076]" : "text-white/80"}`}
			>
				<Shield className="w-4 h-4" />
				Admin
				<ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`} />
			</Button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: 10, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 10, scale: 0.95 }}
						transition={{ duration: 0.2 }}
						className="absolute top-full left-0 mt-2 min-w-52 z-50"
					>
						<Card variant="glass" className="p-2">
							{adminLinks.map((item) => (
								<Link
									key={item.href}
									href={buildLocalePath(locale, item.href)}
									className="block w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-white/80 hover:text-white hover:bg-white/10 transition-all"
								>
									{item.text}
								</Link>
							))}
						</Card>
					</motion.div>
				)}
			</AnimatePresence>
		</Box>
	);
}

function OthersDropdown({ navLinks }: { navLinks: MenuItem[] }) {
	const [isOpen, setIsOpen] = useState(false);
	const t = useIntlayer("header");
	const localeData = useLocale();
	const locale = normalizeLocale(localeData);

	if (navLinks.length === 0) return null;
	return (
		<Box className="relative group ml-2" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
			<Button 
				variant="ghost" 
				size="md" 
				className={`gap-1 ${isOpen ? "text-[#58a076]" : "text-white/70"}`}
			>
				{t.others.value}
				<ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`} />
			</Button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: 10, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 10, scale: 0.95 }}
						transition={{ duration: 0.2 }}
						className="absolute top-full left-0 mt-2 min-w-40 z-50"
					>
						<Card variant="glass" className="p-2">
							{navLinks.map((item, index) => (
								<Link
									key={index}
									href={buildLocalePath(locale, `/${item.slug}`)}
									className="block w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-white/80 hover:text-white hover:bg-white/10 transition-all"
								>
									{item.text}
								</Link>
							))}
						</Card>
					</motion.div>
				)}
			</AnimatePresence>
		</Box>
	);
}
