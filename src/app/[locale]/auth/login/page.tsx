"use client";

import { Chrome } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import { useIntlayer } from "next-intlayer";
import { Box, Card, Heading, Text, Button, Container } from "@/components/ui/primitives";
import Image from "next/image";

export default function Login() {
	const { login, isLoading: isAuthLoading } = useAuth();
	const { title, subtitle, description, buttonText } = useIntlayer("login");

	return (
		<Box className="min-h-screen flex items-center justify-center p-6 bg-[#0a2735] relative overflow-hidden">
			{/* Decorative background elements */}
			<Box className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-dark/20 rounded-full blur-[120px]" />
			<Box className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#58a076]/10 rounded-full blur-[120px]" />

			<Box className="w-full max-w-112.5 z-10">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="flex justify-center mb-8"
				>
					<div className="relative group/logo">
						<div className="relative w-24 h-24">
							<div
								className="absolute inset-0 rounded-2xl bg-white/5 blur-xl scale-150 animate-pulse [animation-duration:4s]"
							/>
							<Image
								src="/logo.png"
								alt="MWIT Logo"
								width={96}
								height={96}
								className="relative rounded-2xl shadow-lg w-24 h-24 object-cover"
								priority
							/>
						</div>
					</div>
				</motion.div>

				<Card variant="glass" className="p-8 md:p-12 text-center">
					<Box className="mb-10 space-y-2">
						<Heading level={1} size="4xl" weight="black" color="text-white" className="tracking-tight">
							{title.value}
						</Heading>
						<Text size="sm" weight="medium" color="text-white/50">
							{subtitle.value}
						</Text>
					</Box>

					<Text size="sm" color="text-white/70" className="mb-8 block leading-relaxed">
						{description.value}
					</Text>

					<Button 
						variant="primary" 
						size="lg" 
						className="w-full gap-3 py-4"
						onClick={login}
						isLoading={isAuthLoading}
						type="button"
					>
						<Chrome className="w-5 h-5" />
						{buttonText.value}
					</Button>
				</Card>
			</Box>
		</Box>
	);
}

