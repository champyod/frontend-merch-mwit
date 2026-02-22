"use client";

import { MenuItem } from "@/types/types";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/env";
import { Button, Card, Stack, Text, Input } from "@/components/ui/primitives";

interface IFormInputs {
	slug: string;
	text: string;
}

export function AddPage({ addPage }: { addPage: (newPage: MenuItem) => void }) {
	const [isOpen, setIsOpen] = useState(false);
	const {
		watch,
		register,
		formState: { errors },
		handleSubmit,
		reset,
		setValue,
	} = useForm<IFormInputs>();

	if (!isOpen)
		return (
			<Button
				variant="primary"
				size="md"
				className="w-full"
				onClick={() => setIsOpen(true)}
			>
				+ Add Page
			</Button>
		);

	const onSubmit: SubmitHandler<IFormInputs> = async (formData, event) => {
		try {
			event?.preventDefault();
			formData.slug = formatInput(formData.slug);
			setValue("slug", formData.slug);
			let res = await fetch(`${API_BASE_URL}/admin/pages`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (data.hasError) throw new Error(data.errorMessage);

			toast.success("Add new page successfully");
			addPage({
				ID: data.payload.ID,
				order: data.payload.order,
				slug: formData.slug,
				text: formData.text,
				is_permanent: 0,
			});
			reset();
			setIsOpen(false);
		} catch (err: any) {
			toast.error(err.message || "Error adding new page");
		}
	};

	const formatInput = (str: string) =>
		str.replace(/[^a-zA-Z0-9-]+/g, "-").toLowerCase();

	return (
		<Card className="p-6 mb-10">
			<form onSubmit={handleSubmit(onSubmit)}>
				<Text size="lg" weight="bold" color="text-white" className="block pb-6">
					Add new page
				</Text>

				<Stack gap={4} className="mb-6">
					<div>
						<label className="text-sm font-medium text-white block pb-2">
							Text*
						</label>
						<input
							autoComplete="off"
							placeholder="Page title"
							className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#58a076]/50 transition-all placeholder:text-slate-600"
							{...register("text", { required: true })}
						/>
						{errors.text && (
							<Text size="xs" color="text-red-500" className="pt-1">
								Text is required
							</Text>
						)}
					</div>

					<div>
						<label className="text-sm font-medium text-white block pb-2">
							Slug*
						</label>
						<Text size="xs" color="text-slate-400" className="pb-2">
							The path of the URL. Eg: {!watch("slug") ? "/<slug>" : `/${watch("slug")}`}
						</Text>
						<input
							autoComplete="off"
							placeholder="slug"
							className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#58a076]/50 transition-all placeholder:text-slate-600"
							{...register("slug", { required: true })}
							onBlur={() => setValue("slug", formatInput(watch("slug")))}
						/>
						{errors.slug && (
							<Text size="xs" color="text-red-500" className="pt-1">
								Slug is required
							</Text>
						)}
					</div>
				</Stack>

				<div className="flex gap-3 justify-end">
					<Button
						type="button"
						variant="ghost"
						size="md"
						onClick={() => {
							reset();
							setIsOpen(false);
						}}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						variant="primary"
						size="md"
					>
						Add
					</Button>
				</div>
			</form>
		</Card>
	);
}
