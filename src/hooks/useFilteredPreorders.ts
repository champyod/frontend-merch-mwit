import { useMemo } from "react";
import { Preorder } from "@/types/types";

interface DateRange {
	from: string;
	to: string;
}

export function useFilteredPreorders(orders: Preorder[], range: DateRange) {
	const filteredOrders = useMemo(() => {
		const from = new Date(`${range.from}T00:00:00Z`);
		const to = new Date(`${range.to}T23:59:59Z`);
		return orders
			.filter((order) => {
				const createdAt = new Date(order.created_at);
				return createdAt >= from && createdAt <= to;
			})
			.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
	}, [orders, range]);

	const summary = useMemo(() => {
		const totalOrders = filteredOrders.length;
		const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.total_price || 0), 0);
		const pendingCount = filteredOrders.filter((order) => order.completed === 0).length;
		const completedCount = filteredOrders.filter((order) => order.completed === 1).length;
		return { totalOrders, totalRevenue, pendingCount, completedCount };
	}, [filteredOrders]);

	return {
		filteredOrders,
		summary,
	};
}
