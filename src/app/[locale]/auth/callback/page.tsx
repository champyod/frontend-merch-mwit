"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import Loader from "@/components/ui/Loader";

export default function AuthCallbackPage() {
	const { refreshUser, user, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		const init = async () => {
			await refreshUser();
		};
		init();
	}, [refreshUser]);

	useEffect(() => {
		if (!isLoading && user) {
			router.push("/orders");
		} else if (!isLoading && !user) {
			router.push("/");
		}
	}, [user, isLoading, router]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-[#0a2735]">
			<div className="text-center">
				<Loader />
				<p className="mt-4 text-white/70 font-bold animate-pulse">Completing sign in...</p>
			</div>
		</div>
	);
}
