"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";

type UseAuthProps = {
	redirectIfFound?: boolean;
};

/**
 * Hook to handle redirection based on authentication state.
 * If not authenticated, redirects to login (unless redirectIfFound is true).
 * If authenticated and redirectIfFound is true, redirects to dashboard.
 */
export default function useRedirect({
	redirectIfFound = false,
}: UseAuthProps = {}) {
	const router = useRouter();
	const { user, isLoading } = useAuth();

	useEffect(() => {
		if (isLoading) return;

		if (!user) {
			if (!redirectIfFound) {
				router.push("/login");
			}
			return;
		}

		// If user is found and we should redirect if found (e.g., on login page)
		if (redirectIfFound) {
			router.push("/dashboard");
		}
	}, [user, isLoading, redirectIfFound, router]);

	return { user, isLoading };
}
