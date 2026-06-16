"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry", "Chandigarh",
];

type FormState = {
  name: string;
  phone: string;
  email: string;
  state: string;
  city: string;
  about: string;
};

const EMPTY: FormState = { name: "", phone: "", email: "", state: "", city: "", about: "" };

export default function FeedbackPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const json = await res.json();
        setError(json.error || "Something went wrong. Please try again.");
      } else {
        setDone(true);
        setForm(EMPTY);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-[#fdf5f8] border border-[#eec7dd] rounded-xl px-4 py-3 text-[14px] text-[#21101a] placeholder:text-[#d9afc0] focus:outline-none focus:border-[#9e3462]/50 focus:ring-2 focus:ring-[#9e3462]/10 transition-all";
  const labelClass = "block font-label-md text-[12px] text-[#8c5971] mb-1.5 uppercase tracking-wide";

  if (done) {
    return (
      <div className="min-h-screen bg-[#fffafc] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <CheckCircle2 size={56} className="mx-auto text-[#9e3462] mb-6" />
          <h2 className="font-headline-md text-[26px] text-[#21101a] mb-3">Thank you!</h2>
          <p className="text-[#8c5971] text-[14px] leading-relaxed mb-8">
            Your feedback means a lot to us. We&apos;ll review it and your kind words might even appear in our testimonials!
          </p>
          <Link
            href="/"
            className="inline-block bg-[#9e3462] text-white px-8 py-3 rounded-xl font-label-md text-[14px] hover:bg-[#7d1a48] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffafc] px-4 py-16 sm:py-24">
      <div className="max-w-xl mx-auto">
        <div className="mb-10">
          <Link href="/" className="text-[#9e3462] font-label-md text-[13px] hover:underline">
            ← Back to Home
          </Link>
          <h1 className="font-headline-lg text-[32px] sm:text-[38px] text-[#21101a] mt-6 mb-3">
            Share Your Experience
          </h1>
          <p className="text-[#8c5971] text-[15px] leading-relaxed">
            We love hearing from you. Your feedback helps us improve - and your kind words might even feature in our testimonials!
          </p>

          {/* Testimonial notice */}
          <div className="mt-5 bg-[#fce8f0] border border-[#eec7dd] rounded-xl px-4 py-3 flex gap-3 items-start">
            <span className="text-[20px] mt-0.5">✨</span>
            <p className="text-[#7d3055] text-[13px] leading-relaxed">
              Loved something? Your feedback could appear as a testimonial on our website - celebrating real women from across India.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className={labelClass}>Full Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={set("name")}
              placeholder="Your name"
              required
              className={inputClass}
            />
          </div>

          {/* Phone + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Phone Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={set("phone")}
                placeholder="+91 XXXXX XXXXX"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>
          </div>

          {/* State + City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>State</label>
              <select
                value={form.state}
                onChange={set("state")}
                className={inputClass}
              >
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>City</label>
              <input
                type="text"
                value={form.city}
                onChange={set("city")}
                placeholder="Your city"
                className={inputClass}
              />
            </div>
          </div>

          {/* About products */}
          <div>
            <label className={labelClass}>Tell us about your experience *</label>
            <textarea
              value={form.about}
              onChange={set("about")}
              placeholder="Which product did you buy? How was the quality, fit, and overall experience? What did you love?"
              required
              rows={5}
              className={`${inputClass} resize-none`}
            />
          </div>

          {error && (
            <p className="text-red-500 text-[13px]">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#9e3462] text-white py-3.5 rounded-xl font-label-md text-[14px] hover:bg-[#7d1a48] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Submitting…" : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
}
