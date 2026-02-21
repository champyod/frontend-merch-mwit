import Image from "next/image";
import { Box, Stack, Text } from "./primitives";

export default function Loader() {
    return (
        <Box className="flex items-center justify-center min-h-[60vh] w-full">
            <Stack gap={6} alignItems="center">
                <div className="relative group">
                    <div
                        className="absolute inset-0 rounded-2xl bg-[#58a076]/10 blur-xl scale-150 animate-pulse [animation-duration:3s]"
                    />
                    <Image
                        priority
                        className="relative drop-shadow-2xl animate-pulse"
                        src={'/logo.png'}
                        width={80}
                        height={80}
                        alt="Loading..."
                    />
                </div>
                <Text size="lg" weight="bold" color="text-white/40" className="animate-pulse tracking-widest uppercase">
                    Loading
                </Text>
            </Stack>
        </Box>
    )
}
