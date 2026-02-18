"use client";

import React from "react";
import { LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function GoogleSignInButton({ className = "" }: { className?: string }) {
	const { login } = useAuth();

	return (
		<button
			onClick={login}
			className={`flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-[#217c6b] to-[#58a076] hover:shadow-[0_0_20px_rgba(88,160,118,0.4)] transition-all text-sm font-bold text-white hover:scale-[1.02] active:scale-[0.98] ${className}`}
		>
			<LogIn className="w-4 h-4" />
			Sign in with Google
		</button>
	);
}
