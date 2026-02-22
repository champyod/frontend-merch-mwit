"use client";
import React, { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { IFormInputs } from "./AddProductForm";
import { SIZES } from "@/types/types";
import { Box, Button, Card, Grid, Input, Stack, Text } from "@/components/ui/primitives";

interface Props {
	defaultColorSizeArr?: {
		color: string;
		sizes: { size: string; quantity: number }[];
	}[];
	form: UseFormReturn<IFormInputs>;
}

const initialState = [{ color: "", sizes: [{ size: "", quantity: 0 }] }];

export function ColorSizeInput({ form, defaultColorSizeArr }: Props) {
	const [colors, setColors] = useState(defaultColorSizeArr || initialState);

	useEffect(() => {
		form.setValue("colorSizeArr", colors);
	}, [colors, form]);

	const addColor = () => {
		setColors([
			...colors,
			{ color: "", sizes: [{ size: "", quantity: 0 }] },
		]);
	};

	const addSize = (colorIndex: number) => {
		const newColors = [...colors];
		newColors[colorIndex].sizes.push({ size: "", quantity: 0 });
		setColors(newColors);
	};

	const handleColorChange = (colorIndex: number, value: string) => {
		const newColors = [...colors];
		newColors[colorIndex].color = value;
		setColors(newColors);
	};

	const handleSizeChange = (
		colorIndex: number,
		sizeIndex: number,
		value: string
	) => {
		const newColors = [...colors];
		newColors[colorIndex].sizes[sizeIndex].size = value;
		setColors(newColors);
	};

	const handleInventoryChange = (
		colorIndex: number,
		sizeIndex: number,
		value: string
	) => {
		const newColors = [...colors];
		newColors[colorIndex].sizes[sizeIndex].quantity = Number(value) || 0;
		setColors(newColors);
	};

	return (
		<Stack gap={4}>
			{colors.map((color, colorIndex) => (
				<Card key={`color-${colorIndex}`} variant="outline" className="p-4 rounded-xl">
					<Stack gap={3}>
						<Box>
							<Text size="sm" weight="bold" color="text-white" className="mb-1 block">
								Color
							</Text>
							<Text size="xs" color="text-slate-500" className="mb-2 block">
								Leave blank to skip this color
							</Text>
							<Input
								id={`color-${colorIndex}`}
								type="text"
								placeholder="Color"
								value={color.color}
								onChange={(event) => handleColorChange(colorIndex, event.target.value)}
							/>
						</Box>

						{color.sizes.map((size, sizeIndex) => (
							<Card key={`color-${colorIndex}-size-${sizeIndex}`} variant="glass" className="p-3 rounded-xl">
								<Grid cols={1} gap={3} className="md:grid-cols-2">
									<Box>
										<Box className="flex items-baseline justify-between mb-2">
											<Text size="sm" weight="bold" color="text-white">
												Size
											</Text>
											<Text size="xs" color="text-slate-500">
												Optional
											</Text>
										</Box>
										<select
											title="Select size"
											className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#58a076]/50"
											value={size.size}
											onChange={(event) =>
												handleSizeChange(colorIndex, sizeIndex, event.target.value)
											}
										>
											<option value={""} className="bg-[#0a2735]">Select a size (optional)</option>
											{SIZES.map((sizeValue) => (
												<option value={sizeValue} key={sizeValue} className="bg-[#0a2735]">
													Size: {sizeValue}
												</option>
											))}
										</select>
									</Box>

									<Box>
										<Box className="flex items-baseline justify-between mb-2">
											<Text size="sm" weight="bold" color="text-white">
												Quantity
											</Text>
											<Text size="xs" color="text-slate-500">
												Set 0 to skip
											</Text>
										</Box>
										<Input
											id={`quantity-${colorIndex}-${sizeIndex}`}
											type="number"
											placeholder="Quantity"
											value={size.quantity}
											onChange={(event) => handleInventoryChange(colorIndex, sizeIndex, event.target.value)}
										/>
									</Box>
								</Grid>
							</Card>
						))}

						<Button
							type="button"
							variant="secondary"
							size="sm"
							onClick={() => addSize(colorIndex)}
						>
							Add Size +
						</Button>
					</Stack>
				</Card>
			))}

			<Button
				type="button"
				variant="secondary"
				size="sm"
				onClick={addColor}
			>
				Add Color +
			</Button>
		</Stack>
	);
}
