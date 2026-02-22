"use client";

import { useQuery } from "@tanstack/react-query";
import { Site, MenuItem } from "@/types/types";
import { API_BASE_URL } from "@/lib/env";

type GetSiteResponse = {
	errorMessage: string;
	hasError: boolean;
	payload: Site;
};

type GetPagesResponse = {
	errorMessage: string;
	hasError: boolean;
	payload: MenuItem[];
};

const fetchSite = async (): Promise<Site> => {
	const res = await fetch(`${API_BASE_URL}/site`);
	const data: GetSiteResponse = await res.json();
	if (data.hasError) throw new Error(data.errorMessage);
	return data.payload;
};

const fetchPages = async (): Promise<MenuItem[]> => {
	const res = await fetch(`${API_BASE_URL}/page`);
	const data: GetPagesResponse = await res.json();
	if (data.hasError) throw new Error(data.errorMessage);
	return Array.isArray(data.payload) ? data.payload : [];
};

export const useSite = () => {
	return useQuery({
		queryKey: ["site"],
		queryFn: fetchSite,
	});
};

export const usePages = () => {
	return useQuery({
		queryKey: ["pages"],
		queryFn: fetchPages,
	});
};
