"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { useAdminProductsForSet, useCreateSet, useDisableSet, usePaymentAccounts, useUpdateSet, AdminSet } from "@/hooks/useAdmin";
import { API_BASE_URL } from "@/lib/env";

type SetFormProps = {
	mode: "create" | "edit";
	initialSet?: AdminSet;
	locale: "th" | "en";
};

export default function SetForm({ mode, initialSet, locale }: SetFormProps) {
	const router = useRouter();
	const { data: products = [] } = useAdminProductsForSet();
	const { data: paymentAccounts = [] } = usePaymentAccounts();
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

		if (!title.trim()) return toast.error("Set title is required");
		if (price <= 0) return toast.error("Set price must be greater than 0");
		if (paymentAccountId <= 0) return toast.error("Please select a payment account");
		if (items.length === 0) return toast.error("Please select at least one product");

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
				toast.success("Set created");
			} else if (initialSet) {
				await updateMutation.mutateAsync({ id: initialSet.id, payload });
				toast.success("Set updated");
			}
			router.push(`/${locale}/admin/sets`);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Save failed");
		}
	};

	const disable = async () => {
		if (!initialSet) return;
		if (!confirm("Disable this set?")) return;
		try {
			await disableMutation.mutateAsync(initialSet.id);
			toast.success("Set disabled");
			router.push(`/${locale}/admin/sets`);
		} catch {
			toast.error("Disable failed");
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
					throw new Error(data?.errorMessage || "Image upload failed");
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
			toast.success(`${uploadedURLs.length} image(s) uploaded`);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Upload failed");
		} finally {
			setIsUploadingImages(false);
		}
	};

	return (
		<div className="max-w-5xl mx-auto pb-20 space-y-6">
			<Link href={`/${locale}/admin/sets`} className="flex items-center text-slate-400 hover:text-white transition-colors text-sm font-bold">
				<ChevronLeft className="w-4 h-4 mr-1" /> Back to sets
			</Link>

			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
				<h1 className="text-3xl font-bold text-white">{mode === "create" ? "Create Set" : "Edit Set"}</h1>
				<div className="flex gap-2">
					{mode === "edit" && (
						<button onClick={disable} className="px-4 py-2 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-all" type="button">
							Disable
						</button>
					)}
					<button onClick={submit} disabled={isSaving} className="px-4 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-400 transition-all disabled:opacity-60" type="button">
						{isSaving ? "Saving..." : "Save"}
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
					<div>
						<label htmlFor="set-title" className="text-sm text-slate-400">Title</label>
						<input id="set-title" value={title} onChange={(event) => setTitle(event.target.value)} className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" />
					</div>
					<div>
						<label htmlFor="set-description" className="text-sm text-slate-400">Description</label>
						<textarea id="set-description" value={description} onChange={(event) => setDescription(event.target.value)} className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white min-h-28" />
					</div>
					<div className="grid grid-cols-2 gap-3">
						<div>
							<label htmlFor="set-price" className="text-sm text-slate-400">Price</label>
							<input id="set-price" type="number" value={price} onChange={(event) => setPrice(Number(event.target.value || 0))} className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" />
						</div>
						<div>
							<label htmlFor="set-payment-account" className="text-sm text-slate-400">Payment account</label>
							<select id="set-payment-account" value={paymentAccountId} onChange={(event) => setPaymentAccountId(Number(event.target.value || 0))} className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white">
								<option value={0}>Select account</option>
								{paymentAccounts.map((account) => (
									<option key={account.id} value={account.id}>{account.name}</option>
								))}
							</select>
						</div>
					</div>
					<div className="flex gap-5">
						<label className="text-sm text-white flex items-center gap-2"><input type="checkbox" checked={isPreorder} onChange={(event) => setIsPreorder(event.target.checked)} /> Pre-order</label>
						<label className="text-sm text-white flex items-center gap-2"><input type="checkbox" checked={hidden} onChange={(event) => setHidden(event.target.checked)} /> Hidden</label>
						<label className="text-sm text-white flex items-center gap-2"><input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} /> Enabled</label>
					</div>
					<div>
						<label htmlFor="set-image-urls" className="text-sm text-slate-400">Image URLs (one per line)</label>
						<div className="mt-2 mb-2">
							<input
								title="Upload set images"
								type="file"
								multiple
								onChange={(event) => uploadImages(event.target.files)}
								className="block w-full text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-white hover:file:bg-white/20"
								disabled={isUploadingImages}
							/>
							{isUploadingImages && <p className="text-xs text-slate-400 mt-1">Uploading images...</p>}
						</div>
						<textarea id="set-image-urls" value={imageURLs} onChange={(event) => setImageURLs(event.target.value)} className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white min-h-24" />
					</div>
				</div>

				<div className="bg-white/5 border border-white/10 rounded-2xl p-4">
					<h2 className="text-xl font-bold text-white mb-3">Set Composition</h2>
					<div className="max-h-125 overflow-auto space-y-2 pr-2">
						{products.map((product) => {
							const selected = selectedItems[product.id] !== undefined;
							return (
								<div key={product.id} className={`rounded-xl p-3 border ${selected ? "border-emerald-500/50 bg-emerald-500/5" : "border-white/10"}`}>
									<div className="flex items-center justify-between gap-3">
										<label className="flex items-center gap-2 text-sm text-white cursor-pointer">
											<input type="checkbox" checked={selected} onChange={() => toggleItem(product.id)} />
											<span>{product.title}</span>
										</label>
										{selected && (
											<input title="Quantity" type="number" min={1} value={selectedItems[product.id]} onChange={(event) => updateQty(product.id, Number(event.target.value || 1))} className="w-20 bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm" />
										)}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
