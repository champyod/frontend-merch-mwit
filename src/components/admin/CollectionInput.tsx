"use client";

import { useQuery } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { IFormInputs } from "./AddProductForm";
import { API_BASE_URL } from "@/lib/env";
import { useCollections } from "@/hooks/useAdmin";

type GetBrandResponse = {
	errorMessage: string;
	hasError: boolean;
	metadata: null | {
		[key: string]: any;
	};
	payload: { name: string }[];
};
interface Props {
	form: UseFormReturn<IFormInputs>;
}

export function CollectionInput({ form }: Props) {
	const { register, setValue, watch } = form;
	const [inputText, setInputText] = useState("");
	const [selectValue, setSelectValue] = useState("");

	const { data } = useCollections();

	if (!data)
		return (
			<input
				readOnly={true}
				autoComplete="off"
				placeholder="Loading..."
				id="collection"
				className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white"
			/>
		);

	const collectionArr =
		inputText.length === 0
			? data
			: data.filter(({ name }: { name: string }) => {
					const removeNonLetters = (str: string) =>
						str.replace(/[^a-zA-Z]/g, "");
					const removeSpaces = (str: string) =>
						str.replace(/\s/g, "");

					return removeSpaces(
						removeNonLetters(name.toLowerCase())
					).includes(
						removeSpaces(removeNonLetters(inputText.toLowerCase()))
					);
			  });

	const formatInput = (str: string) =>
		str.replace(/[^a-zA-Z0-9-]+/g, "-").toLowerCase();

	return (
		<>
			<input
				autoComplete="off"
				placeholder="Type to filter"
				id="collection"
				className="w-full bg-white/5 border-x border-t border-white/10 rounded-t-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#58a076]/50 transition-all outline-none"
				{...register("collection", { required: true })}
				onChange={(event) => {
					setInputText(formatInput(event.target.value));
					setSelectValue("");
				}}
				onBlur={() => setValue("collection", formatInput(inputText))}
			/>
			<select
				onChange={(event) => setValue("collection", event.target.value)}
				id="collection"
				className="w-full bg-white/5 border-x border-b border-white/10 rounded-b-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#58a076]/50 appearance-none cursor-pointer outline-none mb-2"
				value={selectValue}
			>
				<option value={""} disabled={true} className="bg-[#0a2735]">
					{collectionArr.length !== 0
						? `Suggestions (${collectionArr.length})`
						: `${(inputText || watch("collection")).slice(
								0,
								5
						  )}... will be added after submit`}
				</option>
				{collectionArr.map(({ name }: { name: string }) => (
					<option value={name} key={name} className="bg-[#0a2735]">
						{name}
					</option>
				))}
			</select>
		</>
	);
}
