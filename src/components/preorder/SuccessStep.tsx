"use client";

import React from "react";
import { CheckCircle2, ChevronRight, LogIn } from "lucide-react";
import { useIntlayer, useLocale } from "next-intlayer";
import { motion } from "framer-motion";
import { Stack, Flex, Heading, Text, Button, Card } from "@/components/ui/primitives";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { navigateWithLocale } from "@/lib/navigation";

interface SuccessStepProps {
  preorderId: number;
}

const normalizeLocale = (value: unknown): "th" | "en" => {
	if (value === "en") return "en";
	if (value === "th") return "th";
	return "th";
};

export const SuccessStep = ({ preorderId }: SuccessStepProps) => {
  const router = useRouter();
  const { user, login } = useAuth();
  const localeData = useLocale();
  const locale = normalizeLocale(
    typeof localeData === "string"
      ? localeData
      : (localeData as { locale?: string } | undefined)?.locale
  );
  
  const t = useIntlayer("preorder-form");

  return (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
      <Stack gap={6} alignItems="center" className="text-center py-8">
        <CheckCircle2 className="w-20 h-20 text-emerald-500" />
        
        <Stack gap={2}>
          <Heading level={2} size="3xl" color="text-white" weight="bold">
            {t.orderSuccessful.value}
          </Heading>
          <Text color="text-slate-400">
            {t.orderPlacedMessage.value} #{preorderId}
          </Text>
        </Stack>

        {user ? (
          <Stack gap={4} className="w-full">
            <Text size="sm" color="text-emerald-500" weight="bold">
              {t.linkedAccount.value}
            </Text>
            <Button variant="liquid" className="w-full" onClick={() => navigateWithLocale(router, locale, `/orders/${preorderId}`)}>
              {t.trackOrder.value} <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Stack>
        ) : (
          <Card variant="glass" className="p-6 w-full space-y-4">
            <Text size="sm" color="text-slate-400">
              {t.signInPrompt.value}
            </Text>
            <Button 
              variant="secondary"
              className="w-full bg-white text-slate-900 font-bold hover:bg-slate-100"
              onClick={login}
            >
              <LogIn className="w-4 h-4 mr-2" />
              {t.signInButton.value}
            </Button>
          </Card>
        )}

        <Button variant="ghost" className="w-full" onClick={() => navigateWithLocale(router, locale, "/")}>
          {t.continueShopping.value}
        </Button>
      </Stack>
    </motion.div>
  );
};
