"use client";

import { EditProductForm } from "@/components/admin/EditProductForm";
import Loader from "@/components/ui/Loader";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { API_BASE_URL } from "@/lib/env";

export default function EditItemPage({ params }: { params: Promise<{ itemId: string }> }) {
	const { itemId } = use(params);

	const {
		data: product,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["editProduct", itemId],
		queryFn: async () => {
			const response = await fetch(`${API_BASE_URL}/admin/products/${itemId}`);
			return await response.json();
		},
		select: (productResponse) => productResponse.payload,
	});

	if (isLoading) return <Loader />;
	if (error) return <>Error loading item.</>;
	if (!product) return <>Product not found.</>;
	return <EditProductForm product={product} />;
}
