"use client";

import { use } from "react";
import { useLocale } from "next-intlayer";
import { normalizeLocale } from "@/lib/navigation";
import Loader from "@/components/ui/Loader";
import SetForm from "@/components/admin/SetForm";
import { useAdminSetDetail } from "@/hooks/useAdmin";

export default function EditSetPage({ params }: { params: Promise<{ setId: string }> }) {
	const { setId } = use(params);
	const localeData = useLocale();
	const locale = normalizeLocale(localeData);

	const { data: setDetail, isLoading } = useAdminSetDetail(setId, !!setId);

	if (isLoading) return <Loader />;
	if (!setDetail) return <div className="p-6 text-slate-300">Set not found.</div>;

	return <SetForm mode="edit" initialSet={setDetail} locale={locale} />;
}
