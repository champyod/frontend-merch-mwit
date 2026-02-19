"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Preorder } from "@/types/types";
import { API_BASE_URL } from "@/lib/env";

type ApiResponse<T> = {
	hasError: boolean;
	errorMessage?: string;
	payload: T;
};

// ... (existing fetchers)

export const useSubmitPreorder = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (formData: FormData) => {
			const res = await fetch(`${API_BASE_URL}/preorders`, {
				method: "POST",
				body: formData,
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Error submitting order");
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["my-orders"] });
		},
	});
};

const fetchMyOrders = async (): Promise<Preorder[]> => {
	const res = await fetch(`${API_BASE_URL}/me/orders`);
	const data: ApiResponse<Preorder[]> = await res.json();
	if (data.hasError) throw new Error(data.errorMessage || "Failed to fetch orders");
	return data.payload || [];
};

const fetchMyOrder = async (orderId: string): Promise<Preorder> => {
	const res = await fetch(`${API_BASE_URL}/me/orders/${orderId}`);
	const data: ApiResponse<Preorder> = await res.json();
	if (data.hasError) throw new Error(data.errorMessage || "Failed to fetch order");
	return data.payload;
};

export const useMyOrders = (enabled: boolean = true) => {
	return useQuery({
		queryKey: ["my-orders"],
		queryFn: fetchMyOrders,
		enabled,
	});
};

export const useMyOrder = (orderId: string, enabled: boolean = true) => {
	return useQuery({
		queryKey: ["my-order", orderId],
		queryFn: () => fetchMyOrder(orderId),
		enabled: !!orderId && enabled,
	});
};
