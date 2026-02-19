"use client";

import NavLink from "./NavLink";
import { useState } from "react";
import Link from "next/link";
import Logo from "../Logo";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Preorder } from "@/types/types";
import { useAuth } from "@/contexts/auth-context";
import UserMenu from "./UserMenu";
import { Box, Card, Button, Text, Stack } from "./primitives";
import { useIntlayer } from "next-intlayer";
import { X, Menu } from "lucide-react";
import { API_BASE_URL } from "@/lib/env";

type NavLinkType = {
	href: string;
	text: string;
};
const NAV_LINKS: NavLinkType[] = [
	{
		href: "/dashboard/pages",
		text: "Pages",
	},
	{
		href: "/dashboard/products",
		text: "Products",
	},
	{
		href: "/dashboard/preorders",
		text: "Preorders",
	},
	{
		href: "/dashboard/settings",
		text: "Settings",
	},
];

const MenuSidebar = ({
	toggleMenu,
}: {
	toggleMenu: () => void;
}) => {
	const { logout } = useAuth();
	return (
		<Box className="fixed inset-0 z-50 md:hidden">
			{/* Dark overlay */}
			<Box
				onClick={() => toggleMenu()}
				className="absolute inset-0 bg-black/60 backdrop-blur-sm"
			/>

			{/* Menu sidebar */}
			<Card
				variant="solid"
				className="absolute right-0 top-0 h-full w-[80%] max-w-[300px] flex flex-col p-6 rounded-none border-l border-white/10"
			>
				<Box className="flex justify-between items-center mb-10">
					<Logo />
					<Button
						variant="ghost"
						size="sm"
						className="p-2 min-w-0"
						onClick={() => toggleMenu()}
					>
						<X className="h-6 w-6" />
					</Button>
				</Box>

				<Stack gap={6} className="flex-1 overflow-y-auto">
					{NAV_LINKS.map((item, index) => (
						<Link
							key={index}
							href={item.href}
							className="text-2xl font-bold text-white/90 hover:text-[#58a076] transition-colors"
							onClick={() => toggleMenu()}
						>
							{item.text}
						</Link>
					))}
				</Stack>

				<Box className="pt-6 border-t border-white/10 mt-auto">
					<Button
						variant="danger"
						size="lg"
						className="w-full justify-start"
						onClick={() => logout()}
					>
						Logout
					</Button>
				</Box>
			</Card>
		</Box>
	);
};

export default function AppHeaderBar() {
	const [menuOpened, setMenuOpened] = useState<boolean>(false);
	const toggleMenu = () => setMenuOpened(!menuOpened);
	const { user } = useAuth();

	return (
		<header
			className={`fixed z-10 w-full bg-[#0a2735]/90 backdrop-blur-lg border-b border-white/5`}
		>
			<nav
				className={`container mx-auto px-4 md:px-6 flex h-16 items-center justify-between`}
			>
				<Link href="/dashboard" className="transition-transform hover:scale-105 active:scale-95">
					<Logo />
				</Link>

				<Box className="flex items-center gap-2">
					{NAV_LINKS.map((item, index) => (
						<Box
							key={index}
							className="hidden md:flex items-center relative mx-2"
						>
							<NavLink href={item.href} text={item.text} />
							{item.text === "Preorders" && <Alert />}
						</Box>
					))}
					
					<Box className="hidden md:block ml-4">
						<UserMenu />
					</Box>

					{!menuOpened && (
						<Button
							variant="secondary"
							size="sm"
							className="md:hidden p-2 min-w-0 rounded-full relative"
							onClick={toggleMenu}
						>
							<Menu className="h-6 w-6" />
							<Alert />
						</Button>
					)}
				</Box>

				{menuOpened && (
					<MenuSidebar toggleMenu={toggleMenu} />
				)}
			</nav>
		</header>
	);
}

interface GetPreordersResponse {
	payload?: Preorder[];
}
function Alert() {
	const { data } = useQuery<any, any, GetPreordersResponse, any>({
		queryKey: ["preorders"],
		queryFn: async () => {
			const res = await fetch(`${API_BASE_URL}/admin/preorders`);
			const data = await res.json();
			return data;
		},
	});

	if (
		!data ||
		!data.payload ||
		data.payload?.filter(({ completed }) => completed === 0).length === 0
	)
		return <></>;

	const count = data?.payload?.filter(({ completed }) => completed === 0).length;

	return (
		<Box
			className="flex items-center justify-center absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-black text-white border-2 border-[#0a2735]"
		>
			{count}
		</Box>
	);
}


