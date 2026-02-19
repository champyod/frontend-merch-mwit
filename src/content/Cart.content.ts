import { t, type DeclarationContent } from "intlayer";

const cartContent: DeclarationContent = {
	key: "cart",
	content: {
		title: t({
			en: "Shopping Cart",
			th: "ตะกร้าสินค้า",
		}),
		emptyTitle: t({
			en: "Your cart is empty",
			th: "ตะกร้าสินค้าของคุณว่างเปล่า",
		}),
		emptySubtitle: t({
			en: "Add some awesome merch to get started!",
			th: "เลือกซื้อสินค้าเจ๋งๆ เพื่อเริ่มรายการสั่งซื้อ!",
		}),
		goShopping: t({
			en: "Go Shopping",
			th: "ไปเลือกซื้อสินค้า",
		}),
		subtotal: t({
			en: "Subtotal",
			th: "ยอดรวมสินค้า",
		}),
		shippingNotice: t({
			en: "Shipping and total will be calculated in the checkout form.",
			th: "ค่าจัดส่งและยอดรวมทั้งหมดจะถูกคำนวณในแบบฟอร์มชำระเงิน",
		}),
		size: t({
			en: "Size",
			th: "ไซส์",
		}),
		qty: t({
			en: "Qty",
			th: "จำนวน",
		}),
		remove: t({
			en: "Remove item",
			th: "ลบสินค้า",
		})
	},
};

export default cartContent;
