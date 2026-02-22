"use client";

import { MenuItem } from "@/types/types";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/env";
import { Button, Card, Stack, Text } from "@/components/ui/primitives";

interface IFormInputs {
	slug: string;
	text: string;
}
export function EditPage({
	menuItem,
	toggleEditPage,
	refetch,
}: {
	menuItem: MenuItem;
	toggleEditPage: () => void;
	refetch: () => void;
}) {
	const {
		watch,
		register,
		formState: { errors },
		handleSubmit,
		setValue,
	} = useForm<IFormInputs>({
		defaultValues: {
			text: menuItem.text,
			slug: menuItem.slug,
		},
	});

	const onSubmit: SubmitHandler<IFormInputs> = async (formData, event) => {
		try {
			event?.preventDefault();
			formData.slug = formatInput(formData.slug);
			setValue("slug", formData.slug);
			const res = await fetch(`${API_BASE_URL}/admin/pages/${menuItem.ID}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (data.hasError) throw new Error(data.errorMessage);
			toast.success("Edit page successfully");
			toggleEditPage();
			refetch();
		} catch (err: any) {
			toast.error(err.message || "Error adding new page");
		}
	};

	const formatInput = (str: string) =>
		str.replace(/[^a-zA-Z0-9-]+/g, "-").toLowerCase();

	return (
		<>
			<div
				className="fixed inset-0 z-10 bg-black/40 backdrop-blur-sm"
				onClick={toggleEditPage}
			/>

			<div className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none">
				<Card className="max-w-[400px] w-full mx-4 p-6 pointer-events-auto">
					<form onSubmit={handleSubmit(onSubmit)}>
						<Text
							size="2xl"
							weight="bold"
							color="text-white"
							className="block pb-8"
						>
							Edit Page
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
									onBlur={() =>
										setValue("slug", formatInput(watch("slug")))
									}
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
								onClick={toggleEditPage}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								variant="primary"
								size="md"
							>
								Save
							</Button>
						</div>
					</form>
				</Card>
			</div>
		</>
	);
}
