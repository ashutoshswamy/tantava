export function calcDiscount(subtotal: number, type: "percent" | "flat", value: number): number {
  const amount = type === "percent" ? Math.round((subtotal * value) / 100) : value;
  return Math.max(0, Math.min(amount, subtotal));
}
