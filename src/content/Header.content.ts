import { t, type DeclarationContent } from "intlayer";

const headerContent: DeclarationContent = {
	key: "header",
	content: {
		home: t({
			en: "Home",
			th: "หน้าแรก",
		}),
		others: t({
			en: "Others",
			th: "อื่นๆ",
		}),
		login: t({
			en: "Sign in with Google",
			th: "เข้าสู่ระบบด้วย Google",
		}),
		loginShort: t({
			en: "Login",
			th: "เข้าสู่ระบบ",
		}),
		myOrders: t({
			en: "My Orders",
			th: "รายการสั่งซื้อของฉัน",
		}),
		adminDashboard: t({
			en: "Admin Dashboard",
			th: "แผงควบคุมแอดมิน",
		}),
		signedInAs: t({
			en: "Signed in as",
			th: "ลงชื่อเข้าใช้โดย",
		})
	},
};

export default headerContent;
