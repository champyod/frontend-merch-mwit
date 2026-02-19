"use client";

import React from "react";
import { CheckCircle2, ChevronRight, LogIn } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { motion } from "framer-motion";
import { Stack, Flex, Heading, Text, Button, Card } from "@/components/ui/primitives";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

interface SuccessStepProps {
  preorderId: number;
}

export const SuccessStep = ({ preorderId }: SuccessStepProps) => {
  const router = useRouter();
  const { user, login } = useAuth();
  
  const {
    orderSuccessful, orderPlacedMessage, linkedAccount, trackOrder,
    signInPrompt, signInButton, continueShopping
  } = useIntlayer("preorder-form");

  return (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
      <Stack gap={6} alignItems="center" className="text-center py-8">
        <CheckCircle2 className="w-20 h-20 text-emerald-500" />
        
        <Stack gap={2}>
          <Heading level={2} size="3xl" color="text-white" weight="bold">
            {orderSuccessful}
          </Heading>
          <Text color="text-slate-400">
            {orderPlacedMessage} #{preorderId}
          </Text>
        </Stack>

        {user ? (
          <Stack gap={4} className="w-full">
            <Text size="sm" color="text-emerald-500" weight="bold">
              {linkedAccount}
            </Text>
            <Button variant="liquid" className="w-full" onClick={() => router.push(`/orders/${preorderId}`)}>
              {trackOrder} <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Stack>
        ) : (
          <Card variant="glass" className="p-6 w-full space-y-4">
            <Text size="sm" color="text-slate-400">
              {signInPrompt}
            </Text>
            <Button 
              variant="secondary"
              className="w-full bg-white text-slate-900 font-bold hover:bg-slate-100"
              onClick={login}
            >
              <LogIn className="w-4 h-4 mr-2" />
              {signInButton}
            </Button>
          </Card>
        )}

        <Button variant="ghost" className="w-full" onClick={() => router.push('/')}>
          {continueShopping}
        </Button>
      </Stack>
    </motion.div>
  );
};
