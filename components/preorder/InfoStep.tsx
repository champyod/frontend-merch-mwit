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

  const {
    checkoutDetails,
    fullNameLabel, fullNamePlaceholder,
    socialLabel, socialPlaceholder,
    phoneLabel, phonePlaceholder,
    shippingMethodLabel, pickupLabel, postalLabel,
    addressLabel, addressPlaceholder,
    totalAmount, goToPayment,
    nameRequired, socialRequired, phoneRequired, addressRequired
  } = useIntlayer("preorder-form");

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      <Stack gap={4}>
        <Flex gap={2} className="mb-4">
          <User className="w-5 h-5 text-emerald-500" />
          <Heading level={2} size="xl" color="text-white">
            {checkoutDetails}
          </Heading>
        </Flex>
        
        <Input 
          label={fullNameLabel.value}
          placeholder={fullNamePlaceholder.value}
          {...register("name", { required: nameRequired.value })}
          error={errors.name?.message}
        />

        <Box className="grid grid-cols-2 gap-4">
          <Input
            label={socialLabel.value}
            placeholder={socialPlaceholder.value}
            {...register("social", { required: socialRequired.value })}
            error={errors.social?.message}
          />
          <Input
            label={phoneLabel.value}
            placeholder={phonePlaceholder.value}
            {...register("contact", { required: phoneRequired.value })}
            error={errors.contact?.message}
          />
        </Box>

        <Stack gap={2}>
          <Text size="sm" weight="medium" color="text-slate-400">
            {shippingMethodLabel}
          </Text>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => register("shipping_method").onChange({ target: { value: "pickup", name: "shipping_method" } })}
              className={`p-3 rounded-xl border-2 transition-all text-sm font-bold ${shippingMethod === "pickup" ? "border-emerald-500 bg-emerald-500/10 text-emerald-500" : "border-white/10 bg-white/5 text-slate-400"}`}
            >
              {pickupLabel}
            </button>
            <button
              type="button"
              onClick={() => register("shipping_method").onChange({ target: { value: "postal", name: "shipping_method" } })}
              className={`p-3 rounded-xl border-2 transition-all text-sm font-bold ${shippingMethod === "postal" ? "border-emerald-500 bg-emerald-500/10 text-emerald-500" : "border-white/10 bg-white/5 text-slate-400"}`}
            >
              {postalLabel}
            </button>
          </div>
          <input type="hidden" {...register("shipping_method")} />
        </Stack>

        {shippingMethod === "postal" && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-2 overflow-hidden">
            <TextArea
              label={addressLabel.value}
              placeholder={addressPlaceholder.value}
              {...register("address", { required: shippingMethod === "postal" ? addressRequired.value : false })}
              error={errors.address?.message}
            />
          </motion.div>
        )}

        <Box className="pt-4 border-t border-white/10 mt-4">
           <Flex justifyContent="between">
              <Text size="lg" weight="bold" color="text-white">{totalAmount}</Text>
              <Text size="lg" weight="bold" color="text-emerald-500">฿{totalPrice.toLocaleString()}</Text>
           </Flex>
        </Box>

        <Button 
          variant="liquid" 
          className="w-full mt-4" 
          onClick={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Flex gap={2}>{goToPayment} <ChevronRight className="w-4 h-4" /></Flex>}
        </Button>
      </Stack>
    </motion.div>
  );
};
