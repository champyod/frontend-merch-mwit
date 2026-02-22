"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { ImagesUpload } from "./ImagesUpload";
import { CollectionInput } from "./CollectionInput";
import { ColorSizeInput } from "./ColorSizeInput";
import { PageInput } from "./PageInput";
import { Box, Card, Heading, Button, Stack, Grid, Text, Checkbox } from "@/components/ui/primitives";
import { Item } from "@/types/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Trash2 } from "lucide-react";
import { useIntlayer, useLocale } from "next-intlayer";
import { usePaymentMethods } from "@/hooks/usePaymentMethods"; // Use our new hook
import { API_BASE_URL } from "@/lib/env";
import { navigateWithLocale } from "@/lib/navigation";
import { SearchableSelect } from "@/components/ui/SearchableSelect"; // Import SearchableSelect

export interface IFormInputs {
	title: string;
	pageId: string;
	collection: string;
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
	payment_account_id: number; // Change type to number
}

const normalizeLocale = (value: unknown): "th" | "en" => {
	if (value === "en") return "en";
	if (value === "th") return "th";
	return "th";
};

export function EditProductForm({ product }: { product: Item }) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const t = useIntlayer("admin");
	const localeData = useLocale();
	const locale = normalizeLocale(
		typeof localeData === "string"
			? localeData
			: (localeData as { locale?: string } | undefined)?.locale
	);
	const { data: paymentMethods = [] } = usePaymentMethods(true); // Fetch only active payment methods

	const form = useForm<IFormInputs>({
		defaultValues: {
			collection: product.name,
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
			payment_account_id: product.payment_account_id || 0, // Set to 0 if null/undefined
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
				payment_account_id: formData.payment_account_id, // Already a number
				colorSizeArr: formData.colorSizeArr
					.filter(({ color }) => color.trim().length !== 0)
					.map((cs) => ({
						...cs,
						sizes: cs.sizes.filter((s) => s.quantity > 0),
					})),
			};

			const res = await fetch(`${API_BASE_URL}/admin/products/${product.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			if (!res.ok) throw new Error(t.failedToUpdate.value);
			toast.success(t.productUpdated.value);
		} catch (error: any) {
			toast.error(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const deleteProduct = async () => {
		if (!confirm(t.deleteConfirm.value)) return;
		try {
			await fetch(`${API_BASE_URL}/admin/products/${product.id}`, {
				method: "DELETE",
			});
			toast.success(t.productDeleted.value);
			navigateWithLocale(router, locale, "/admin/products");
		} catch (e) {
			toast.error("Delete failed");
		}
	};

	return (
		<form onSubmit={form.handleSubmit(onSubmit)}>
			<Stack gap={6} className="max-w-4xl mx-auto pb-20">
				<Link href={`/${locale}/admin/products`} className="flex items-center text-slate-400 hover:text-white transition-colors text-sm font-bold">
					<ChevronLeft className="w-4 h-4 mr-1" /> {t.backToProducts.value}
				</Link>
				
				<Box className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
					<Box>
						<Heading level={1} size="3xl" color="text-white">{t.editProductTitle.value}</Heading>
						<Text size="sm" color="text-slate-500">{t.editing.value} {product.title}</Text>
					</Box>
					<Box className="flex gap-3">
						<Button variant="danger" size="md" onClick={deleteProduct}>
							<Trash2 className="w-4 h-4 mr-2" /> {t.delete.value}
						</Button>
						<Button type="submit" isLoading={isLoading}>
							{t.saveChanges.value}
						</Button>
					</Box>
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
									/>
								</Stack>
								<Grid cols={2} gap={4}>
									<Stack gap={2}>
										<label className="text-sm font-medium text-slate-400">{t.priceThb.value}</label>
										<input 
											type="number" 
											min={0.01}
											step={0.01}
											{...form.register("price", { required: true, valueAsNumber: true, min: 0.01 })} 
											className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#58a076]/50 transition-all" 
										/>
									</Stack>
									<Stack gap={2}>
										<label className="text-sm font-medium text-slate-400">{t.collection.value}</label>
										<CollectionInput form={form} />
									</Stack>
								</Grid>
								<Stack gap={2}>
									<label className="text-sm font-medium text-slate-400">{t.paymentAccount.value}</label>
									<SearchableSelect
										options={paymentMethods.map(method => ({ value: method.id, label: method.name }))}
										value={form.watch("payment_account_id")}
										onValueChange={(value) => form.setValue("payment_account_id", value as number)}
										placeholder={t.selectAccount.value}
										noResultsText={t.noPaymentMethodFound.value} // Assuming this key exists
										searchPlaceholder={t.searchPaymentMethods.value} // Assuming this key exists
									/>
								</Stack>
							</Stack>
						</Card>

						<Card className="p-6">
							<Stack gap={4}>
								<Heading level={2} size="lg" color="text-white" className="border-b border-white/10 pb-2">
									{t.inventoryLogic.value}
								</Heading>
								<Box className="flex gap-6">
									<Checkbox label={t.preorderItem.value} {...form.register("isPreorder")} />
									<Checkbox label={t.hidden.value} {...form.register("hidden")} />
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
