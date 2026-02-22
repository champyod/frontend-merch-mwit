"use client";

import { useEffect } from "react";
import { useIntlayer } from "next-intlayer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Stack, Button, Input, Text, Flex, Box, Spinner } from "@/components/ui/primitives";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  useCreatePaymentMethod,
  useUpdatePaymentMethod,
  PaymentMethod,
} from "@/hooks/usePaymentMethods";
import { Switch } from "@/components/ui/switch"; // Assuming a Switch component exists

const formSchema = z.object({
  name: z.string().min(1, { message: "Payment method name is required." }),
  promptpay_id: z.string().min(1, { message: "PromptPay ID is required." }),
  is_active: z.boolean().default(true).optional(),
});

interface PaymentMethodFormProps {
  initialData?: PaymentMethod | null;
  onClose: () => void;
}

export default function PaymentMethodForm({ initialData, onClose }: PaymentMethodFormProps) {
  const t = useIntlayer("admin"); // Assuming 'admin' content file exists
  const createMutation = useCreatePaymentMethod();
  const updateMutation = useUpdatePaymentMethod();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      promptpay_id: initialData?.promptpay_id || "",
      is_active: initialData?.is_active ?? true,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        promptpay_id: initialData.promptpay_id,
        is_active: initialData.is_active,
      });
    } else {
      form.reset({
        name: "",
        promptpay_id: "",
        is_active: true,
      });
    }
  }, [initialData, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (initialData) {
      updateMutation.mutate(
        { id: initialData.id, payload: values },
        {
          onSuccess: () => onClose(),
        }
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: () => onClose(),
      });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">{t.name.value}</FormLabel>
              <FormControl>
                <Input placeholder={t.paymentMethodNamePlaceholder.value} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="promptpay_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">{t.promptPayId.value}</FormLabel>
              <FormControl>
                <Input placeholder={t.promptPayIdPlaceholder.value} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 p-3 shadow-sm">
                <Box className="space-y-0.5">
                <FormLabel className="text-white">{t.active.value}</FormLabel>
                <Text size="sm" color="text-white/70">
                  {t.paymentMethodActiveDescription.value}
                </Text>
                </Box>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Flex justifyContent="end" gap={3} className="pt-4">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            {t.cancel.value}
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting && <Spinner size="sm" className="mr-2" />}
            {initialData ? t.saveChanges.value : t.create.value}
          </Button>
        </Flex>
      </form>
    </Form>
  );
}
