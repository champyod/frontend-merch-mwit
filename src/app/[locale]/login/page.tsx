"use client";

import useRedirect from "@/hooks/useRedirect";
import { Chrome } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import { useIntlayer } from "next-intlayer";
import { Box, Card, Heading, Text, Button, Container } from "@/components/ui/primitives";

export default function Login() {
	useRedirect({ redirectIfFound: true });
	const { login } = useAuth();
	const { title, subtitle, description, buttonText, secureNotice } = useIntlayer("login");

	return (
		<Box className="min-h-screen flex items-center justify-center p-6 bg-[#0a2735] relative overflow-hidden">
			{/* Decorative background elements */}
			<Box className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#217c6b]/20 rounded-full blur-[120px]" />
			<Box className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#58a076]/10 rounded-full blur-[120px]" />

			<motion.div 
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="w-full max-w-[450px] z-10"
			>
				<Card variant="glass" className="p-8 md:p-12 text-center">
					<Box className="mb-10 space-y-2">
						<Heading level={1} size="4xl" weight="black" color="text-white" className="tracking-tight">
							{title}
						</Heading>
						<Text size="sm" weight="medium" color="text-white/50">
							{subtitle}
						</Text>
					</Box>

					<Text size="sm" color="text-white/70" className="mb-8 block leading-relaxed">
						{description}
					</Text>

					<Button 
						variant="primary" 
						size="lg" 
						className="w-full gap-3 py-4"
						onClick={login}
					>
						<Chrome className="w-5 h-5" />
						{buttonText}
					</Button>
					
					<Text size="xs" weight="black" color="text-white/30" tracking="widest" uppercase className="mt-8 block">
						{secureNotice}
					</Text>
				</Card>
			</motion.div>
		</Box>
	);
}

