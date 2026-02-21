"use client";

import { useRouter, usePathname } from "next/navigation";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/env";
import { useLocale } from "next-intlayer";
import { buildLocalePath, navigateWithLocale, normalizeLocale } from "@/lib/navigation";

interface User {
	uuid: string;
	name: string;
	email: string;
	avatar_url: string;
	role: string;
}

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	login: () => void;
	logout: () => void;
	refreshUser: (options?: { silent?: boolean }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();
	const pathname = usePathname();
	const localeData = useLocale();
	const locale = normalizeLocale(localeData);

	const refreshUser = useCallback(async (options?: { silent?: boolean }) => {
		if (!options?.silent) {
			setIsLoading(true);
		}

		try {
			const res = await fetch(`${API_BASE_URL}/auth/me`, {
				credentials: "include",
				cache: "no-store",
				signal: AbortSignal.timeout(5000),
			});
			if (res.ok) {
				const data = await res.json();
				setUser(data);
			} else {
				setUser(null);
			}
		} catch (error) {
			console.error("Auth initialization failed:", error);
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		refreshUser();
	}, [refreshUser]);

	// Single source of truth for all redirects based on auth state (MWIT-LINK Style)
	useEffect(() => {
		if (isLoading || !pathname) return;

		const isAuthPage = pathname.includes("/auth/");
		const isLoginPage = pathname.includes("/auth/login");
		
		// Whitelist public paths
		const publicPaths = [
			"/auth/",
			"/shop/",
			"/cart",
			"/pre-orders",
			"/privacy-policy",
			"/refund-policy",
			"/shipping-policy",
			"/sales",
		];

		const isPublic =
			pathname === `/${locale}` ||
			pathname === `/${locale}/` ||
			publicPaths.some((p) => pathname.includes(p));

		// Case 1: No session at all -> redirect to login if not public
		if (!user && !isPublic) {
			navigateWithLocale(router, locale, "/auth/login", true);
			return;
		}

		// Case 2: Logged in user on login page -> redirect to dashboard/admin
		if (user && isLoginPage) {
			if (user.role === "admin") {
				navigateWithLocale(router, locale, "/admin", true);
			} else {
				navigateWithLocale(router, locale, "/", true);
			}
			return;
		}
	}, [user, isLoading, pathname, router, locale]);

	const login = () => {
		window.location.href = `${API_BASE_URL}/auth/google?locale=${locale}`;
	};

	const logout = async () => {
		try {
			await fetch(`${API_BASE_URL}/auth/logout`, { method: "POST" });
			setUser(null);
			window.location.href = buildLocalePath(locale, "/");
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	return (
		<AuthContext.Provider value={{ user, isLoading, login, logout, refreshUser }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
