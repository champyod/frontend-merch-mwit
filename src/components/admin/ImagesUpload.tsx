import { UseFormReturn } from "react-hook-form";
import { IFormInputs } from "./AddProductForm";
import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon, Plus } from "lucide-react";
import { Box, Button, Text, Stack, Flex, Grid, Badge } from "@/components/ui/primitives";
import { API_BASE_URL } from "@/lib/env";
import { toast } from "sonner";
import Image from "next/image";

export function ImagesUpload({ form }: { form: UseFormReturn<IFormInputs> }) {
	const {
		setValue,
		watch,
	} = form;

	const [isUploading, setIsUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const imageURLs = watch("imageURLs") || "";
	const imageArr = imageURLs.split("\n\n").filter(url => url.trim() !== "");

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		setIsUploading(true);
		const newUrls: string[] = [];

		try {
			for (let i = 0; i < files.length; i++) {
				const formData = new FormData();
				formData.append("file", files[i]);

				const res = await fetch(`${API_BASE_URL}/admin/upload`, {
					method: "POST",
					body: formData,
				});

				const data = await res.json();
				if (!res.ok) throw new Error(data.errorMessage || "Upload failed");
				
				newUrls.push(data.payload.url);
			}

			const currentUrls = imageURLs.trim();
			const combinedUrls = currentUrls 
				? `${currentUrls}\n\n${newUrls.join("\n\n")}`
				: newUrls.join("\n\n");
			
			setValue("imageURLs", combinedUrls);
			toast.success(`Successfully uploaded ${files.length} image(s)`);
		} catch (error: any) {
			toast.error(error.message);
		} finally {
			setIsUploading(false);
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	};

	const removeImage = (index: number) => {
		const updatedArr = [...imageArr];
		updatedArr.splice(index, 1);
		setValue("imageURLs", updatedArr.join("\n\n"));
	};

	return (
		<Stack gap={4}>
			<Box 
				className="border-2 border-dashed border-white/10 rounded-2xl p-8 transition-all hover:border-[#58a076]/50 hover:bg-white/5 cursor-pointer relative group"
				onClick={() => fileInputRef.current?.click()}
			>
				<input 
					type="file" 
					ref={fileInputRef}
					onChange={handleFileUpload}
					multiple
					accept="image/*"
					className="hidden"
				/>
				
				<Stack gap={3} alignItems="center" className="text-center">
					<Box className="w-12 h-12 rounded-full bg-[#58a076]/10 flex items-center justify-center text-[#58a076] group-hover:scale-110 transition-transform">
						{isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
					</Box>
					<Stack gap={1}>
						<Text weight="bold" color="text-white">Click to upload images</Text>
						<Text size="xs" color="text-slate-500">PNG, JPG or WEBP (Max 10MB each)</Text>
					</Stack>
				</Stack>
			</Box>

			{imageArr.length > 0 && (
				<Box>
					<Flex justifyContent="between" alignItems="center" className="mb-3">
						<Text weight="bold" size="sm" color="text-slate-400" className="uppercase tracking-widest">
							Gallery ({imageArr.length})
						</Text>
						<Text size="xs" color="text-slate-500 italic">Drag to reorder coming soon</Text>
					</Flex>
					
					<Grid cols={3} className="sm:grid-cols-4 md:grid-cols-5" gap={3}>
						{imageArr.map((url, index) => (
							<Box key={index} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group shadow-lg">
								<Image
									src={url}
									alt={`Product ${index + 1}`}
									fill
									className="object-cover"
								/>
								<Box className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
									<Button 
										variant="danger" 
										size="sm" 
										className="p-1.5 min-w-0 rounded-full"
										onClick={(e) => {
											e.stopPropagation();
											removeImage(index);
										}}
									>
										<X className="w-4 h-4" />
									</Button>
								</Box>
							</Box>
						))}
						
						<Box 
							className="aspect-square rounded-xl border border-dashed border-white/10 flex items-center justify-center text-white/20 hover:text-[#58a076] hover:border-[#58a076]/50 hover:bg-white/5 transition-all cursor-pointer"
							onClick={() => fileInputRef.current?.click()}
						>
							<Plus className="w-6 h-6" />
						</Box>
					</Grid>
				</Box>
			)}

			<Box className="mt-4 pt-4 border-t border-white/5">
				<Text size="xs" color="text-slate-500" className="mb-2 block font-bold uppercase tracking-widest">Manual URL Entry</Text>
				<textarea
					autoComplete="off"
					placeholder="Enter image URLs manually, separated by double newlines..."
					className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#58a076]/50 transition-all font-mono"
					rows={3}
					value={imageURLs}
					onChange={(e) => setValue("imageURLs", e.target.value)}
				/>
			</Box>
		</Stack>
	);
}
