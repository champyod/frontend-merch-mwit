"use client";

import React, { useRef } from "react";
import { QrCode, Upload, ChevronLeft, Loader2 } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { motion } from "framer-motion";
import { Stack, Flex, Heading, Text, Button, Card, Box } from "@/components/ui/primitives";

interface PaymentStepProps {
  isLoading: boolean;
  totalPrice: number;
  onBack: () => void;
  onUpload: (file: File) => void;
}

export const PaymentStep = ({ isLoading, totalPrice, onBack, onUpload }: PaymentStepProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    scanToPay, totalToPay, recipientName,
    transferInstruction, uploadSlip, fileType, backToDetails
  } = useIntlayer("preorder-form");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
      <Stack gap={6} alignItems="center" className="text-center">
        <Flex gap={2}>
          <QrCode className="w-6 h-6 text-emerald-500" />
          <Heading level={2} size="xl" color="text-white">
            {scanToPay}
          </Heading>
        </Flex>
        
        <Card variant="solid" className="bg-white p-6 shadow-2xl w-full max-w-sm">
           <Text size="md" weight="medium" color="text-slate-900" className="mb-2 block">
             {totalToPay}
           </Text>
           <Text size="4xl" weight="black" color="text-slate-900" className="mb-4 block">
             ฿{totalPrice.toLocaleString()}
           </Text>
           <Text size="xs" color="text-slate-400" uppercase tracking="widest" weight="bold">
             {recipientName}
           </Text>
        </Card>
        
        <Text size="sm" color="text-slate-400" className="max-w-[280px]">
          {transferInstruction} <Text weight="bold" color="text-white">฿{totalPrice.toLocaleString()}</Text>
        </Text>

        <Stack gap={3} className="w-full">
          <Box className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={isLoading}
            />
            <Card variant="glass" className="p-8 border-dashed border-2 border-emerald-500/20 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-all flex flex-col items-center justify-center gap-2">
              {isLoading ? (
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
              ) : (
                <>
                  <Upload className="w-6 h-6 text-emerald-500 mb-2" />
                  <Text weight="medium" color="text-emerald-500">{uploadSlip}</Text>
                  <Text size="xs" color="text-slate-500">{fileType}</Text>
                </>
              )}
            </Card>
          </Box>

          <Button variant="ghost" className="w-full" onClick={onBack}>
            <ChevronLeft className="w-4 h-4 mr-1" /> {backToDetails}
          </Button>
        </Stack>
      </Stack>
    </motion.div>
  );
};
