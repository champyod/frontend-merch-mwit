import Logo from "@/components/Logo";
import { Box, Stack, Text } from "./primitives";

export default function Loader() {
    return (
        <Box className="flex items-center justify-center min-h-[60vh] w-full">
            <Stack gap={6} alignItems="center">
                <div className="relative group">
                    <div
                        className="absolute inset-0 rounded-2xl bg-[#58a076]/10 blur-xl scale-150 animate-pulse [animation-duration:3s]"
                    />
                    <div className="relative drop-shadow-2xl animate-pulse scale-200">
                        <Logo variant="icon" tone="light" />
                    </div>
                </div>
                <Text size="lg" weight="bold" color="text-white/40" className="animate-pulse tracking-widest uppercase">
                    Loading
                </Text>
            </Stack>
        </Box>
    )
}
