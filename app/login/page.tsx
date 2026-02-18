"use client";

import TextLoader from "@/components/ui/TextLoader";
import useRedirect from "@/hooks/useRedirect";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { LogIn, User, Lock, Chrome } from "lucide-react";
import { motion } from "framer-motion";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { LiquidCard } from "@/components/ui/LiquidCard";

interface IFormInputs {
	username: string;
	password: string;
}

type AuthResponse = {
	hasError: boolean;
	errorMessage: string;
};

export default function Login() {
	useRedirect({ redirectIfFound: true });

	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState("");

	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<IFormInputs>();

	const onSubmit: SubmitHandler<IFormInputs> = async (formData, event) => {
		try {
			event?.preventDefault();
			setIsLoading(true);
			setMessage("");

			const res = await fetch(`/api/auth/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const data: AuthResponse = await res.json();
			if (data.hasError) throw new Error(data.errorMessage);

			setIsLoading(false);
			router.push("/dashboard");
		} catch (error: any) {
			setIsLoading(false);
			setMessage(error.message);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-6 bg-[#0a2735] relative overflow-hidden">
			<div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#217c6b]/20 rounded-full blur-[120px]"></div>
			<div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#58a076]/10 rounded-full blur-[120px]"></div>

			<motion.div 
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="w-full max-w-[450px] z-10"
			>
				<LiquidCard variant="glass" className="p-8 md:p-12">
					<div className="text-center mb-10 space-y-2">
						<h1 className="text-4xl font-black text-white tracking-tight">Login</h1>
						<p className="text-white/50 font-medium text-sm">Welcome back to MWIT Merch</p>
					</div>

					<LiquidButton 
						variant="high-contrast" 
						className="w-full gap-3 mb-8"
					>
						<Chrome className="w-5 h-5" />
						Continue with Google
					</LiquidButton>

					<div className="relative flex items-center mb-8">
						<div className="flex-1 border-t border-white/10"></div>
						<span className="px-4 text-[10px] font-black text-white/30 uppercase tracking-widest">OR</span>
						<div className="flex-1 border-t border-white/10"></div>
					</div>

					<form
						className="space-y-6"
						onSubmit={handleSubmit(onSubmit)}
						onChange={() => setMessage("")}
					>
						<div className="space-y-2">
							<label className="text-xs font-black text-white/60 uppercase tracking-widest ml-1" htmlFor="username">
								Username
							</label>
							<div className="relative group">
								<User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-[#58a076] transition-colors" />
								<input
									placeholder="Enter your username"
									id="username"
									className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#58a076]/50 focus:border-transparent transition-all"
									{...register("username", { required: true })}
								/>
							</div>
							{errors.username && (
								<p className="text-[#ec848c] text-xs font-bold mt-1 ml-1">
									Username is required
								</p>
							)}
						</div>

						<div className="space-y-2">
							<label className="text-xs font-black text-white/60 uppercase tracking-widest ml-1" htmlFor="password">
								Password
							</label>
							<div className="relative group">
								<Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-[#58a076] transition-colors" />
								<input
									placeholder="Enter your password"
									id="password"
									className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#58a076]/50 focus:border-transparent transition-all"
									type="password"
									{...register("password", { required: true })}
								/>
							</div>
							{errors.password && (
								<p className="text-[#ec848c] text-xs font-bold mt-1 ml-1">
									Password is required
								</p>
							)}
						</div>

						{message && (
							<LiquidCard variant="solid" className="bg-[#ec848c]/10 border-[#ec848c]/20 p-4 rounded-xl">
								<p className="text-[#ec848c] text-sm font-bold text-center">
									{message}
								</p>
							</LiquidCard>
						)}

						<LiquidButton
							variant="primary"
							size="lg"
							className="w-full gap-2"
							type="submit"
							disabled={isLoading}
						>
							{!isLoading ? (
								<>
									<LogIn className="w-5 h-5" />
									Login
								</>
							) : (
								<TextLoader loadingText="Authenticating" />
							)}
						</LiquidButton>
					</form>
				</LiquidCard>
			</motion.div>
		</div>
	);
}
