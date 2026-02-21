"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { ImagesUpload } from "./ImagesUpload";
import { BrandInput } from "./BrandInput";
import { ColorSizeInput } from "./ColorSizeInput";
import { PageInput } from "./PageInput";
import { Box, Card, Heading, Button, Stack, Grid, Text } from "@/components/ui/primitives";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useIntlayer, useLocale } from "next-intlayer";
import { usePaymentAccounts } from "@/hooks/useAdmin";
import { API_BASE_URL } from "@/lib/env";
import { normalizeLocale } from "@/lib/navigation";

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
	const t = useIntlayer("dashboard");
	const localeData = useLocale();
	const locale = normalizeLocale(localeData);
	const { data: paymentAccounts = [] } = usePaymentAccounts();

	const form = useForm<IFormInputs>({
		defaultValues: {
			discount_type: "dollar",
			brand: "",
		},
	});

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

			const res = await fetch(`${API_BASE_URL}/admin/products`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.errorMessage || t.failedToAdd.value);

			toast.success(t.productAdded.value);
			form.reset();
		} catch (error: any) {
			toast.error(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={form.handleSubmit(onSubmit)}>
			<Stack gap={6} className="max-w-4xl mx-auto pb-20">
				<Link href={`/${locale}/admin/products`} className="flex items-center text-slate-400 hover:text-white transition-colors text-sm font-bold">
					<ChevronLeft className="w-4 h-4 mr-1" /> {t.backToProducts.value}
				</Link>
				
				<Box className="flex justify-between items-center">
					<Heading level={1} size="3xl" color="text-white">{t.addProductTitle.value}</Heading>
					<Button type="submit" isLoading={isLoading}>
						{t.publishProduct.value}
					</Button>
				</Box>

				<Grid cols={1} className="md:grid-cols-2" gap={6}>
					<Stack gap={6}>
						<Card className="p-6">
							<Stack gap={4}>
								<Heading level={2} size="lg" color="text-white" className="border-b border-white/10 pb-2">
									{t.basicInfo.value}
								</Heading>
								<Stack gap={2}>
									<label className="text-sm font-medium text-slate-400">{t.productTitle.value}</label>
									<input 
										{...form.register("title", { required: true })} 
										className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#58a076]/50 transition-all" 
										placeholder={t.productTitlePlaceholder.value} 
									/>
								</Stack>
								<Grid cols={2} gap={4}>
									<Stack gap={2}>
										<label className="text-sm font-medium text-slate-400">{t.priceThb.value}</label>
										<input 
											type="number" 
											{...form.register("price", { required: true })} 
											className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#58a076]/50 transition-all" 
										/>
									</Stack>
									<Stack gap={2}>
										<label className="text-sm font-medium text-slate-400">{t.brand.value}</label>
										<BrandInput form={form} />
									</Stack>
								</Grid>
								<Stack gap={2}>
									<label className="text-sm font-medium text-slate-400">{t.paymentAccount.value}</label>
									<select 
										{...form.register("payment_account_id", { required: true })}
										className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#58a076]/50 appearance-none cursor-pointer"
									>
										<option value="" className="bg-[#0a2735]">{t.selectAccount.value}</option>
										{paymentAccounts.map((acc: { id: number; name: string }) => (
											<option key={acc.id} value={acc.id} className="bg-[#0a2735]">{acc.name}</option>
										))}
									</select>
								</Stack>
							</Stack>
						</Card>

						<Card className="p-6">
							<Stack gap={4}>
								<Heading level={2} size="lg" color="text-white" className="border-b border-white/10 pb-2">
									{t.inventoryLogic.value}
								</Heading>
								<Box className="flex gap-6">
									<label className="flex items-center gap-2 cursor-pointer group">
										<input type="checkbox" {...form.register("isPreorder")} className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#58a076] focus:ring-offset-0 focus:ring-0" />
										<Text size="sm" color="text-white" className="group-hover:text-[#58a076] transition-colors">{t.preorderItem.value}</Text>
									</label>
									<label className="flex items-center gap-2 cursor-pointer group">
										<input type="checkbox" {...form.register("hidden")} className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#58a076] focus:ring-offset-0 focus:ring-0" />
										<Text size="sm" color="text-white" className="group-hover:text-[#58a076] transition-colors">{t.hidden.value}</Text>
									</label>
								</Box>
								<Stack gap={2}>
									<label className="text-sm font-medium text-slate-400">{t.pageLocation.value}</label>
									<PageInput form={form} />
								</Stack>
							</Stack>
						</Card>
					</Stack>

					<Stack gap={6}>
						<Card className="p-6">
							<Stack gap={4}>
								<Heading level={2} size="lg" color="text-white" className="border-b border-white/10 pb-2">
									{t.imagesVariants.value}
								</Heading>
								<ImagesUpload form={form} />
								<Stack gap={2} className="pt-4">
									<label className="text-sm font-medium text-slate-400">{t.colorsSizes.value}</label>
									<ColorSizeInput form={form} />
								</Stack>
							</Stack>
						</Card>
					</Stack>
				</Grid>
			</Stack>
		</form>
	);
}
