"use client";

import { Box, Flex, Text, Spinner } from "./primitives";
import { cn } from "@/lib/utils";

interface LoadingOverlayProps {
	label?: string;
	className?: string;
	fullScreen?: boolean;
}

export default function LoadingOverlay({ label = "Loading...", className, fullScreen = false }: LoadingOverlayProps) {
	return (
		<Box
			className={cn(
				fullScreen ? "fixed inset-0" : "absolute inset-0",
				"z-50 bg-[#0a2735]/40 backdrop-blur-[1px] flex items-center justify-center",
				className
			)}
		>
			<Flex direction="col" alignItems="center" gap={3}>
				<Spinner size="lg" />
				<Text size="sm" weight="bold" color="text-white">
					{label}
				</Text>
			</Flex>
		</Box>
	);
}
