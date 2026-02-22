"use client";

import { useQuery } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { IFormInputs } from "./AddProductForm";
import { MenuItem } from "@/types/types";
import { API_BASE_URL } from "@/lib/env";
import { Input, Text } from "@/components/ui/primitives";

interface Props {
	form: UseFormReturn<IFormInputs>;
}

export function PageInput({ form }: Props) {
	const { register } = form;
	const { data } = useQuery<
		any,
		any,
		{
			errorMessage: string;
			hasError: boolean;
			metadata: null | {
				[key: string]: any;
			};
			payload: MenuItem[] | null;
		},
		any
	>({
		queryKey: ["pages"],
		queryFn: async () => {
			const res = await fetch(`${API_BASE_URL}/page`);
			const data = await res.json();
			if (!res.ok || data?.hasError) {
				return {
					hasError: true,
					errorMessage: data?.errorMessage || "Failed to load pages",
					metadata: null,
					payload: null,
				};
			}
			return data;
		},
	});

	const pages = Array.isArray(data?.payload) ? data.payload : [];
	const hasQueryError = data?.hasError;

	if (!data)
		return (
			<Input
				readOnly={true}
				autoComplete="off"
				placeholder="Loading..."
				className="w-full"
			/>
		);

	return (
		<div className="space-y-2">
			<Text size="xs" weight="bold" color="text-slate-500" uppercase tracking="widest" className="block">
				Page Location <span className="text-slate-600">(Optional)</span>
			</Text>
			<select
				className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#58a076]/50"
				{...register("pageId")}
				defaultValue=""
			>
				<option value="" className="bg-[#0a2735]">
					{hasQueryError
						? "Unable to load pages"
						: pages.length === 0
						? "No pages available"
						: "No page (use in pages config)"}
				</option>
				{pages.map(({ slug, ID, text, is_permanent }) =>
					is_permanent === 1 ? null : (
						<option value={ID} key={ID} className="bg-[#0a2735]">
							{text} {`</${slug}>`}
						</option>
					)
				)}
			</select>
		</div>
	);
}
