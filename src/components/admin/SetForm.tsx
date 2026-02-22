"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAdminProductsForSet, useCreateSet, useDisableSet, useUpdateSet, AdminSet } from "@/hooks/useAdmin";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import {
	Box,
	Card,
	Heading,
	Button,
	Stack,
	Grid,
	Text,
	Input,
	TextArea, // Corrected from Textarea
} from "@/components/ui/primitives";
import { useIntlayer, useLocale } from "next-intlayer";
import { API_BASE_URL } from "@/lib/env";
import { normalizeLocale } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { SearchableSelect } from "@/components/ui/SearchableSelect";

type SetFormProps = {
	mode: "create" | "edit";
	initialSet?: AdminSet;
};

export default function SetForm({ mode, initialSet }: SetFormProps) {
	const router = useRouter();
	const t = useIntlayer("admin");
	const localeData = useLocale();
	const locale = normalizeLocale(localeData);

	const { data: products = [] } = useAdminProductsForSet();
	const { data: paymentMethods = [] } = usePaymentMethods(true); // Fetch only active payment methods
	const createMutation = useCreateSet();
	const updateMutation = useUpdateSet();
	const disableMutation = useDisableSet();

	const normalizedImages = useMemo(() => {
		if (!initialSet?.images) return "";
		return initialSet.images
			.map((image) => image.url || image.URL)
			.filter(Boolean)
			.join("\n");
	}, [initialSet]);

	const [title, setTitle] = useState(initialSet?.title || "");
	const [description, setDescription] = useState(initialSet?.description || "");
	const [price, setPrice] = useState<number>(initialSet?.price || 0);
	const [isPreorder, setIsPreorder] = useState((initialSet?.is_preorder || 0) === 1);
	const [hidden, setHidden] = useState((initialSet?.hidden || 0) === 1);
	const [enabled, setEnabled] = useState((initialSet?.enabled ?? 1) === 1);
	const [paymentAccountId, setPaymentAccountId] = useState<number>(initialSet?.payment_account_id || 0);
	const [imageURLs, setImageURLs] = useState(normalizedImages);
	const [isUploadingImages, setIsUploadingImages] = useState(false);
	const [selectedItems, setSelectedItems] = useState<Record<number, number>>(() => {
		const acc: Record<number, number> = {};
		initialSet?.items?.forEach((setItem) => {
			acc[setItem.item_id] = setItem.quantity;
		});
		return acc;
	});

	const isSaving = createMutation.isPending || updateMutation.isPending;

	const toggleItem = (itemId: number) => {
		setSelectedItems((prev) => {
			if (prev[itemId]) {
				const clone = { ...prev };
				delete clone[itemId];
				return clone;
			}
			return { ...prev, [itemId]: 1 };
		});
	};

	const updateQty = (itemId: number, quantity: number) => {
		setSelectedItems((prev) => ({ ...prev, [itemId]: Math.max(1, quantity || 1) }));
	};

	const submit = async () => {
		const items = Object.entries(selectedItems).map(([item_id, quantity]) => ({
			item_id: Number(item_id),
			quantity,
		}));

		if (!title.trim()) return toast.error(t.setTitleRequired.value);
		if (price <= 0) return toast.error(t.setPriceRequired.value);
		if (paymentAccountId <= 0) return toast.error(t.selectPaymentAccountRequired.value);
		if (items.length === 0) return toast.error(t.selectProductRequired.value);

		const payload = {
			title: title.trim(),
			description: description.trim(),
			price,
			is_preorder: isPreorder,
			hidden,
			enabled,
			payment_account_id: paymentAccountId,
			image_urls: imageURLs
				.split("\n")
				.map((url) => url.trim())
				.filter(Boolean),
			items,
		};

		try {
			if (mode === "create") {
				await createMutation.mutateAsync(payload);
				toast.success(t.setCreated.value);
			} else if (initialSet) {
				await updateMutation.mutateAsync({ id: initialSet.id, payload });
				toast.success(t.setUpdated.value);
			}
			router.push(`/${locale}/admin/sets`);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : t.saveFailed.value);
		}
	};

	const disable = async () => {
		if (!initialSet) return;
		if (!confirm(t.disableSetConfirm.value)) return;
		try {
			await disableMutation.mutateAsync(initialSet.id);
			toast.success(t.setDisabled.value);
			router.push(`/${locale}/admin/sets`);
		} catch {
			toast.error(t.disableFailed.value);
		}
	};

	const uploadImages = async (files: FileList | null) => {
		if (!files || files.length === 0) return;
		try {
			setIsUploadingImages(true);
			const uploadedURLs: string[] = [];
			for (const file of Array.from(files)) {
				const formData = new FormData();
				formData.append("file", file);
				const response = await fetch(`${API_BASE_URL}/admin/upload`, {
					method: "POST",
					body: formData,
				});
				const data = await response.json();
				if (!response.ok || data?.hasError || !data?.payload?.url) {
					throw new Error(data?.errorMessage || t.uploadFailed.value);
				}
				uploadedURLs.push(data.payload.url);
			}

			setImageURLs((current) => {
				const existing = current
					.split("\n")
					.map((url) => url.trim())
					.filter(Boolean);
				return [...existing, ...uploadedURLs].join("\n");
			});
			toast.success(`${uploadedURLs.length} ${t.imagesUploaded.value}`);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : t.uploadFailed.value);
		} finally {
			setIsUploadingImages(false);
		}
	};

	return (
		<Stack gap={6} className="max-w-5xl mx-auto pb-20">
			<Link href={`/${locale}/admin/sets`} className="flex items-center text-slate-400 hover:text-white transition-colors text-sm font-bold">
				<ChevronLeft className="w-4 h-4 mr-1" /> {t.backToSets.value}
			</Link>

			<Box className="flex flex-col md:flex-row md:items-center justify-between gap-3">
				<Heading level={1} size="3xl" color="text-white">
					{mode === "create" ? t.createSet.value : t.editSet.value}
				</Heading>
				<Box className="flex gap-3">
					{mode === "edit" && (
						<Button variant="danger" size="md" onClick={disable}>
							{t.disable.value}
						</Button>
					)}
					<Button onClick={submit} isLoading={isSaving}>
						{t.save.value}
					</Button>
				</Box>
			</Box>

			<Grid cols={1} className="lg:grid-cols-2" gap={6}>
				<Card className="p-6">
					<Stack gap={4}>
						<Heading level={2} size="lg" color="text-white" className="border-b border-white/10 pb-2">
							{t.basicInfo.value}
						</Heading>
						<Stack gap={2}>
							<label htmlFor="set-title" className="text-sm font-medium text-slate-400">
								{t.title.value}
							</label>
							<Input
								id="set-title"
								value={title}
								onChange={(event) => setTitle(event.target.value)}
								className="mt-1"
							/>
						</Stack>
						<Stack gap={2}>
							<label htmlFor="set-description" className="text-sm font-medium text-slate-400">
								{t.description.value}
							</label>
						<TextArea
								id="set-description"
								value={description}
								onChange={(event) => setDescription(event.target.value)}
								className="mt-1 min-h-28"
							/>
						</Stack>
						<Grid cols={2} gap={3}>
							<Stack gap={2}>
								<label htmlFor="set-price" className="text-sm font-medium text-slate-400">
									{t.price.value}
								</label>
								<Input
									id="set-price"
									type="number"
									value={price}
									onChange={(event) => setPrice(Number(event.target.value || 0))}
									className="mt-1"
								/>
							</Stack>
							<Stack gap={2}>
								<label htmlFor="set-payment-account" className="text-sm font-medium text-slate-400">
									{t.paymentAccount.value}
								</label>
								<SearchableSelect
									options={paymentMethods.map(method => ({ value: method.id, label: method.name }))}
									value={paymentAccountId}
									onValueChange={(value) => setPaymentAccountId(value as number)}
									placeholder={t.selectAccount.value}
									noResultsText={t.noPaymentMethodFound.value}
									searchPlaceholder={t.searchPaymentMethods.value}
								/>
							</Stack>
						</Grid>
						<Box className="flex gap-5">
							<label className="flex items-center gap-2 cursor-pointer group">
								<input
									type="checkbox"
									checked={isPreorder}
									onChange={(event) => setIsPreorder(event.target.checked)}
									className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#58a076] focus:ring-offset-0 focus:ring-0"
								/>
								<Text size="sm" color="text-white" className="group-hover:text-[#58a076] transition-colors">
									{t.preorder.value}
								</Text>
							</label>
							<label className="flex items-center gap-2 cursor-pointer group">
								<input
									type="checkbox"
									checked={hidden}
									onChange={(event) => setHidden(event.target.checked)}
									className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#58a076] focus:ring-offset-0 focus:ring-0"
								/>
								<Text size="sm" color="text-white" className="group-hover:text-[#58a076] transition-colors">
									{t.hidden.value}
								</Text>
							</label>
							<label className="flex items-center gap-2 cursor-pointer group">
								<input
									type="checkbox"
									checked={enabled}
									onChange={(event) => setEnabled(event.target.checked)}
									className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#58a076] focus:ring-offset-0 focus:ring-0"
								/>
								<Text size="sm" color="text-white" className="group-hover:text-[#58a076] transition-colors">
									{t.enabled.value}
								</Text>
							</label>
						</Box>
						<Stack gap={2}>
							<label htmlFor="set-image-urls" className="text-sm font-medium text-slate-400">
								{t.imageURLs.value}
							</label>
							<Box className="mt-2 mb-2">
								<input
									title={t.uploadSetImages.value}
									type="file"
									multiple
									onChange={(event) => uploadImages(event.target.files)}
									className="block w-full text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-white hover:file:bg-white/20"
									disabled={isUploadingImages}
								/>
								{isUploadingImages && (
									<Text size="xs" color="text-slate-400" className="mt-1">
										<Loader2 className="inline-block h-3 w-3 animate-spin mr-1" /> {t.uploadingImages.value}
									</Text>
								)}
							</Box>
							<TextArea
								id="set-image-urls"
								value={imageURLs}
								onChange={(event) => setImageURLs(event.target.value)}
								className="mt-1 min-h-24"
							/>
						</Stack>
					</Stack>
				</Card>

				<Card className="p-6">
					<Stack gap={4}>
						<Heading level={2} size="lg" color="text-white" className="border-b border-white/10 pb-2">
							{t.setComposition.value}
						</Heading>
						<Box className="max-h-125 overflow-y-auto space-y-2 pr-2">
							{products.map((product) => {
								const selected = selectedItems[product.id] !== undefined;
								return (
									<Box
										key={product.id}
										className={cn(
											"rounded-xl p-3 border",
											selected ? "border-emerald-500/50 bg-emerald-500/5" : "border-white/10"
										)}
									>
										<Box className="flex items-center justify-between gap-3">
											<label className="flex items-center gap-2 text-sm text-white cursor-pointer">
												<input
													type="checkbox"
													checked={selected}
													onChange={() => toggleItem(product.id)}
													className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#58a076] focus:ring-offset-0 focus:ring-0"
												/>
												<Text>{product.title}</Text>
											</label>
											{selected && (
												<Input
													title={t.quantity.value}
													type="number"
													min={1}
													value={selectedItems[product.id]}
													onChange={(event) => updateQty(product.id, Number(event.target.value || 1))}
													className="w-20 p-2 text-sm"
												/>
											)}
										</Box>
									</Box>
								);
							})}
						</Box>
					</Stack>
				</Card>
			</Grid>
		</Stack>
	);
}
