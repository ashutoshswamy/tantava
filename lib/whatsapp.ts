import type { CartItem } from "@/store/cart";

const formatPrice = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

export function buildWhatsAppCheckoutUrl(whatsappNumber: string, items: CartItem[], total: number): string {
  const lines = [
    "Hi! I'd like to place an order:",
    "",
    ...items.map((i) => `• ${i.name} (Size: ${i.size}, Qty: ${i.quantity}) — ${formatPrice(i.price * i.quantity)}`),
    "",
    `Total: ${formatPrice(total)}`,
  ];
  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${whatsappNumber}?text=${text}`;
}
