"use client";

import { useLocale } from "next-intlayer";
import { normalizeLocale } from "@/lib/navigation";
import SetForm from "@/components/admin/SetForm";

export default function AddSetPage() {
	const localeData = useLocale();
	const locale = normalizeLocale(localeData);
	return <SetForm mode="create" locale={locale} />;
}
