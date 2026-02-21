"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Preorder, Item } from "@/types/types";
import { API_BASE_URL } from "@/lib/env";

type ApiResponse<T> = {
	hasError: boolean;
	errorMessage?: string;
	payload: T;
};

export type PaymentAccount = {
	id: number;
	name: string;
	promptpay_id: string;
	is_active: boolean;
	total_orders: number;
	total_revenue: number;
};

export type AdminOverview = {
	total_orders: number;
	total_revenue: number;
	pending_preorders: number;
	active_users: number;
	visible_products: number;
	visible_sets: number;
	preorder_products: number;
	preorder_sets: number;
	top_products?: {
		item_id: number;
		title: string;
		units_sold: number;
	}[];
	payment_breakdown?: {
		payment_account_id: number;
		name: string;
		orders: number;
		revenue: number;
	}[];
};

export type AdminUser = {
	uuid: string;
	name: string;
	email: string;
	role: string;
	created_at: string;
	last_active_at?: string;
	is_active: boolean;
};

export type AdminSetItem = {
	id?: number;
	set_id?: number;
	item_id: number;
	quantity: number;
	item?: Item;
};

export type AdminSet = {
	id: number;
	title: string;
	description: string;
	price: number;
	is_preorder: number;
	hidden: number;
	enabled: number;
	payment_account_id: number;
	images?: { id?: number; url?: string; URL?: string }[];
	items?: AdminSetItem[];
	created_at?: string;
	updated_at?: string;
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
	if (!res.ok) throw new Error("Failed to fetch payment accounts");
	const data: ApiResponse<PaymentAccount[]> = await res.json();
	if (data.hasError) throw new Error(data.errorMessage || "Failed to fetch payment accounts");
	return data.payload || [];
};

export const usePaymentAccounts = (enabled: boolean = true) => {
	return useQuery({
		queryKey: ["payment-accounts"],
		queryFn: fetchPaymentAccounts,
		enabled,
	});
};

export const useCreatePaymentAccount = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload: { name: string; promptpay_id: string; is_active?: boolean }) => {
			const res = await fetch(`${API_BASE_URL}/admin/payment-accounts`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({ error: "Failed to create account" }));
				throw new Error(err.error || "Failed to create account");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["payment-accounts"] });
		},
	});
};

export const useUpdatePaymentAccount = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, ...payload }: { id: number; name: string; promptpay_id: string; is_active?: boolean }) => {
			const res = await fetch(`${API_BASE_URL}/admin/payment-accounts/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({ error: "Failed to update account" }));
				throw new Error(err.error || "Failed to update account");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["payment-accounts"] });
		},
	});
};

export const useDisablePaymentAccount = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: number) => {
			const res = await fetch(`${API_BASE_URL}/admin/payment-accounts/${id}`, {
				method: "DELETE",
			});
			if (!res.ok) throw new Error("Failed to disable account");
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["payment-accounts"] });
		},
	});
};

const fetchAdminOverview = async (): Promise<AdminOverview> => {
	const res = await fetch(`${API_BASE_URL}/admin/analytics/overview`);
	if (!res.ok) throw new Error("Failed to fetch overview");
	const data: ApiResponse<AdminOverview> = await res.json();
	if (data.hasError) throw new Error(data.errorMessage || "Failed to fetch overview");
	return data.payload;
};

export const useAdminOverview = (enabled: boolean = true) => {
	return useQuery({
		queryKey: ["admin-overview"],
		queryFn: fetchAdminOverview,
		enabled,
	});
};

const fetchAdminUsers = async (): Promise<AdminUser[]> => {
	const res = await fetch(`${API_BASE_URL}/admin/users`);
	if (!res.ok) throw new Error("Failed to fetch users");
	const data: ApiResponse<AdminUser[]> = await res.json();
	if (data.hasError) throw new Error(data.errorMessage || "Failed to fetch users");
	return data.payload || [];
};

export const useAdminUsers = (enabled: boolean = true) => {
	return useQuery({
		queryKey: ["admin-users"],
		queryFn: fetchAdminUsers,
		enabled,
	});
};

const fetchAdminSets = async (search: string, status: string): Promise<AdminSet[]> => {
	const params = new URLSearchParams();
	if (search.trim()) params.set("search", search.trim());
	if (status.trim()) params.set("status", status.trim());
	const query = params.toString();
	const res = await fetch(`${API_BASE_URL}/admin/sets${query ? `?${query}` : ""}`);
	if (!res.ok) throw new Error("Failed to fetch sets");
	const data: ApiResponse<AdminSet[]> = await res.json();
	if (data.hasError) throw new Error(data.errorMessage || "Failed to fetch sets");
	return data.payload || [];
};

export const useAdminSets = (search: string, status: string, enabled: boolean = true) => {
	return useQuery({
		queryKey: ["admin-sets", search, status],
		queryFn: () => fetchAdminSets(search, status),
		enabled,
	});
};

const fetchAdminSetDetail = async (setId: string): Promise<AdminSet> => {
	const res = await fetch(`${API_BASE_URL}/admin/sets/${setId}`);
	if (!res.ok) throw new Error("Failed to fetch set details");
	const data: ApiResponse<AdminSet> = await res.json();
	if (data.hasError) throw new Error(data.errorMessage || "Failed to fetch set details");
	return data.payload;
};

export const useAdminSetDetail = (setId: string, enabled: boolean = true) => {
	return useQuery({
		queryKey: ["admin-set", setId],
		queryFn: () => fetchAdminSetDetail(setId),
		enabled: enabled && !!setId,
	});
};

export const useCreateSet = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload: {
			title: string;
			description: string;
			price: number;
			is_preorder: boolean;
			hidden: boolean;
			enabled?: boolean;
			image_urls: string[];
			payment_account_id: number;
			items: { item_id: number; quantity: number }[];
		}) => {
			const res = await fetch(`${API_BASE_URL}/admin/sets`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({ error: "Failed to create set" }));
				throw new Error(err.error || "Failed to create set");
			}
			return res.json();
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-sets"] }),
	});
};

export const useUpdateSet = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			id,
			payload,
		}: {
			id: number;
			payload: {
				title: string;
				description: string;
				price: number;
				is_preorder: boolean;
				hidden: boolean;
				enabled?: boolean;
				image_urls: string[];
				payment_account_id: number;
				items: { item_id: number; quantity: number }[];
			};
		}) => {
			const res = await fetch(`${API_BASE_URL}/admin/sets/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({ error: "Failed to update set" }));
				throw new Error(err.error || "Failed to update set");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-sets"] });
			queryClient.invalidateQueries({ queryKey: ["admin-set"] });
		},
	});
};

export const useDisableSet = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: number) => {
			const res = await fetch(`${API_BASE_URL}/admin/sets/${id}`, { method: "DELETE" });
			if (!res.ok) throw new Error("Failed to disable set");
			return res.json();
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-sets"] }),
	});
};

const fetchAdminProductsForSet = async (): Promise<Item[]> => {
	const res = await fetch(`${API_BASE_URL}/admin/products`);
	if (!res.ok) throw new Error("Failed to fetch products for set");
	const data: ApiResponse<Item[]> = await res.json();
	if (data.hasError) throw new Error(data.errorMessage || "Failed to fetch products for set");
	return data.payload || [];
};

export const useAdminProductsForSet = (enabled: boolean = true) => {
	return useQuery({
		queryKey: ["admin-products-for-set"],
		queryFn: fetchAdminProductsForSet,
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
