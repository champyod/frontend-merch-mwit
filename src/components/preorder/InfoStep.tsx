"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { User, ChevronRight, Loader2 } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { motion } from "framer-motion";
import { Stack, Flex, Heading, Text, Input, TextArea, Button, Box } from "@/components/ui/primitives";
import { IFormInputs } from "./PreorderForm";

interface InfoStepProps {
  isLoading: boolean;
  onSubmit: (e: React.BaseSyntheticEvent) => Promise<void>;
  totalPrice: number;
}

export const InfoStep = ({ isLoading, onSubmit, totalPrice }: InfoStepProps) => {
  const { register, watch, formState: { errors } } = useFormContext<IFormInputs>();
  const shippingMethod = watch("shipping_method");

  const t = useIntlayer("preorder-form");

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      <Stack gap={4}>
        <Flex gap={2} className="mb-4">
          <User className="w-5 h-5 text-emerald-500" />
          <Heading level={2} size="xl" color="text-white">
            {t.checkoutDetails.value}
          </Heading>
        </Flex>
        
        <Input 
          label={t.fullNameLabel.value}
          placeholder={t.fullNamePlaceholder.value}
          {...register("name", { required: t.nameRequired.value })}
          error={errors.name?.message}
        />

        <Box className="grid grid-cols-2 gap-4">
          <Input
            label={t.socialLabel.value}
            placeholder={t.socialPlaceholder.value}
            {...register("social", { required: t.socialRequired.value })}
            error={errors.social?.message}
          />
          <Input
            label={t.phoneLabel.value}
            placeholder={t.phonePlaceholder.value}
            {...register("contact", { required: t.phoneRequired.value })}
            error={errors.contact?.message}
          />
        </Box>

        <Stack gap={2}>
          <Text size="sm" weight="medium" color="text-slate-400">
            {t.shippingMethodLabel.value}
          </Text>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => register("shipping_method").onChange({ target: { value: "pickup", name: "shipping_method" } })}
              className={`p-3 rounded-xl border-2 transition-all text-sm font-bold ${shippingMethod === "pickup" ? "border-emerald-500 bg-emerald-500/10 text-emerald-500" : "border-white/10 bg-white/5 text-slate-400"}`}
            >
              {t.pickupLabel.value}
            </button>
            <button
              type="button"
              onClick={() => register("shipping_method").onChange({ target: { value: "postal", name: "shipping_method" } })}
              className={`p-3 rounded-xl border-2 transition-all text-sm font-bold ${shippingMethod === "postal" ? "border-emerald-500 bg-emerald-500/10 text-emerald-500" : "border-white/10 bg-white/5 text-slate-400"}`}
            >
              {t.postalLabel.value}
            </button>
          </div>
          <input type="hidden" {...register("shipping_method")} />
        </Stack>

        {shippingMethod === "postal" && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-2 overflow-hidden">
            <TextArea
              label={t.addressLabel.value}
              placeholder={t.addressPlaceholder.value}
              {...register("address", { required: shippingMethod === "postal" ? t.addressRequired.value : false })}
              error={errors.address?.message}
            />
          </motion.div>
        )}

        <Box className="pt-4 border-t border-white/10 mt-4">
           <Flex justifyContent="between">
              <Text size="lg" weight="bold" color="text-white">{t.totalAmount.value}</Text>
              <Text size="lg" weight="bold" color="text-emerald-500">฿{totalPrice.toLocaleString()}</Text>
           </Flex>
        </Box>

        <Button 
          variant="liquid" 
          className="w-full mt-4" 
          onClick={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Flex gap={2}>{t.goToPayment.value} <ChevronRight className="w-4 h-4" /></Flex>}
        </Button>
      </Stack>
    </motion.div>
  );
};
