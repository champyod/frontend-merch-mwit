export const SIZES = [
	"0",
	"1",
	"2",
	"3",
	"4",
	"FREE SIZE",
	"ONE SIZE",
	"XXS",
	"XS",
	"S",
	"M",
	"L",
	"XL",
	"2XL",
	"3XL",
	"4XL",
];

export type ColorSize = {
	color: string;
	size: (typeof SIZES)[number];
	quantity: number;
};
export type Item = {
	id: number;
	title: string;
	price: number;
	url: string;

	page_id: number;
	slug: string;
	text: string;
	ID?: number;
	last_edited_by_username?: string;
	discount?: number;
	discount_type?: "dollar" | "percent";
	name?: string;
	description?: string;
	material?: string;
	is_preorder?: 0 | 1;
	hidden?: 0 | 1;
	payment_account_id?: number;
	images?: { url: string }[];
	color_size_arr?: ColorSize[];
};

export type OrderItem = {
	item_id: number;
	item: Item;
	size: string;
	color: string;
	quantity: number;
	price: number;
};

export type Preorder = {
	id: number;
	created_at: string;
	customer_uuid?: string;
	customer_name: string;
	social: string;
	contact_number: string;
	shipping_method: "pickup" | "postal";
	address: string;
	items: OrderItem[];
	total_price: number;
	shipping_cost: number;
	completed: 0 | 1;
	payment_slip_url: string;
	status: string;
	tracking_no?: string;
	note?: string;
};

export type MenuItem = {
	ID: number;
	slug: string;
	text: string;
	order: number;
	is_permanent: number;
};

export type Site = {
	image_url?: string;
};

// Cart types
export type CartItem = {
	item_id: number;
	title: string;
	price: number;
	size: string;
	color: string;
	quantity: number;
	image_url?: string;
};