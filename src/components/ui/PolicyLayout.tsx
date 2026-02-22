import { Box, Container, Stack, Heading } from "@/components/ui/primitives";

interface PolicyLayoutProps {
	title: string;
	children: React.ReactNode;
}

export default function PolicyLayout({ title, children }: PolicyLayoutProps) {
	return (
		<Box className="bg-background">
			<Container maxWidth="4xl" className="pt-[15vh] pb-20">
				<Stack gap={6}>
					<Heading level={1} size="4xl" weight="black" className="pb-4">
						{title}
					</Heading>
					<Box className="space-y-6 text-white/80 leading-relaxed">
						{children}
					</Box>
				</Stack>
			</Container>
		</Box>
	);
}
