"use client";

import { use } from "react";
import Loader from "@/components/ui/Loader";
import SetForm from "@/components/admin/SetForm";
import { useAdminSetDetail } from "@/hooks/useAdmin";
import { Box, Text } from "@/components/ui/primitives";

export default function EditSetPage({ params }: { params: Promise<{ setId: string }> }) {
	const { setId } = use(params);

	const { data: setDetail, isLoading } = useAdminSetDetail(setId, !!setId);

	if (isLoading) return <Loader />;
	if (!setDetail) return <Box><Text color="text-slate-300">Set not found.</Text></Box>;

	return <SetForm mode="edit" initialSet={setDetail} />;
}
