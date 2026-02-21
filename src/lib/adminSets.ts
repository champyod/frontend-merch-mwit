import { AdminSet } from "@/hooks/useAdmin";

export type AdminSetStatusFilter = "" | "shown" | "hidden" | "enabled" | "disabled";

export const getAdminSetImage = (setItem: AdminSet) => {
	return setItem.images?.[0]?.url || setItem.images?.[0]?.URL || "";
};

export const getAdminSetStateLabels = (setItem: AdminSet) => {
	return {
		preorder: setItem.is_preorder === 1 ? "Preorder" : "Normal",
		visibility: setItem.hidden === 1 ? "Hidden" : "Shown",
		enabled: setItem.enabled === 1 ? "Enabled" : "Disabled",
	};
};
