import { t, type DeclarationContent } from "intlayer";

const orderDetailContent: DeclarationContent = {
	key: "order-detail",
	content: {
		backToOrders: t({
			en: "Back to Orders",
			th: "กลับไปยังรายการสั่งซื้อ",
		}),
		orderNumber: t({
			en: "Order #",
			th: "หมายเลขคำสั่งซื้อ #",
		}),
		viewInvoice: t({
			en: "View Invoice",
			th: "ดูใบเสร็จ",
		}),
		trackProgress: t({
			en: "Track Order Progress",
			th: "ติดตามสถานะการสั่งซื้อ",
		}),
		trackingNumber: t({
			en: "Tracking Number",
			th: "หมายเลขติดตามพัสดุ",
		}),
		trackShipment: t({
			en: "Track Shipment",
			th: "ติดตามพัสดุ",
		}),
		orderSummary: t({
			en: "Order Summary",
			th: "สรุปรายการสั่งซื้อ",
		}),
		subtotal: t({
			en: "Subtotal",
			th: "ยอดรวมสินค้า",
		}),
		shippingCost: t({
			en: "Shipping Cost",
			th: "ค่าจัดส่ง",
		}),
		total: t({
			en: "Total",
			th: "ยอดรวมทั้งหมด",
		}),
		adminNote: t({
			en: "Admin Note",
			th: "หมายเหตุจากผู้ดูแล",
		}),
		customer: t({
			en: "Customer",
			th: "ข้อมูลลูกค้า",
		}),
		shipping: t({
			en: "Shipping",
			th: "การจัดส่ง",
		}),
		method: t({
			en: "Method",
			th: "วิธีการจัดส่ง",
		}),
		address: t({
			en: "Address",
			th: "ที่อยู่",
		}),
		nameLabel: t({
			en: "Name",
			th: "ชื่อ",
		}),
		socialLabel: t({
			en: "Social ID",
			th: "โซเชียล",
		}),
		contactLabel: t({
			en: "Contact",
			th: "ติดต่อ",
		}),
		noAddress: t({
			en: "N/A",
			th: "ไม่ระบุ",
		}),
		orderNotFound: t({
			en: "Order not found.",
			th: "ไม่พบข้อมูลคำสั่งซื้อ",
		}),
		statusPlaced: t({
			en: "Placed",
			th: "รับคำสั่งซื้อแล้ว",
		}),
		statusConfirmed: t({
			en: "Confirmed",
			th: "ยืนยันแล้ว",
		}),
		statusPacked: t({
			en: "Packed",
			th: "กำลังจัดเตรียม",
		}),
		statusShipped: t({
			en: "Shipped",
			th: "จัดส่งแล้ว",
		}),
		statusDelivered: t({
			en: "Delivered",
			th: "จัดส่งสำเร็จ",
		}),
	},
};

export default orderDetailContent;
