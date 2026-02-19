import { t, type DeclarationContent } from "intlayer";

const homeContent: DeclarationContent = {
	key: "home",
	content: {
		welcome: t({
			en: "Welcome to",
			th: "ยินดีต้อนรับสู่",
		}),
		description: t({
			en: "Explore our exclusive collection of school merchandise designed for the MWIT community.",
			th: "สำรวจคอลเลกชันสินค้าพิเศษของเราที่ออกแบบมาสำหรับชาว MWIT โดยเฉพาะ",
		}),
		shopNow: t({
			en: "SHOP NOW",
			th: "เลือกซื้อเลย",
		}),
		viewPreorders: t({
			en: "View Pre-orders",
			th: "ดูรายการ Pre-order",
		}),
		scroll: t({
			en: "Scroll",
			th: "เลื่อนลง",
		}),
		collection: t({
			en: "Collection",
			th: "คอลเลกชัน",
		}),
		newArrivals: t({
			en: "NEW ARRIVALS",
			th: "สินค้ามาใหม่",
		}),
		qualityNotice: t({
			en: "Quality materials and unique designs crafted for excellence.",
			th: "วัสดุคุณภาพและการออกแบบที่ไม่เหมือนใคร สร้างสรรค์มาเพื่อความเป็นเลิศ",
		}),
		noProducts: t({
			en: "No products found.",
			th: "ไม่พบสินค้าในระบบ",
		})
	},
};

export default homeContent;
