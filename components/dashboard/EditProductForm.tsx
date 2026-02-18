"use client";

import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { ImagesUpload } from "./ImagesUpload";
import { BrandInput } from "./BrandInput";
import { DiscountInput } from "./DiscountInput";
import { ColorSizeInput } from "./ColorSizeInput";
import { PageInput } from "./PageInput";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { LiquidCard } from "@/components/ui/LiquidCard";
import { Item } from "@/types/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ChevronLeft, Trash2 } from "lucide-react";

export interface IFormInputs {
	title: string;
	pageId: string;
	brand: string;
	price: number;
	discount: number;
	discount_type: "dollar" | "percent";
	description: string;
	material: string;
	isPreorder: boolean;
	hidden: boolean;
	imageURLs: string;
	colorSizeArr: {
		color: string;
		sizes: { size: string; quantity: number }[];
	}[];
	payment_account_id: string;
}

export function EditProductForm({ product }: { product: Item }) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [paymentAccounts, setPaymentAccounts] = useState<{id: number, name: string}[]>([]);

	const form = useForm<IFormInputs>({
		defaultValues: {
			brand: product.name,
			pageId: product.page_id.toString(),
			title: product.title,
			price: product.price,
			discount: product.discount,
			discount_type: product.discount_type,
			material: product.material,
			description: product.description,
			imageURLs: product.images?.map(({ url }) => url).join("\n\n"),
			isPreorder: product.is_preorder !== 0,
			hidden: product.hidden !== 0,
			payment_account_id: product.payment_account_id?.toString() || "",
		},
	});

	useEffect(() => {
		const fetchAccounts = async () => {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/payment-accounts`, {
				headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
			});
			const data = await res.json();
			setPaymentAccounts(data || []);
		};
		fetchAccounts();
	}, []);

	const onSubmit: SubmitHandler<IFormInputs> = async (formData) => {
		try {
			setIsLoading(true);
			const body = {
				...formData,
				pageId: parseInt(formData.pageId),
				price: Number(formData.price),
				discount: Number(formData.discount || 0),
				imageURLs: formData.imageURLs.split("\n\n").map((url) => url.trim()),
				payment_account_id: parseInt(formData.payment_account_id),
				colorSizeArr: formData.colorSizeArr
					.filter(({ color }) => color.trim().length !== 0)
					.map((cs) => ({
						...cs,
						sizes: cs.sizes.filter((s) => s.quantity > 0),
					})),
			};

			const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/products/${product.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
				body: JSON.stringify(body),
			});

			if (!res.ok) throw new Error("Failed to update product");
			toast.success("Product updated successfully");
		} catch (error: any) {
			toast.error(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const deleteProduct = async () => {
		if (!confirm("Are you sure?")) return;
		try {
			await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/products/${product.id}`, {
				method: "DELETE",
				headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
			});
			toast.success("Product deleted");
			router.push("/dashboard/products");
		} catch (e) {
			toast.error("Delete failed");
		}
	};

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-6 pb-20">
			<Link href="/dashboard/products" className="flex items-center text-slate-400 hover:text-white transition-colors">
				<ChevronLeft className="w-4 h-4 mr-1" /> Back to Products
			</Link>
			
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-white">Edit Product</h1>
					<p className="text-sm text-slate-500">Editing: {product.title}</p>
				</div>
				<div className="flex gap-3">
					<LiquidButton variant="outline" className="text-red-500 border-red-500/20" onClick={deleteProduct}>
						<Trash2 className="w-4 h-4 mr-2" /> Delete
					</LiquidButton>
					<LiquidButton type="submit" disabled={isLoading}>
						{isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
					</LiquidButton>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="space-y-6">
					<LiquidCard className="p-6 space-y-4">
						<h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">Basic Info</h2>
						<div className="space-y-2">
							<label className="text-sm font-medium text-slate-400">Product Title*</label>
							<input {...form.register("title", { required: true })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<label className="text-sm font-medium text-slate-400">Price (THB)*</label>
								<input type="number" {...form.register("price", { required: true })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium text-slate-400">Brand*</label>
								<BrandInput form={form} />
							</div>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-slate-400">Linking Payment Account*</label>
							<select 
								{...form.register("payment_account_id", { required: true })}
								className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none"
							>
								<option value="" className="bg-slate-900">Select Account</option>
								{paymentAccounts.map(acc => (
									<option key={acc.id} value={acc.id} className="bg-slate-900">{acc.name}</option>
								))}
							</select>
						</div>
					</LiquidCard>
				</div>

				<div className="space-y-6">
					<LiquidCard className="p-6 space-y-4">
						<h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">Images & Variants</h2>
						<ImagesUpload form={form} />
						<div className="pt-4">
							<label className="text-sm font-medium text-slate-400 mb-2 block">Colors & Sizes</label>
							<ColorSizeInput form={form} />
						</div>
					</LiquidCard>
				</div>
			</div>
		</form>
	);
}