"use client";

import AppHeaderBar from "@/components/ui/AppHeaderBar";
import Loader from "@/components/ui/Loader";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

export default function DahboardRootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && (!user || user.role !== "admin")) {
			router.push("/");
		}
	}, [user, isLoading, router]);

	if (isLoading || !user || user.role !== "admin") return <Loader />;

	return (
		<QueryClientProvider client={queryClient}>
			<AppHeaderBar />
			<div className="min-h-screen bg-secondary px-10 pb-10 pt-32">
				<Toaster richColors closeButton />
				{children}
			</div>
		</QueryClientProvider>
	);
}
