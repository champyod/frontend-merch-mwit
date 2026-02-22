"use client";

import Loader from "@/components/ui/Loader";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useLocale } from "next-intlayer";
import { navigateWithLocale } from "@/lib/navigation";

import { Box } from "@/components/ui/primitives";

import AppHeaderBar from "@/components/ui/AppHeaderBar";

const queryClient = new QueryClient();

const normalizeLocale = (value: unknown): "th" | "en" => {
	if (value === "en") return "en";
	if (value === "th") return "th";
	return "th";
};

export default function AdminRootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user, isLoading } = useAuth();
	const router = useRouter();
	const localeData = useLocale();
	const locale = normalizeLocale(
		typeof localeData === "string"
			? localeData
			: (localeData as { locale?: string } | undefined)?.locale
	);

	useEffect(() => {
		if (!isLoading && (!user || user.role !== "super-admin")) {
			navigateWithLocale(router, locale, "/", true);
		}
	}, [user, isLoading, router, locale]);

	if (isLoading || !user || user.role !== "super-admin") return <Loader />;

	return (
		<QueryClientProvider client={queryClient}>
			<AppHeaderBar />
			<Box className="min-h-screen bg-[#0a2735] px-4 md:px-10 pb-10 pt-32">
				<Toaster richColors closeButton />
				{children}
			</Box>
		</QueryClientProvider>
	);
}
