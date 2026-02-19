"use client";

import { useQuery } from "@tanstack/react-query";
import { Item } from "@/types/types";

type ApiResponse<T> = {
	hasError: boolean;
	errorMessage?: string;
	payload: T;
};

type GetProductsResponse = ApiResponse<Item[]>;

const fetchProducts = async (brandName?: string): Promise<Item[]> => {
	const url = brandName 
		? `/api/products?brandName=${brandName}` 
		: `/api/products`;
	const res = await fetch(url);
	const data: GetProductsResponse = await res.json();
	if (data.hasError) throw new Error(data.errorMessage);
	return data.payload || [];
};

const fetchAllProducts = async (): Promise<Item[]> => {
	const res = await fetch(`/api/brand/all`);
	const data: GetProductsResponse = await res.json();
	if (data.hasError) throw new Error(data.errorMessage);
	return data.payload || [];
};

const fetchProductsByPage = async (slug: string): Promise<Item[]> => {
	const res = await fetch(`/api/brand/page/${slug}`);
	const data: GetProductsResponse = await res.json();
	if (data.hasError) throw new Error(data.errorMessage);
	return data.payload || [];
};

const fetchPreorderItems = async (): Promise<Item[]> => {
	const res = await fetch(`/api/brand/preorders`);
	const data: GetProductsResponse = await res.json();
	if (data.hasError) throw new Error(data.errorMessage);
	return data.payload || [];
};

const fetchSaleItems = async (): Promise<Item[]> => {
	const res = await fetch(`/api/brand/sales`);
	const data: GetProductsResponse = await res.json();
	if (data.hasError) throw new Error(data.errorMessage);
	return data.payload || [];
};

const fetchProduct = async (itemId: string): Promise<Item> => {
	const res = await fetch(`/api/products/${itemId}`);
	const data: ApiResponse<Item> = await res.json();
	if (data.hasError) throw new Error(data.errorMessage);
	return data.payload;
};

export const useProducts = (brandName?: string) => {
	return useQuery({
		queryKey: ["products", brandName],
		queryFn: () => fetchProducts(brandName),
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
