"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "@/lib/env";

import { InfoStep } from "./InfoStep";
import { PaymentStep } from "./PaymentStep";
import { SuccessStep } from "./SuccessStep";

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
  const [step, setStep] = useState<Step>('info');
  const [isLoading, setIsLoading] = useState(false);
  const [preorderId, setPreorderId] = useState<number | null>(null);

  const methods = useForm<IFormInputs>({
    defaultValues: {
      shipping_method: "pickup"
    }
  });

  const { watch, handleSubmit } = methods;
  const shippingMethod = watch("shipping_method");
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCost = shippingMethod === "postal" ? 50 : 0;
  const totalPrice = subtotal + shippingCost;

  const onInfoSubmit: SubmitHandler<IFormInputs> = async (data) => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setStep('payment');
  };

  const handleFinalSubmit = async (file: File) => {
    try {
      setIsLoading(true);
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

      const response = await fetch(`${API_BASE_URL}/api/preorders`, {
        method: "POST",
        body: formData,
      });
      
      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || "Error submitting order");

      setPreorderId(resData.preorder.id);
      setStep('success');
      clearCart();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <FormProvider {...methods}>
        <AnimatePresence mode="wait">
          {step === 'info' && (
            <InfoStep 
              key="info"
              isLoading={isLoading} 
              onSubmit={handleSubmit(onInfoSubmit)} 
              totalPrice={totalPrice}
            />
          )}
          {step === 'payment' && (
             <PaymentStep 
               key="payment"
               isLoading={isLoading}
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
