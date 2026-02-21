"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Preorder, Item } from "@/types/types";
import { API_BASE_URL } from "@/lib/env";

type ApiResponse<T> = {
	hasError: boolean;
	errorMessage?: string;
	payload: T;
};

// --- Preorders ---

const fetchAdminPreorders = async (): Promise<Preorder[]> => {
	const res = await fetch(`${API_BASE_URL}/admin/preorders`);
	const data: ApiResponse<Preorder[]> = await res.json();
	if (data.hasError) throw new Error(data.errorMessage || "Failed to fetch preorders");
	return data.payload || [];
};

export const useAdminPreorders = (enabled: boolean = true) => {
	return useQuery({
		queryKey: ["admin-preorders"],
		queryFn: fetchAdminPreorders,
		enabled,
	});
};

export const useUpdateOrderStatus = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, status, tracking_no, note }: { id: number; status: string; tracking_no: string; note: string }) => {
			const res = await fetch(`${API_BASE_URL}/admin/preorders/${id}/status`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status, tracking_no, note })
			});
			if (!res.ok) throw new Error("Update failed");
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-preorders"] });
		},
	});
};

export const useCompletePreorder = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: number) => {
			const res = await fetch(`${API_BASE_URL}/admin/preorders/${id}/complete`, {
				method: "PUT",
			});
			if (!res.ok) throw new Error("Complete failed");
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-preorders"] });
		},
	});
};

// --- Payment Accounts ---

const fetchPaymentAccounts = async () => {
	const res = await fetch(`${API_BASE_URL}/admin/payment-accounts`);
	return res.json();
};

export const usePaymentAccounts = (enabled: boolean = true) => {
	return useQuery({
		queryKey: ["payment-accounts"],
		queryFn: fetchPaymentAccounts,
		enabled,
	});
};

// --- Collections ---

const fetchCollections = async () => {
	const res = await fetch(`${API_BASE_URL}/brand`);
	const data = await res.json();
	return data.payload || [];
};

export const useCollections = (enabled: boolean = true) => {
	return useQuery({
		queryKey: ["collections"],
		queryFn: fetchCollections,
		enabled,
	});
};
