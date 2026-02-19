import { Item, CartItem } from "@/types/types";

/**
 * Calculates the final sale price of an item based on its discount and discount type.
 */
export const calculateSalePrice = (item: Pick<Item, 'price' | 'discount' | 'discount_type'>): number => {
	const { price, discount, discount_type } = item;
	if (!discount || discount <= 0) return 0;

	return discount_type === "dollar"
		? price - discount
		: price - (price * discount) / 100;
};

/**
 * Calculates the subtotal for a list of cart items.
 */
export const calculateCartSubtotal = (cart: CartItem[]): number => {
	return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

/**
 * Calculates shipping cost based on shipping method.
 */
export const calculateShippingCost = (method: "pickup" | "postal"): number => {
	return method === "postal" ? 50 : 0;
};

/**
 * Formats currency in THB.
 */
export const formatCurrency = (amount: number): string => {
	return amount.toLocaleString('th-TH', {
		style: 'currency',
		currency: 'THB',
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	}).replace('฿', '฿ ');
};
