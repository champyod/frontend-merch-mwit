import { t, type DeclarationContent } from "intlayer";

const preorderContent: DeclarationContent = {
  key: "preorder-form",
  content: {
    // Info Step
    checkoutDetails: t({ en: "Checkout Details", th: "ข้อมูลการจัดส่ง" }),
    fullNameLabel: t({ en: "Full Name", th: "ชื่อ-นามสกุล" }),
    fullNamePlaceholder: t({ en: "Somchai Jaidee", th: "สมชาย ใจดี" }),
    socialLabel: t({ en: "Social (LINE/FB)", th: "ช่องทางติดต่อ (LINE/FB)" }),
    socialPlaceholder: t({ en: "LINE ID / FB Name", th: "ไอดีไลน์ / ชื่อเฟสบุ๊ค" }),
    phoneLabel: t({ en: "Phone Number", th: "เบอร์โทรศัพท์" }),
    phonePlaceholder: t({ en: "081-234-5678", th: "081-234-5678" }),
    shippingMethodLabel: t({ en: "Shipping Method", th: "วิธีการจัดส่ง" }),
    pickupLabel: t({ en: "Pick up at School (Free)", th: "รับที่โรงเรียน (ฟรี)" }),
    postalLabel: t({ en: "Postal (+฿50)", th: "จัดส่งพัสดุ (+฿50)" }),
    addressLabel: t({ en: "Delivery Address", th: "ที่อยู่จัดส่ง" }),
    addressPlaceholder: t({ en: "Street, District, Province, Postal Code", th: "บ้านเลขที่, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์" }),
    totalAmount: t({ en: "Total Amount", th: "ยอดรวมทั้งหมด" }),
    goToPayment: t({ en: "Go to Payment", th: "ดำเนินการชำระเงิน" }),
    cartEmpty: t({ en: "Your cart is empty", th: "ตะกร้าสินค้าว่างเปล่า" }),

    // Payment Step
    scanToPay: t({ en: "Scan to Pay", th: "สแกนเพื่อชำระเงิน" }),
    totalToPay: t({ en: "Total to pay", th: "ยอดที่ต้องชำระ" }),
    recipientName: t({ en: "MWIT Student Committee", th: "คณะกรรมการนักเรียน MWIT" }),
    transferInstruction: t({ 
      en: "Please transfer exactly", 
      th: "กรุณาโอนเงินจำนวน" 
    }),
    uploadSlip: t({ en: "Upload Payment Slip", th: "อัปโหลดสลิปโอนเงิน" }),
    fileType: t({ en: "JPG, PNG (Max 5MB)", th: "JPG, PNG (ขนาดไม่เกิน 5MB)" }),
    backToDetails: t({ en: "Back to details", th: "ย้อนกลับ" }),

    // Success Step
    orderSuccessful: t({ en: "Order Successful!", th: "สั่งซื้อสำเร็จ!" }),
    orderPlacedMessage: t({ 
      en: "Order has been placed. We'll verify your payment shortly.", 
      th: "ได้รับคำสั่งซื้อแล้ว เราจะตรวจสอบการชำระเงินของท่านโดยเร็วที่สุด" 
    }),
    linkedAccount: t({ en: "This order is linked to your account.", th: "คำสั่งซื้อนี้ถูกผูกกับบัญชีของคุณแล้ว" }),
    trackOrder: t({ en: "Track Order", th: "ติดตามสถานะ" }),
    signInPrompt: t({ en: "Sign in with Google to track this order and see all your order history.", th: "เข้าสู่ระบบด้วย Google เพื่อติดตามสถานะและดูประวัติการสั่งซื้อ" }),
    signInButton: t({ en: "Sign in to Track", th: "เข้าสู่ระบบเพื่อติดตาม" }),
    continueShopping: t({ en: "Continue Shopping", th: "ซื้อสินค้าต่อ" }),
    
    // Errors
    nameRequired: t({ en: "Name is required", th: "กรุณากรอกชื่อ" }),
    socialRequired: t({ en: "Social contact is required", th: "กรุณากรอกช่องทางติดต่อ" }),
    phoneRequired: t({ en: "Phone number is required", th: "กรุณากรอกเบอร์โทรศัพท์" }),
    addressRequired: t({ en: "Address is required for postal shipping", th: "กรุณากรอกที่อยู่สำหรับการจัดส่ง" }),
  },
};

export default preorderContent;
