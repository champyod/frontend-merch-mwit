import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

export type PaymentMethod = {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  promptpay_id: string;
  is_active: boolean;
};

type PaymentMethodPayload = {
  name: string;
  promptpay_id: string;
  is_active?: boolean;
};

// Fetch all payment methods
export const usePaymentMethods = (activeOnly: boolean = false) => {
  return useQuery<PaymentMethod[], Error>({
    queryKey: ["paymentMethods", activeOnly],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/admin/payment-accounts?active=${activeOnly}`);
      if (!res.ok) {
        throw new Error("Failed to fetch payment methods");
      }
      const data = await res.json();
      if (data.hasError) {
        throw new Error(data.errorMessage || "Failed to fetch payment methods");
      }
      return data.payload;
    },
  });
};

// Fetch a single payment method by ID
export const usePaymentMethod = (id: number) => {
  return useQuery<PaymentMethod, Error>({
    queryKey: ["paymentMethod", id],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/admin/payment-accounts/${id}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch payment method with ID ${id}`);
      }
      const data = await res.json();
      if (data.hasError) {
        throw new Error(data.errorMessage || `Failed to fetch payment method with ID ${id}`);
      }
      return data.payload;
    },
    enabled: !!id, // Only run the query if id is provided
  });
};

// Create a new payment method
export const useCreatePaymentMethod = () => {
  const queryClient = useQueryClient();
  return useMutation<PaymentMethod, Error, PaymentMethodPayload>({
    mutationFn: async (newMethod) => {
      const res = await fetch(`${API_BASE_URL}/admin/payment-accounts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMethod),
      });
      if (!res.ok) {
        throw new Error("Failed to create payment method");
      }
      const data = await res.json();
      if (data.hasError) {
        throw new Error(data.errorMessage || "Failed to create payment method");
      }
      return data.payload;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
    },
  });
};

// Update an existing payment method
export const useUpdatePaymentMethod = () => {
  const queryClient = useQueryClient();
  return useMutation<PaymentMethod, Error, { id: number; payload: PaymentMethodPayload }>({
    mutationFn: async ({ id, payload }) => {
      const res = await fetch(`${API_BASE_URL}/admin/payment-accounts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`Failed to update payment method with ID ${id}`);
      }
      const data = await res.json();
      if (data.hasError) {
        throw new Error(data.errorMessage || `Failed to update payment method with ID ${id}`);
      }
      return data.payload;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
      queryClient.invalidateQueries({ queryKey: ["paymentMethod", variables.id] });
    },
  });
};

// Disable/Enable an existing payment method (soft delete)
export const useTogglePaymentMethodStatus = () => {
  const queryClient = useQueryClient();
  return useMutation<PaymentMethod, Error, { id: number; is_active: boolean }>({
    mutationFn: async ({ id, is_active }) => {
      const res = await fetch(`${API_BASE_URL}/admin/payment-accounts/${id}`, {
        method: "PUT", // Using PUT to update is_active status
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active }),
      });
      if (!res.ok) {
        throw new Error(`Failed to toggle status for payment method with ID ${id}`);
      }
      const data = await res.json();
      if (data.hasError) {
        throw new Error(data.errorMessage || `Failed to toggle status for payment method with ID ${id}`);
      }
      // Note: Backend's DeleteAccount sets is_active to false, so this PUT for is_active covers both enable/disable.
      return data.payload;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
      queryClient.invalidateQueries({ queryKey: ["paymentMethod", variables.id] });
    },
  });
};
