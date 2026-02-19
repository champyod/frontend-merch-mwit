import { t, type DeclarationContent } from "intlayer";

const productContent: DeclarationContent = {
	key: "product",
	content: {
		material: t({
			en: "Material",
			th: "วัสดุ",
		}),
		availableVariants: t({
			en: "Available colors & sizes",
			th: "สีและไซส์ที่จำหน่าย",
		}),
		productNotFound: t({
			en: "Nothing to see here!",
			th: "ไม่พบข้อมูลสินค้า",
		}),
		sizeLabel: t({
			en: "Size",
			th: "ไซส์",
		}),
		sale: t({
			en: "Sale",
			th: "ลดราคา",
		}),
		backToHome: t({
			en: "Back to Home",
			th: "กลับสู่หน้าแรก",
		})
	},
};

export default productContent;
