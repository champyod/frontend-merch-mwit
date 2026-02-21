"use client";

import { BRAND_SOCIALS } from "@/config";
import Link from "next/link";
import Logo from "../Logo";
import { useIntlayer, useLocale } from "next-intlayer";
import { Box, Container, Grid, Stack, Flex, Text, Heading } from "@/components/ui/primitives";
import { Facebook, Instagram } from "lucide-react";
import { buildLocalePath, normalizeLocale } from "@/lib/navigation";

export default function Footer({ siteName }: { siteName: string }) {
  const t = useIntlayer("footer");
  const localeData = useLocale();
  const locale = normalizeLocale(localeData);

  return (
    <Box as="footer" className="bg-[#0a2735] border-t border-white/5 pt-20 pb-10 px-6">
      <Container maxWidth="7xl">
        <Grid cols={1} className="md:grid-cols-4 gap-12 mb-16">
          <Stack className="md:col-span-2" gap={6}>
            <Logo />
            <Text size="sm" weight="medium" color="text-white/50" className="max-w-sm leading-relaxed">
              {t.description.value}
            </Text>
            <Flex gap={4}>
              <a
                href={BRAND_SOCIALS.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                title="Facebook"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-[#58a076] hover:text-white transition-all"
              >
                <Facebook size={20} />
              </a>
              <a
                href={BRAND_SOCIALS.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                title="Instagram"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-[#58a076] hover:text-white transition-all"
              >
                <Instagram size={20} />
              </a>
            </Flex>
          </Stack>

          <Stack gap={6}>
            <Heading level={3} weight="black" uppercase tracking="widest" className="text-white text-[10px]">
              {t.navigation.title.value}
            </Heading>
            <Stack as="ul" gap={4}>
              <Box as="li">
                <Link href={buildLocalePath(locale, "/")} className="text-white/50 hover:text-[#58a076] transition-colors text-sm font-bold">
                  {t.navigation.home.value}
                </Link>
              </Box>
              <Box as="li">
                <Link href={buildLocalePath(locale, "/pre-orders")} className="text-white/50 hover:text-[#58a076] transition-colors text-sm font-bold">
                  {t.navigation.preorders.value}
                </Link>
              </Box>
              <Box as="li">
                <Link href={buildLocalePath(locale, "/cart")} className="text-white/50 hover:text-[#58a076] transition-colors text-sm font-bold">
                  {t.navigation.cart.value}
                </Link>
              </Box>
            </Stack>
          </Stack>

          <Stack gap={6}>
            <Heading level={3} weight="black" uppercase tracking="widest" className="text-white text-[10px]">
              {t.support.title.value}
            </Heading>
            <Stack as="ul" gap={4}>
              <Box as="li">
                <Link href={buildLocalePath(locale, "/privacy-policy")} className="text-white/50 hover:text-[#58a076] transition-colors text-sm font-bold">
                  {t.support.privacy.value}
                </Link>
              </Box>
              <Box as="li">
                <Link href={buildLocalePath(locale, "/refund-policy")} className="text-white/50 hover:text-[#58a076] transition-colors text-sm font-bold">
                  {t.support.refund.value}
                </Link>
              </Box>
              <Box as="li">
                <Link href={buildLocalePath(locale, "/shipping-policy")} className="text-white/50 hover:text-[#58a076] transition-colors text-sm font-bold">
                  {t.support.shipping.value}
                </Link>
              </Box>
            </Stack>
          </Stack>
        </Grid>

        <Box className="pt-10 border-t border-white/5">
          <Flex direction="col" className="md:flex-row justify-between items-center gap-4">
            <Text size="xs" weight="bold" uppercase tracking="tight" color="text-white/30">
              © {new Date().getFullYear()} {siteName}. {t.rights.value}
            </Text>
            <Text size="xs" weight="black" uppercase tracking="widest" color="text-white/20" className="text-[10px]">
              {t.designedBy.value}
            </Text>
          </Flex>
        </Box>
      </Container>
    </Box>
  );
}
