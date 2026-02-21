"use client";

import React from "react";
import { Package } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import Link from "next/link";
import { Card, Box, Stack, Text, Heading, Button } from "@/components/ui/primitives";

export const EmptyState = () => {
  const t = useIntlayer("orders-list");

  return (
    <Card variant="glass" className="p-12 text-center">
      <Stack gap={6} alignItems="center">
        <Box className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center">
          <Package className="w-8 h-8 text-white/20" />
        </Box>
        <Stack gap={2}>
          <Heading level={2} size="xl" color="text-white">
            {t.emptyTitle.value}
          </Heading>
          <Text color="text-white/40">
            {t.emptyDescription.value}
          </Text>
        </Stack>
        <Link href="/products" passHref>
          <Button variant="primary">
            {t.browseProducts.value}
          </Button>
        </Link>
      </Stack>
    </Card>
  );
};
