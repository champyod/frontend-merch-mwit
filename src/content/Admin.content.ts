import { t, type DeclarationContent } from "intlayer";

const adminContent: DeclarationContent = {
	key: "admin",
	content: {
		// Common
		backToProducts: t({
			en: "Back to Products",
			th: "กลับไปยังรายการสินค้า",
		}),
		publishProduct: t({
			en: "Publish Product",
			th: "ลงขายสินค้า",
		}),
		saveChanges: t({
			en: "Save Changes",
			th: "บันทึกการเปลี่ยนแปลง",
		}),
		delete: t({
			en: "Delete",
			th: "ลบ",
		}),
		loading: t({
			en: "Loading...",
			th: "กำลังโหลด...",
		}),

		// Add Product
		addProductTitle: t({
			en: "Add New Product",
			th: "เพิ่มสินค้าใหม่",
		}),
		editProductTitle: t({
			en: "Edit Product",
			th: "แก้ไขสินค้า",
		}),
		editing: t({
			en: "Editing:",
			th: "กำลังแก้ไข:",
		}),

		// Form Sections
		basicInfo: t({
			en: "Basic Info",
			th: "ข้อมูลพื้นฐาน",
		}),
		inventoryLogic: t({
			en: "Inventory & Logic",
			th: "คลังสินค้าและตรรกะ",
		}),
		imagesVariants: t({
			en: "Images & Variants",
			th: "รูปภาพและรูปแบบสินค้า",
		}),

		// Form Labels
		productTitle: t({
			en: "Product Title*",
			th: "ชื่อสินค้า*",
		}),
		priceThb: t({
			en: "Price (THB)*",
			th: "ราคา (บาท)*",
		}),
		collection: t({
			en: "Collection*",
			th: "คอลเลกชัน*",
		}),
		search: t({
			en: "Search",
			th: "ค้นหา",
		}),
		searchProductPlaceholder: t({
			en: "Search by product title or collection",
			th: "ค้นหาด้วยชื่อสินค้าหรือคอลเลกชัน",
		}),
		filterByCollection: t({
			en: "Filter by collection",
			th: "กรองตามคอลเลกชัน",
		}),
		allCollections: t({
			en: "All Collections",
			th: "ทุกคอลเลกชัน",
		}),
		sortBy: t({
			en: "Sort by",
			th: "เรียงตาม",
		}),
		latestUpdated: t({
			en: "Latest updated",
			th: "อัปเดตล่าสุด",
		}),
		titleAZ: t({
			en: "Title A-Z",
			th: "ชื่อ A-Z",
		}),
		priceLowHigh: t({
			en: "Price low-high",
			th: "ราคาน้อย-มาก",
		}),
		priceHighLow: t({
			en: "Price high-low",
			th: "ราคามาก-น้อย",
		}),
		paymentAccount: t({
			en: "Linking Payment Account*",
			th: "บัญชีรับชำระเงิน*",
		}),
		selectAccount: t({
			en: "Select Account",
			th: "เลือกบัญชี",
		}),
		preorderItem: t({
			en: "Pre-order Item",
			th: "สินค้า Pre-order",
		}),
		hidden: t({
			en: "Hidden",
			th: "ซ่อนสินค้า",
		}),
		pageLocation: t({
			en: "Choose Page Location",
			th: "เลือกตำแหน่งหน้า",
		}),
		colorsSizes: t({
			en: "Colors & Sizes",
			th: "สีและไซส์",
		}),
		
		// Placeholders
		productTitlePlaceholder: t({
			en: "e.g. 2026 Anniversary Tee",
			th: "เช่น เสื้อครบรอบปี 2026",
		}),
		
		// Success/Error
		productAdded: t({
			en: "Product added successfully",
			th: "เพิ่มสินค้าสำเร็จแล้ว",
		}),
		productUpdated: t({
			en: "Product updated successfully",
			th: "อัปเดตสินค้าสำเร็จแล้ว",
		}),
		productDeleted: t({
			en: "Product deleted",
			th: "ลบสินค้าแล้ว",
		}),
		failedToAdd: t({
			en: "Failed to add product",
			th: "ไม่สามารถเพิ่มสินค้าได้",
		}),
		failedToUpdate: t({
			en: "Failed to update product",
			th: "ไม่สามารถอัปเดตสินค้าได้",
		}),
		deleteConfirm: t({
			en: "Are you sure you want to delete this product?",
			th: "คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?",
		}),

		// Payment Methods
		paymentMethods: t({
			en: "Payment Methods",
			th: "วิธีการชำระเงิน",
		}),
		addNewPaymentMethod: t({
			en: "Add New Payment Method",
			th: "เพิ่มวิธีชำระเงินใหม่",
		}),
		editPaymentMethod: t({
			en: "Edit Payment Method",
			th: "แก้ไขวิธีชำระเงิน",
		}),
		name: t({
			en: "Name",
			th: "ชื่อ",
		}),
		promptPayId: t({
			en: "PromptPay ID",
			th: "รหัสพร้อมเพย์",
		}),
		active: t({
			en: "Active",
			th: "ใช้งาน",
		}),
		inactive: t({
			en: "Inactive",
			th: "ไม่ใช้งาน",
		}),
		actions: t({
			en: "Actions",
			th: "การจัดการ",
		}),
		edit: t({
			en: "Edit",
			th: "แก้ไข",
		}),
		disable: t({
			en: "Disable",
			th: "ปิดการใช้งาน",
		}),
		enable: t({
			en: "Enable",
			th: "เปิดใช้งาน",
		}),
		cancel: t({
			en: "Cancel",
			th: "ยกเลิก",
		}),
		create: t({
			en: "Create",
			th: "สร้าง",
		}),
		errorMessage: t({
			en: "Error",
			th: "ข้อผิดพลาด",
		}),
		paymentMethodNamePlaceholder: t({
			en: "e.g. Student Council",
			th: "เช่น สภานักเรียน",
		}),
		promptPayIdPlaceholder: t({
			en: "e.g. 08xxxxxxxx",
			th: "เช่น 08xxxxxxxx",
		}),
		paymentMethodActiveDescription: t({
			en: "Enable this payment method for checkout",
			th: "เปิดใช้งานวิธีชำระเงินนี้สำหรับการสั่งซื้อ",
		})
	},
};

export default adminContent;
