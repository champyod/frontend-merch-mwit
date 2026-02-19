import { t, type DeclarationContent } from "intlayer";

const dashboardContent: DeclarationContent = {
	key: "dashboard",
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
		brand: t({
			en: "Brand*",
			th: "แบรนด์*",
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
		})
	},
};

export default dashboardContent;
