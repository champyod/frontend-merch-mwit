import { t, type DeclarationContent } from "intlayer";

const footerContent: DeclarationContent = {
  key: "footer",
  content: {
    description: t({
      en: "The official merchandise platform for Mahidol Wittayanusorn School. Crafted with excellence for our community.",
      th: "แพลตฟอร์มจำหน่ายสินค้าที่ระลึกอย่างเป็นทางการของโรงเรียนมหิดลวิทยานุสรณ์ สร้างสรรค์ด้วยความใส่ใจเพื่อประชาคมของเรา",
    }),
    navigation: {
      title: t({
        en: "Navigation",
        th: "การนำทาง",
      }),
      home: t({
        en: "Home",
        th: "หน้าแรก",
      }),
      preorders: t({
        en: "Pre-orders",
        th: "สั่งจองล่วงหน้า",
      }),
      cart: t({
        en: "Shopping Cart",
        th: "รถเข็นสินค้า",
      }),
    },
    support: {
      title: t({
        en: "Support",
        th: "สนับสนุน",
      }),
      privacy: t({
        en: "Privacy Policy",
        th: "นโยบายความเป็นส่วนตัว",
      }),
      refund: t({
        en: "Refund Policy",
        th: "นโยบายการคืนเงิน",
      }),
      shipping: t({
        en: "Shipping Policy",
        th: "นโยบายการจัดส่ง",
      }),
    },
    rights: t({
      en: "ALL RIGHTS RESERVED.",
      th: "สงวนลิขสิทธิ์ทั้งหมด",
    }),
    designedBy: t({
      en: "Designed for MWIT Community",
      th: "ออกแบบเพื่อประชาคม MWIT",
    }),
  },
};

export default footerContent;
