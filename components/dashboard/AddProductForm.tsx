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
import Link from "next/link";
import { Loader2, ChevronLeft } from "lucide-react";

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

export function AddProductForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [paymentAccounts, setPaymentAccounts] = useState<{id: number, name: string}[]>([]);

	const form = useForm<IFormInputs>({
		defaultValues: {
			discount_type: "dollar",
			brand: "",
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

			const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/products`, {
				method: "POST",
				headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
				body: JSON.stringify(body),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.errorMessage || "Failed to add product");

			toast.success("Product added successfully");
			form.reset();
		} catch (error: any) {
			toast.error(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const salePrice =
		form.watch("discount_type") === "dollar"
			? form.watch("price") - form.watch("discount")
			: form.watch("price") - (form.watch("discount") / 100) * form.watch("price");

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-6 pb-20">
			<Link href="/dashboard/products" className="flex items-center text-slate-400 hover:text-white transition-colors">
				<ChevronLeft className="w-4 h-4 mr-1" /> Back to Products
			</Link>
			
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold text-white">Add New Product</h1>
				<LiquidButton type="submit" disabled={isLoading}>
					{isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Publish Product"}
				</LiquidButton>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="space-y-6">
					<LiquidCard className="p-6 space-y-4">
						<h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">Basic Info</h2>
						<div className="space-y-2">
							<label className="text-sm font-medium text-slate-400">Product Title*</label>
							<input {...form.register("title", { required: true })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50" placeholder="e.g. 2026 Anniversary Tee" />
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

					<LiquidCard className="p-6 space-y-4">
						<h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">Inventory & Logic</h2>
						<div className="flex gap-6">
							<label className="flex items-center gap-2 cursor-pointer">
								<input type="checkbox" {...form.register("isPreorder")} className="w-4 h-4 rounded border-white/10 bg-white/5 text-emerald-500" />
								<span className="text-sm text-white">Pre-order Item</span>
							</label>
							<label className="flex items-center gap-2 cursor-pointer">
								<input type="checkbox" {...form.register("hidden")} className="w-4 h-4 rounded border-white/10 bg-white/5 text-emerald-500" />
								<span className="text-sm text-white">Hidden</span>
							</label>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-slate-400">Choose Page Location</label>
							<PageInput form={form} />
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