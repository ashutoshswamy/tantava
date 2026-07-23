"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useCart } from "@/store/cart";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { ShoppingBag, Loader2, Lock, ShieldCheck, MessageCircle, Tag, X, Sparkles } from "lucide-react";
import type { StoreSettings } from "@/lib/supabase";
import { buildWhatsAppCheckoutUrl } from "@/lib/whatsapp";
import { calcDiscount } from "@/lib/discount";

type AppliedCoupon = {
  code: string;
  discount_type: "percent" | "flat";
  discount_value: number;
  discount_amount: number;
};

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useUser();
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [couponChecking, setCouponChecking] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [firstPurchase, setFirstPurchase] = useState({ eligible: false, percent: 0 });
  const [form, setForm] = useState({
    name: user?.fullName || "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => { if (!data.error) setSettings(data); });
  }, []);

  useEffect(() => {
    fetch("/api/coupons/eligibility")
      .then((r) => r.json())
      .then((data) => setFirstPurchase(data))
      .catch(() => {});
  }, []);

  const isWhatsAppCheckout = settings?.checkout_mode === "whatsapp" && settings.whatsapp_number;

  const formatPrice = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

  const welcomeDiscount =
    !appliedCoupon && firstPurchase.eligible ? calcDiscount(total(), "percent", firstPurchase.percent) : 0;
  const discountAmount = appliedCoupon ? appliedCoupon.discount_amount : welcomeDiscount;
  const finalTotal = Math.max(0, total() - discountAmount);

  const applyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponChecking(true);
    setCouponError("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput.trim(), subtotal: total() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid coupon");
      setAppliedCoupon(data);
    } catch (err) {
      setAppliedCoupon(null);
      setCouponError(err instanceof Error ? err.message : "Invalid coupon");
    } finally {
      setCouponChecking(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    try {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);

      await new Promise((res) => (script.onload = res));

      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalTotal,
          notes: {
            user_id: user?.id,
            user_email: user?.emailAddresses[0]?.emailAddress,
            coupon_code: appliedCoupon?.code ?? null,
          },
        }),
      });

      const razorpayOrder = await orderRes.json();
      if (!orderRes.ok) throw new Error(razorpayOrder.error);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "Tantava",
        description: "Artisanal Luxury Purchase",
        order_id: razorpayOrder.id,
        prefill: {
          name: form.name,
          email: user?.emailAddresses[0]?.emailAddress,
          contact: form.phone,
        },
        theme: { color: "#930500" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              orderData: {
                user_email: user?.emailAddresses[0]?.emailAddress,
                user_name: user?.fullName,
                items: items.map((i) => ({
                  product_id: i.productId,
                  name: i.name,
                  price: i.price,
                  quantity: i.quantity,
                  size: i.size,
                  image: i.image,
                })),
                subtotal: total(),
                total: finalTotal,
                coupon_code: appliedCoupon?.code ?? null,
                shipping_address: form,
              },
            }),
          });

          const verify = await verifyRes.json();
          if (verify.success) {
            clearCart();
            router.push(`/checkout/success?orderId=${verify.orderId}`);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-8 sm:pt-12 flex flex-col items-center justify-center gap-6 px-4">
          <ShoppingBag size={72} className="text-outline-variant" />
          <h1 className="font-headline-md text-headline-md text-on-surface">Your bag is empty</h1>
          <Link
            href="/shop"
            className="px-8 py-4 bg-primary text-on-primary rounded-lg font-label-md text-label-md"
          >
            Continue Shopping
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-8 sm:pt-12 pb-stack-lg">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-8 md:mb-12">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Shipping Form */}
            <div className="lg:col-span-7">
              <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6">
                Shipping Details
              </h2>
              <form onSubmit={handlePayment} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                      Full Name
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 border border-outline-variant rounded-lg font-body-md text-on-surface bg-surface focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                      Phone Number
                    </label>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-outline-variant rounded-lg font-body-md text-on-surface bg-surface focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                    Address Line 1
                  </label>
                  <input
                    required
                    value={form.line1}
                    onChange={(e) => setForm({ ...form, line1: e.target.value })}
                    className="w-full px-4 py-3 border border-outline-variant rounded-lg font-body-md text-on-surface bg-surface focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    value={form.line2}
                    onChange={(e) => setForm({ ...form, line2: e.target.value })}
                    className="w-full px-4 py-3 border border-outline-variant rounded-lg font-body-md text-on-surface bg-surface focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                      City
                    </label>
                    <input
                      required
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full px-4 py-3 border border-outline-variant rounded-lg font-body-md text-on-surface bg-surface focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                      State
                    </label>
                    <input
                      required
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      className="w-full px-4 py-3 border border-outline-variant rounded-lg font-body-md text-on-surface bg-surface focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                      Pincode
                    </label>
                    <input
                      required
                      value={form.pincode}
                      onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                      className="w-full px-4 py-3 border border-outline-variant rounded-lg font-body-md text-on-surface bg-surface focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {isWhatsAppCheckout ? (
                  <a
                    href={buildWhatsAppCheckoutUrl(settings!.whatsapp_number!, items, finalTotal)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => clearCart()}
                    className="w-full py-5 bg-primary text-on-primary font-label-md text-label-md tracking-widest rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-3 shadow-lg mt-4"
                  >
                    <MessageCircle size={18} />
                    CHECKOUT ON WHATSAPP
                  </a>
                ) : (
                  <>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-5 bg-primary text-on-primary font-label-md text-label-md tracking-widest rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-3 shadow-lg mt-4"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock size={18} />
                          PAY SECURELY {formatPrice(finalTotal)}
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-on-surface-variant">
                      <ShieldCheck size={16} />
                      <span className="font-label-md text-[12px]">
                        Secured by Razorpay • SSL Encrypted
                      </span>
                    </div>
                  </>
                )}
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-surface-container-low rounded-xl p-5 sm:p-8 lg:sticky lg:top-32">
                <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6">
                  Order Summary
                </h2>
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-20 bg-surface-container rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-label-md text-label-md text-on-surface">
                          {item.name}
                        </h3>
                        <p className="text-on-surface-variant font-label-md text-[12px]">
                          Size: {item.size} • Qty: {item.quantity}
                        </p>
                        <p className="text-primary font-body-md mt-1">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Coupon */}
                <div className="mb-6">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between gap-3 px-4 py-3 bg-secondary/10 border border-secondary/30 rounded-lg">
                      <div className="flex items-center gap-2 text-secondary font-label-md text-label-md">
                        <Tag size={16} />
                        <span>{appliedCoupon.code} applied</span>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-on-surface-variant hover:text-primary transition-colors"
                        aria-label="Remove coupon"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <input
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          placeholder="Have a coupon code?"
                          className="flex-1 px-4 py-2.5 border border-outline-variant rounded-lg font-body-md text-on-surface bg-surface focus:border-primary focus:outline-none transition-colors uppercase"
                        />
                        <button
                          type="button"
                          onClick={applyCoupon}
                          disabled={couponChecking || !couponInput.trim()}
                          className="px-5 py-2.5 border border-primary text-primary rounded-lg font-label-md text-label-md hover:bg-primary hover:text-on-primary transition-colors disabled:opacity-40"
                        >
                          {couponChecking ? <Loader2 size={16} className="animate-spin" /> : "Apply"}
                        </button>
                      </div>
                      {couponError && <p className="text-error font-label-md text-[12px] mt-2">{couponError}</p>}
                      {welcomeDiscount > 0 && (
                        <div className="flex items-center gap-2 mt-3 px-4 py-3 bg-secondary/10 border border-secondary/30 rounded-lg text-secondary font-label-md text-label-md">
                          <Sparkles size={16} />
                          <span>Welcome discount: {firstPurchase.percent}% off your first order</span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="border-t border-outline-variant/30 pt-4 space-y-3">
                  <div className="flex justify-between font-body-md text-on-surface-variant">
                    <span>Subtotal</span>
                    <span>{formatPrice(total())}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between font-body-md text-secondary">
                      <span>Discount</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-body-md text-on-surface-variant">
                    <span>Shipping</span>
                    <span className="text-secondary">Free</span>
                  </div>
                  <div className="flex justify-between font-headline-sm text-[18px] text-on-surface pt-2 border-t border-outline-variant/30">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
