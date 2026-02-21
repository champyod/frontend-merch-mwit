import { t, type DeclarationContent } from "intlayer";

const loginContent: DeclarationContent = {
	key: "login",
	content: {
		title: t({
			en: "Login",
			th: "เข้าสู่ระบบ",
		}),
		subtitle: t({
			en: "Welcome back to MWIT Merch",
			th: "ยินดีต้อนรับกลับสู่ MWIT Merch",
		}),
		description: t({
			en: "Sign in with your Google account to track your orders and manage your profile.",
			th: "เข้าสู่ระบบด้วยบัญชี Google เพื่อติดตามรายการสั่งซื้อและจัดการโปรไฟล์ของคุณ",
		}),
		buttonText: t({
			en: "Continue with Google",
			th: "ดำเนินการต่อด้วย Google",
		}),
	},
};

export default loginContent;
