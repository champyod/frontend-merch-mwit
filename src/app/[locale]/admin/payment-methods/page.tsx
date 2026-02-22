"use client";

import { useState } from "react";
import { useIntlayer } from "next-intlayer";
import { PlusCircle, Loader2 } from "lucide-react";
import {
  Stack,
  Flex,
  Heading,
  Text,
  Button,
  Box,
  Card,
  Input,
  Badge,
} from "@/components/ui/primitives";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePaymentMethods, useTogglePaymentMethodStatus } from "@/hooks/usePaymentMethods";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PaymentMethodForm from "@/components/admin/PaymentMethodForm"; // To be created

export default function AdminPaymentMethodsPage() {
  const t = useIntlayer("admin"); // Assuming 'admin' content file exists
  const { data: paymentMethods, isLoading, error } = usePaymentMethods();
  const toggleStatusMutation = useTogglePaymentMethodStatus();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<any>(null); // Type 'any' for now, will refine

  const handleEditClick = (method: any) => {
    setEditingMethod(method);
    setIsFormOpen(true);
  };

  const handleToggleStatus = (id: number, currentStatus: boolean) => {
    toggleStatusMutation.mutate({ id, is_active: !currentStatus });
  };

  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" className="h-64">
        <Loader2 className="h-10 w-10 animate-spin text-white" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justifyContent="center" alignItems="center" className="h-64">
        <Text color="text-red-500">{t.errorMessage.value}: {error.message}</Text>
      </Flex>
    );
  }

  return (
    <Stack gap={8} className="p-6 md:p-10 max-w-screen-xl mx-auto">
      <Flex justifyContent="between" alignItems="center">
        <Heading level={1} size="3xl" color="text-white">
          {t.paymentMethods.value}
        </Heading>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingMethod(null)} variant="primary" size="lg">
              <PlusCircle className="w-5 h-5 mr-2" /> {t.addNewPaymentMethod.value}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-[#0a2735] border border-white/10 rounded-2xl p-6">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingMethod ? t.editPaymentMethod.value : t.addNewPaymentMethod.value}
              </DialogTitle>
            </DialogHeader>
            <PaymentMethodForm
              initialData={editingMethod}
              onClose={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </Flex>

      <Card variant="solid" className="p-0 border border-white/10">
        <Table>
          <TableHeader>
            <TableRow className="bg-white/5 border-b border-white/10">
              <TableHead className="text-white/60">{t.name.value}</TableHead>
              <TableHead className="text-white/60">{t.promptPayId.value}</TableHead>
              <TableHead className="text-white/60 text-center">{t.active.value}</TableHead>
              <TableHead className="text-white/60 text-right">{t.actions.value}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paymentMethods?.map((method) => (
              <TableRow key={method.id} className="border-b border-white/5 last:border-b-0 hover:bg-white/5">
                <TableCell className="font-medium text-white">{method.name}</TableCell>
                <TableCell className="text-white/80">{method.promptpay_id}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={method.is_active ? "success" : "danger"}>
                    {method.is_active ? t.active.value : t.inactive.value}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Flex gap={2} justifyContent="end">
                    <Button variant="secondary" size="sm" onClick={() => handleEditClick(method)}>
                      {t.edit.value}
                    </Button>
                    <Button
                      variant={method.is_active ? "danger" : "primary"}
                      size="sm"
                      onClick={() => handleToggleStatus(method.id, method.is_active)}
                      disabled={toggleStatusMutation.isPending}
                    >
                      {toggleStatusMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {method.is_active ? t.disable.value : t.enable.value}
                    </Button>
                  </Flex>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </Stack>
  );
}
