"use client";

import { useQuery } from "@tanstack/react-query";
import { Site } from "@/types/types";

type GetSiteResponse = {
	errorMessage: string;
	hasError: boolean;
	payload: Site;
};

const fetchSite = async (): Promise<Site> => {
	const res = await fetch(`/api/site`);
	const data: GetSiteResponse = await res.json();
	if (data.hasError) throw new Error(data.errorMessage);
	return data.payload;
};

export const useSite = () => {
	return useQuery({
		queryKey: ["site"],
		queryFn: fetchSite,
	});
};
