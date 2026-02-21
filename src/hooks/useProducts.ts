"use client";

import { useQuery } from "@tanstack/react-query";
import { Item } from "@/types/types";
import { API_BASE_URL } from "@/lib/env";

type ApiResponse<T> = {
	hasError: boolean;
	errorMessage?: string;
	payload: T;
};

type GetProductsResponse = ApiResponse<Item[]>;

const fetchProducts = async (collectionName?: string): Promise<Item[]> => {
	const url = collectionName 
		? `${API_BASE_URL}/products?collectionName=${collectionName}` 
		: `${API_BASE_URL}/products`;
	const res = await fetch(url);
	const data: GetProductsResponse = await res.json();
	if (data.hasError) throw new Error(data.errorMessage);
	return data.payload || [];
};

const fetchAllProducts = async (): Promise<Item[]> => {
	const res = await fetch(`${API_BASE_URL}/products`);
	const data: GetProductsResponse = await res.json();
	if (data.hasError) throw new Error(data.errorMessage);
	return data.payload || [];
};

const fetchProductsByPage = async (slug: string): Promise<Item[]> => {
	const res = await fetch(`${API_BASE_URL}/products?collectionName=${encodeURIComponent(slug)}`);
	const data: GetProductsResponse = await res.json();
	if (data.hasError) throw new Error(data.errorMessage);
	return data.payload || [];
};

const fetchPreorderItems = async (): Promise<Item[]> => {
	const res = await fetch(`${API_BASE_URL}/products`);
	const data: GetProductsResponse = await res.json();
	if (data.hasError) throw new Error(data.errorMessage);
	return (data.payload || []).filter((item) => item.is_preorder === 1);
};

const fetchSaleItems = async (): Promise<Item[]> => {
	const res = await fetch(`${API_BASE_URL}/products`);
	const data: GetProductsResponse = await res.json();
	if (data.hasError) throw new Error(data.errorMessage);
	return (data.payload || []).filter((item) => (item.discount || 0) > 0);
};

const fetchProduct = async (itemId: string): Promise<Item> => {
	const res = await fetch(`${API_BASE_URL}/products/${itemId}`);
	const data: ApiResponse<Item> = await res.json();
	if (data.hasError) throw new Error(data.errorMessage);
	return data.payload;
};

export const useProducts = (collectionName?: string) => {
	return useQuery({
		queryKey: ["products", collectionName],
		queryFn: () => fetchProducts(collectionName),
	});
};

export const useAllProducts = () => {
	return useQuery({
		queryKey: ["products", "all"],
		queryFn: fetchAllProducts,
	});
};

export const useProductsByPage = (slug: string) => {
	return useQuery({
		queryKey: ["products-page", slug],
		queryFn: () => fetchProductsByPage(slug),
		enabled: !!slug,
	});
};

export const usePreorderItems = () => {
	return useQuery({
		queryKey: ["products-preorder"],
		queryFn: fetchPreorderItems,
	});
};

export const useSaleItems = () => {
	return useQuery({
		queryKey: ["products-sale"],
		queryFn: fetchSaleItems,
	});
};

export const useProduct = (itemId: string) => {
	return useQuery({
		queryKey: ["product", itemId],
		queryFn: () => fetchProduct(itemId),
		enabled: !!itemId,
	});
};
