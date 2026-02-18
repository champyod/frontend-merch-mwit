"use client";

import { ColorSize, Item } from "@/types/types";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Toaster, toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { LiquidCard } from "./LiquidCard";
import { LiquidButton } from "./LiquidButton";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, QrCode, Upload, User, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";

interface IFormInputs {
  name: string;
  social: string;
  size: string;
  color: string;
}

type Step = 'info' | 'payment' | 'upload' | 'success';

export default function PreorderForm({
  colorSizeArr,
  itemId,
  price
}: {
  colorSizeArr: Item["color_size_arr"];
  itemId: string;
  price: number;
}) {
  const [step, setStep] = useState<Step>('info');
  const [isLoading, setIsLoading] = useState(false);
  const [qrPayload, setQrPayload] = useState<string | null>(null);
  const [preorderId, setPreorderId] = useState<number | null>(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch
  } = useForm<IFormInputs>();

  const selectedSize = watch("size");

  const onInfoSubmit: SubmitHandler<IFormInputs> = async (body) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/preorders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, itemId }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error submitting form");

      setQrPayload(data.payment_payload);
      setPreorderId(data.preorder.id);
      setStep('payment');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !preorderId) return;

    setIsLoading(true);
    // Simulate upload success
    setTimeout(() => {
      setStep('success');
      setIsLoading(false);
    }, 1500);
  };

  const renderStep = () => {
    switch (step) {
      case 'info':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-emerald-500" />
              <h2 className="text-xl font-bold text-white">Contact Information</h2>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Full Name</label>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                {...register("name", { required: true })}
                placeholder="สมชาย ใจดี"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Social Contact (LINE/FB/IG)</label>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                {...register("social", { required: true })}
                placeholder="@username"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Choose Size & Color</label>
              <select
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all appearance-none"
                defaultValue=""
                required
                onChange={(e) => {
                  const cs: ColorSize = JSON.parse(e.target.value);
                  setValue("color", cs.color);
                  setValue("size", cs.size);
                }}
              >
                <option disabled value="" className="bg-slate-900">Select variant</option>
                {colorSizeArr?.map((item, i) => (
                  <option key={i} value={JSON.stringify(item)} className="bg-slate-900">
                    {item.color} {item.size ? `- Size: ${item.size}` : ""}
                  </option>
                ))}
              </select>
            </div>
            <LiquidButton 
              className="w-full mt-4" 
              onClick={handleSubmit(onInfoSubmit)}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Next <ChevronRight className="w-4 h-4" /></>}
            </LiquidButton>
          </motion.div>
        );

      case 'payment':
        return (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center space-y-6">
            <div className="flex items-center gap-2">
              <QrCode className="w-6 h-6 text-emerald-500" />
              <h2 className="text-xl font-bold text-white">Scan to Pay</h2>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-2xl">
              <QRCodeSVG value={qrPayload || ""} size={200} />
              <div className="mt-4 text-slate-900 font-bold text-xl">฿{price.toLocaleString()}</div>
            </div>
            <p className="text-sm text-slate-400 max-w-[250px]">Please scan the QR code with your mobile banking app to complete payment.</p>
            <div className="flex w-full gap-3">
              <LiquidButton variant="outline" className="flex-1" onClick={() => setStep('info')}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </LiquidButton>
              <LiquidButton className="flex-1" onClick={() => setStep('upload')}>
                I have paid
              </LiquidButton>
            </div>
          </motion.div>
        );

      case 'upload':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-xl font-bold text-white">Upload Payment Slip</h2>
            </div>
            <div className="relative group">
              <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 opacity-0 cursor-pointer z-20" 
                onChange={handleSlipUpload}
                disabled={isLoading}
              />
              <LiquidCard className="p-10 border-dashed border-2 border-emerald-500/20 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-all">
                {isLoading ? <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto" /> : (
                  <div className="space-y-2">
                    <p className="text-emerald-500 font-medium">Click to select file</p>
                    <p className="text-xs text-slate-500">JPG, PNG or PDF (Max 5MB)</p>
                  </div>
                )}
              </LiquidCard>
            </div>
            <LiquidButton variant="ghost" onClick={() => setStep('payment')}>
              View QR again
            </LiquidButton>
          </motion.div>
        );

      case 'success':
        return (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-4">
            <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto" />
            <h2 className="text-3xl font-bold text-white">Pre-order Successful!</h2>
            <p className="text-slate-400">Thank you for your order. We will process it shortly.</p>
            <LiquidButton className="mt-6" onClick={() => window.location.reload()}>
              Done
            </LiquidButton>
          </motion.div>
        );
    }
  };

  return (
    <div className="w-full">
      <Toaster richColors position="bottom-right" />
      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>
    </div>
  );
}