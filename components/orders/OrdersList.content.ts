import { t, type Dictionary } from "intlayer";

const ordersListContent: Dictionary = {
  key: "orders-list",
  content: {
    title: t({ en: "My Orders", th: "คำสั่งซื้อของฉัน" }),
    subtitle: t({ en: "Manage and track your MWIT Merch orders.", th: "จัดการและติดตามคำสั่งซื้อ MWIT Merch ของคุณ" }),
    
    // Empty State
    emptyTitle: t({ en: "No orders yet", th: "ยังไม่มีคำสั่งซื้อ" }),
    emptyDescription: t({ en: "You haven't placed any orders yet. Start shopping!", th: "คุณยังไม่ได้สั่งซื้อสินค้า เริ่มช้อปเลย!" }),
    browseProducts: t({ en: "Browse Products", th: "ดูสินค้า" }),
    
    // Order Card
    orderIdLabel: t({ en: "Order #", th: "คำสั่งซื้อ #" }),
    totalAmountLabel: t({ en: "Total Amount", th: "ยอดรวม" }),
    currency: t({ en: "฿", th: "฿" }),
  },
};

export default ordersListContent;
