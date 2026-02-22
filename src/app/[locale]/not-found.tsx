import { Box, Card, Stack, Heading, Text, LinkButton } from "@/components/ui/primitives";

export default async function NotFound({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'th';
  
  return (
    <Box className="min-h-[70vh] flex items-center justify-center">
      <Card className="p-8 max-w-md w-full text-center">
        <Stack gap={6} alignItems="center">
          <Heading level={1} size="4xl" weight="black" color="text-[#58a076]">
            404
          </Heading>
          <Text size="lg" color="text-white/70">
            ขออภัย ไม่พบหน้าที่คุณต้องการ
          </Text>
          <LinkButton href={`/${locale}`} variant="primary" size="lg">
            กลับสู่หน้าหลัก
          </LinkButton>
        </Stack>
      </Card>
    </Box>
  );
}
