"use client";

import { UseFormReturn } from "react-hook-form";
import { IFormInputs } from "./AddProductForm";
import { Text } from "@/components/ui/primitives";

interface Props {
	form: UseFormReturn<IFormInputs>;
}

export function CollectionInput({ form }: Props) {
	const { register, setValue } = form;

	const formatInput = (str: string) =>
		str.replace(/[^a-zA-Z0-9-]+/g, "-").toLowerCase();

	return (
		<div className="space-y-2">
			<input
				autoComplete="off"
				placeholder="e.g. summer-drop"
				className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#58a076]/50 transition-all"
				{...register("collection", { required: true })}
				onChange={(event) => {
					setValue("collection", formatInput(event.target.value));
				}}
				onBlur={(event) => setValue("collection", formatInput(event.target.value))}
			/>
			<Text size="xs" color="text-slate-400">
				Will be added as a new collection after submit.
			</Text>
		</div>
	);
}
