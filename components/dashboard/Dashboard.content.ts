import { type Dictionary } from "intlayer";

const dashboardContent: Dictionary = {
	key: "dashboard",
	content: {
		// Common
		backToProducts: {
			en: "Back to Products",
			th: "กลับไปยังรายการสินค้า",
		},
		publishProduct: {
			en: "Publish Product",
			th: "ลงขายสินค้า",
		},
		saveChanges: {
			en: "Save Changes",
			th: "บันทึกการเปลี่ยนแปลง",
		},
		delete: {
			en: "Delete",
			th: "ลบ",
		},
		loading: {
			en: "Loading...",
			th: "กำลังโหลด...",
		},

		// Add Product
		addProductTitle: {
			en: "Add New Product",
			th: "เพิ่มสินค้าใหม่",
		},
		editProductTitle: {
			en: "Edit Product",
			th: "แก้ไขสินค้า",
		},
		editing: {
			en: "Editing:",
			th: "กำลังแก้ไข:",
		},

		// Form Sections
		basicInfo: {
			en: "Basic Info",
			th: "ข้อมูลพื้นฐาน",
		},
		inventoryLogic: {
			en: "Inventory & Logic",
			th: "คลังสินค้าและตรรกะ",
		},
		imagesVariants: {
			en: "Images & Variants",
			th: "รูปภาพและรูปแบบสินค้า",
		},

		// Form Labels
		productTitle: {
			en: "Product Title*",
			th: "ชื่อสินค้า*",
		},
		priceThb: {
			en: "Price (THB)*",
			th: "ราคา (บาท)*",
		},
		brand: {
			en: "Brand*",
			th: "แบรนด์*",
		},
		paymentAccount: {
			en: "Linking Payment Account*",
			th: "บัญชีรับชำระเงิน*",
		},
		selectAccount: {
			en: "Select Account",
			th: "เลือกบัญชี",
		},
		preorderItem: {
			en: "Pre-order Item",
			th: "สินค้า Pre-order",
		},
		hidden: {
			en: "Hidden",
			th: "ซ่อนสินค้า",
		},
		pageLocation: {
			en: "Choose Page Location",
			th: "เลือกตำแหน่งหน้า",
		},
		colorsSizes: {
			en: "Colors & Sizes",
			th: "สีและไซส์",
		},
		
		// Placeholders
		productTitlePlaceholder: {
			en: "e.g. 2026 Anniversary Tee",
			th: "เช่น เสื้อครบรอบปี 2026",
		},
		
		// Success/Error
		productAdded: {
			en: "Product added successfully",
			th: "เพิ่มสินค้าสำเร็จแล้ว",
		},
		productUpdated: {
			en: "Product updated successfully",
			th: "อัปเดตสินค้าสำเร็จแล้ว",
		},
		productDeleted: {
			en: "Product deleted",
			th: "ลบสินค้าแล้ว",
		},
		failedToAdd: {
			en: "Failed to add product",
			th: "ไม่สามารถเพิ่มสินค้าได้",
		},
		failedToUpdate: {
			en: "Failed to update product",
			th: "ไม่สามารถอัปเดตสินค้าได้",
		},
		deleteConfirm: {
			en: "Are you sure you want to delete this product?",
			th: "คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?",
		}
	},
};

export default dashboardContent;
