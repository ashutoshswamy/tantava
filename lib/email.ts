import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.RESEND_FROM_EMAIL || "Tantava <orders@tantava.in>";

const formatPrice = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

const STATUS_COPY: Record<string, { subject: string; heading: string; body: string }> = {
  processing: {
    subject: "Your order is being processed",
    heading: "Your order is being processed",
    body: "We're getting your order ready to ship.",
  },
  shipped: {
    subject: "Your order has shipped",
    heading: "Your order is on its way",
    body: "Your order has been shipped and is on its way to you.",
  },
  delivered: {
    subject: "Your order has been delivered",
    heading: "Delivered!",
    body: "Your order has been delivered. We hope you love it.",
  },
  cancelled: {
    subject: "Your order has been cancelled",
    heading: "Order cancelled",
    body: "Your order has been cancelled. If this wasn't expected, please contact us.",
  },
};

function wrapper(inner: string): string {
  return `
    <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; color: #1a0914;">
      <h1 style="color: #c2477f; font-size: 20px; margin-bottom: 4px;">Tantava</h1>
      ${inner}
      <p style="color: #8c5971; font-size: 12px; margin-top: 32px;">Questions? Reply to this email or reach us via the Contact page.</p>
    </div>
  `;
}

type OrderItem = { name: string; price: number; quantity: number; size: string };

export async function sendOrderConfirmationEmail(opts: {
  to: string;
  orderId: string;
  items: OrderItem[];
  total: number;
}) {
  if (!resend || !opts.to) return;

  const rows = opts.items
    .map(
      (i) =>
        `<tr><td style="padding:6px 0;">${i.name} (${i.size}) × ${i.quantity}</td><td style="padding:6px 0; text-align:right;">${formatPrice(i.price * i.quantity)}</td></tr>`
    )
    .join("");

  const html = wrapper(`
    <h2 style="font-size: 16px; margin: 16px 0 8px;">Order confirmed</h2>
    <p style="font-size: 14px; color: #52304a;">Thank you for your order. We'll notify you as it ships.</p>
    <p style="font-size: 12px; color: #8c5971;">Order #${opts.orderId.slice(0, 8)}</p>
    <table style="width: 100%; font-size: 13px; margin-top: 12px; border-top: 1px solid #f2cfe3; padding-top: 8px;">
      ${rows}
    </table>
    <p style="font-size: 14px; font-weight: 600; text-align: right; margin-top: 8px;">Total: ${formatPrice(opts.total)}</p>
  `);

  try {
    await resend.emails.send({
      from: FROM,
      to: opts.to,
      subject: "Your Tantava order is confirmed",
      html,
    });
  } catch (err) {
    console.error("[Resend] order confirmation email failed:", err);
  }
}

export async function sendOrderStatusEmail(opts: {
  to: string;
  orderId: string;
  status: string;
}) {
  if (!resend || !opts.to) return;

  const copy = STATUS_COPY[opts.status];
  if (!copy) return; // no email for statuses like "pending" / "paid" (handled by the confirmation email)

  const html = wrapper(`
    <h2 style="font-size: 16px; margin: 16px 0 8px;">${copy.heading}</h2>
    <p style="font-size: 14px; color: #52304a;">${copy.body}</p>
    <p style="font-size: 12px; color: #8c5971;">Order #${opts.orderId.slice(0, 8)}</p>
  `);

  try {
    await resend.emails.send({
      from: FROM,
      to: opts.to,
      subject: copy.subject,
      html,
    });
  } catch (err) {
    console.error("[Resend] order status email failed:", err);
  }
}
