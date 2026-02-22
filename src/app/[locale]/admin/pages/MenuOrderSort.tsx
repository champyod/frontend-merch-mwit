"use client";

import { MenuItem } from "@/types/types";
import {
	DndContext,
	DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
} from "@dnd-kit/sortable";
import { toast } from "sonner";
import { EditPage } from "./EditPage";
import { useState } from "react";
import { API_BASE_URL } from "@/lib/env";
import { Button, Text, Stack } from "@/components/ui/primitives";

export function MenuOrderSort({
	menuItems,
	handleDragEnd,
	deletePage,
	refetch,
}: {
	menuItems: MenuItem[];
	handleDragEnd: (event: DragEndEvent) => void;
	deletePage: (id: MenuItem["ID"]) => void;
	refetch: () => void;
}) {
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext items={menuItems.map((item) => item.slug)}>
				{menuItems.map((item) => (
					<SortableItem
						key={item.ID}
						refetch={refetch}
						menuItem={item}
						deletePage={deletePage}
					/>
				))}
			</SortableContext>
		</DndContext>
	);
}

function SortableItem({
	menuItem,
	deletePage,
	refetch,
}: {
	menuItem: MenuItem;
	deletePage: (id: MenuItem["ID"]) => void;
	refetch: () => void;
}) {
	const { attributes, listeners, setNodeRef } =
		useSortable({ id: menuItem.slug });

	const [isEditing, setIsEditing] = useState(false);
	const toggleEditPage = () => setIsEditing(!isEditing);
	const onDelete = async (id: MenuItem["ID"]) => {
		try {
			if (!confirm("Are you sure you want to delete this page?")) return;
			const res = await fetch(`${API_BASE_URL}/admin/pages/${id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.hasError) throw new Error(data.errorMessage);
			toast.success("Page deleted successfully");
			deletePage(id);
		} catch (err: any) {
			toast.error(err.message || "Error deleting page");
		}
	};

	return (
		<div
			className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm mb-5"
			ref={setNodeRef}
		>
			{isEditing && (
				<EditPage
					menuItem={menuItem}
					toggleEditPage={toggleEditPage}
					refetch={refetch}
				/>
			)}

			<div className="flex items-center justify-between p-4 cursor-pointer touch-none transition-all">
				<div
					className="flex items-center w-full"
					{...attributes}
					{...listeners}
				>
					<svg
						className="text-slate-400 hover:text-white transition-colors"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
					>
						<path
							fill="currentColor"
							d="M7 19v-2h2v2zm4 0v-2h2v2zm4 0v-2h2v2zm-8-4v-2h2v2zm4 0v-2h2v2zm4 0v-2h2v2zm-8-4V9h2v2zm4 0V9h2v2zm4 0V9h2v2zM7 7V5h2v2zm4 0V5h2v2zm4 0V5h2v2z"
						/>
					</svg>
					<Stack gap={2} className="pl-3 items-baseline">
						<Text weight="bold" color="text-white" className="block truncate sm:max-w-full">
							{menuItem.text}
						</Text>
						<Text size="sm" color="text-slate-400">
							/{menuItem.slug}
						</Text>
					</Stack>
				</div>

				<div className="flex gap-2 ml-4">
					{menuItem.is_permanent !== 1 && (
						<Button
							title="Edit page"
							aria-label="Edit page"
							variant="secondary"
							size="icon"
							onClick={toggleEditPage}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path d="m7 17.013l4.413-.015l9.632-9.54c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.756-.756-2.075-.752-2.825-.003L7 12.583zM18.045 4.458l1.589 1.583l-1.597 1.582l-1.586-1.585zM9 13.417l6.03-5.973l1.586 1.586l-6.029 5.971L9 15.006z" />
								<path d="M5 21h14c1.103 0 2-.897 2-2v-8.668l-2 2V19H8.158c-.026 0-.053.01-.079.01c-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2" />
							</svg>
						</Button>
					)}
					{menuItem.is_permanent !== 1 && (
						<Button
							title="Delete page"
							aria-label="Delete page"
							variant="danger"
							size="icon"
							onClick={() => onDelete(menuItem.ID)}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z" />
							</svg>
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
