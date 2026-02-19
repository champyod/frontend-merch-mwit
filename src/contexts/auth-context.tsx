"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/env";

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
	refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const refreshUser = async () => {
		try {
			const res = await fetch(`${API_BASE_URL}/auth/me`);
			if (res.ok) {
				const data = await res.json();
				setUser(data);
			} else {
				setUser(null);
			}
		} catch (error) {
			console.error("Failed to fetch user:", error);
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		refreshUser();
	}, []);

	const login = () => {
		window.location.href = `${API_BASE_URL}/auth/google`;
	};

	const logout = async () => {
		try {
			await fetch(`${API_BASE_URL}/auth/logout`, { method: "POST" });
			setUser(null);
			window.location.href = "/";
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
