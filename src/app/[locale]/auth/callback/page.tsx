"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useLocale } from "next-intlayer";
import { navigateWithLocale } from "@/lib/navigation";
import Loader from "@/components/ui/Loader";

const normalizeLocale = (value: unknown): "th" | "en" => {
	if (value === "en") return "en";
	if (value === "th") return "th";
	return "th";
};

export default function AuthCallbackPage() {
	const { refreshUser, user, isLoading } = useAuth();
	const router = useRouter();
	const localeData = useLocale();
	const locale = normalizeLocale(
		typeof localeData === "string"
			? localeData
			: (localeData as { locale?: string } | undefined)?.locale
	);

	useEffect(() => {
		const init = async () => {
			await refreshUser();
		};
		init();
	}, [refreshUser]);

	useEffect(() => {
		if (!isLoading && user) {
			navigateWithLocale(router, locale, "/orders", true);
		} else if (!isLoading && !user) {
			navigateWithLocale(router, locale, "/", true);
		}
	}, [user, isLoading, router, locale]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-[#0a2735]">
			<div className="text-center">
				<Loader />
				<p className="mt-2 text-white/30 text-xs font-bold uppercase tracking-[0.2em] animate-pulse">Completing sign in</p>
			</div>
		</div>
	);
}
