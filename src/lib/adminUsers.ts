export type AdminUserStatus = "all" | "active" | "inactive";
export type AdminUserRole = "all" | "super-admin" | "customer";
export type AdminUserSort = "created_desc" | "created_asc" | "last_active_desc" | "last_active_asc";

export type AdminUsersQueryParams = {
	search?: string;
	status?: AdminUserStatus;
	role?: AdminUserRole;
	sort?: AdminUserSort;
	page?: number;
	limit?: number;
};

export const buildAdminUsersSearchParams = (params?: AdminUsersQueryParams) => {
	const query = new URLSearchParams();
	if (params?.search?.trim()) query.set("search", params.search.trim());
	if (params?.status && params.status !== "all") query.set("status", params.status);
	if (params?.role && params.role !== "all") query.set("role", params.role);
	if (params?.sort) query.set("sort", params.sort);
	if (params?.page && params.page > 0) query.set("page", String(params.page));
	if (params?.limit && params.limit > 0) query.set("limit", String(params.limit));
	return query;
};

export const buildAdminUsersExportFileName = (date: Date = new Date()) => {
	return `users_${date.toISOString().slice(0, 10)}.csv`;
};

export const downloadBlobFile = (blob: Blob, filename: string) => {
	const url = window.URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	link.remove();
	window.URL.revokeObjectURL(url);
};

export const formatAdminDate = (isoDate?: string) => {
	if (!isoDate) return "Never";
	return new Date(isoDate).toLocaleString();
};
