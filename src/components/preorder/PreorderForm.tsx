"use client";

import React, { useState } from "react";
import { useCart } from "@/contexts/cart-context";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "@/lib/env";
import { useAuth } from "@/contexts/auth-context";
import { Chrome, User } from "lucide-react";
import { Box, Heading, Text, Button, Stack } from "@/components/ui/primitives";
import { useIntlayer } from "next-intlayer";

import { InfoStep } from "./InfoStep";
import { PaymentStep } from "./PaymentStep";
import { SuccessStep } from "./SuccessStep";

import { useSubmitPreorder } from "@/hooks/useOrders";
import { calculateCartSubtotal, calculateShippingCost } from "@/lib/logic";

export interface IFormInputs {
  name: string;
  social: string;
  contact: string;
  shipping_method: "pickup" | "postal";
  address: string;
}

type Step = 'info' | 'payment' | 'success';

export default function PreorderForm() {
  const { cart, clearCart } = useCart();
  const { user, login, isLoading: isAuthLoading } = useAuth();
  const [step, setStep] = useState<Step>('info');
  const [preorderId, setPreorderId] = useState<number | null>(null);
  const submitMutation = useSubmitPreorder();
  const t = useIntlayer("preorder-form");

  const methods = useForm<IFormInputs>({
    defaultValues: {
      shipping_method: "pickup"
    }
  });

  const { watch, handleSubmit } = methods;
  const shippingMethod = watch("shipping_method");
  const subtotal = calculateCartSubtotal(cart);
  const shippingCost = calculateShippingCost(shippingMethod);
  const totalPrice = subtotal + shippingCost;

  if (isAuthLoading) return null;

  if (!user) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Stack gap={6} className="text-center py-4">
          <Box className="flex justify-center mb-2">
            <Box className="p-4 bg-emerald-500/10 rounded-full">
              <User className="w-8 h-8 text-emerald-500" />
            </Box>
          </Box>
          <Stack gap={2}>
            <Heading level={2} size="xl" color="text-white">{t.authRequiredTitle.value}</Heading>
            <Text size="sm" color="text-slate-400">{t.authRequiredDesc.value}</Text>
          </Stack>
          <Button 
            variant="primary" 
            className="w-full gap-3 py-4"
            onClick={login}
          >
            <Chrome className="w-5 h-5" />
            {t.loginButton.value}
          </Button>
        </Stack>
      </motion.div>
    );
  }

  const onInfoSubmit: SubmitHandler<IFormInputs> = async (data) => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setStep('payment');
  };

  const handleFinalSubmit = async (file: File) => {
    try {
      const formData = new FormData();
      const info = watch();
      
      formData.append("name", info.name);
      formData.append("social", info.social);
      formData.append("contact", info.contact);
      formData.append("shipping_method", info.shipping_method);
      formData.append("address", info.address || "");
      formData.append("items", JSON.stringify(cart.map(item => ({
        item_id: item.item_id,
        size: item.size,
        color: item.color,
        quantity: item.quantity
      }))));
      formData.append("slip", file);

      const resData = await submitMutation.mutateAsync(formData);

      setPreorderId(resData.preorder.id);
      setStep('success');
      clearCart();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full">
      <FormProvider {...methods}>
        <AnimatePresence mode="wait">
          {step === 'info' && (
            <InfoStep 
              key="info"
              isLoading={submitMutation.isPending} 
              onSubmit={handleSubmit(onInfoSubmit)} 
              totalPrice={totalPrice}
            />
          )}
          {step === 'payment' && (
             <PaymentStep 
               key="payment"
               isLoading={submitMutation.isPending}
               totalPrice={totalPrice}
               onBack={() => setStep('info')}
               onUpload={handleFinalSubmit}
             />
          )}
          {step === 'success' && preorderId && (
            <SuccessStep 
              key="success"
              preorderId={preorderId} 
            />
          )}
        </AnimatePresence>
      </FormProvider>
    </div>
  );
}
