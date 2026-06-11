"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CheckCircle2, MessageCircle, Loader2, ArrowRight, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

export default function BookAppointmentPage() {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    name: user?.fullName || "",
    phone: "",
    email: user?.emailAddresses[0]?.emailAddress || "",
    date: "",
    occasion: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or contact us directly.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <>
        <Navbar activePage="book-appointment" />
        <main className="min-h-screen pt-32 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-lg px-4"
          >
            <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-secondary" />
            </div>
            <h1 className="font-headline-lg text-headline-lg text-primary mb-4">
              Appointment Requested!
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
              Thank you, {formData.name}. Our team will call you within 24 hours to finalize your
              appointment at the Tantava Studio.
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-4 bg-primary text-on-primary rounded-lg font-label-md text-label-md"
            >
              Return Home
            </Link>
          </motion.div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar activePage="book-appointment" />

      <main className="pt-32 pb-stack-lg">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-16 text-center"
        >
          <h1 className="font-headline-lg text-headline-lg md:text-display-lg mb-4 text-primary">
            Private Consultations
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Experience the art of slow fashion with a personalized walkthrough of our latest
            curated ethnic &amp; Indo-Western collections at our Pune studio.
          </p>
        </motion.section>

        <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-gutter">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 space-y-12"
          >
            <div className="relative overflow-hidden group">
              <img
                alt="Tantava Studio Interior"
                className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAk7RM44A-cxLr029tKl7qPT3u30IBFdcysg3xXnT5SYkDpIlJPPjV5p9ux_SWi3zirD9tzsTIKZj6JIisAr-gpmcHBarLu8VH4c3yJY0e2xLOBgALyec-pUjmLqZhrWVR3Fcs8CcZSlsbZ7GTG1w297bkO5uBcki8A387-8NmrKdiD9TP3-hwe_zFFiaRW8fS5ypmN7GX0ua1lpL1kGJGY0YscMYay3IHNym_NDYmECcP9aW1NgpnLdaJA-P1LpcvnUwwsa9TUeII"
              />
              <div className="absolute top-4 left-4 bg-[#2D4739] text-[#C9A84C] px-3 py-1 font-label-md text-label-md border border-[#C9A84C]">
                Handcrafted
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-primary mb-2">Our Studio</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Kothrud, Pune, Maharashtra
                </p>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-primary mb-2">
                  Consultation Hours
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Monday – Saturday
                  <br />
                  11:00 AM – 7:30 PM
                </p>
              </div>
              <div className="pt-4">
                <a
                  href="https://wa.me/910000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-secondary text-on-secondary rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity"
                >
                  <MessageCircle size={20} />
                  Quick Contact via WhatsApp
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-7 bg-surface-container-lowest p-5 sm:p-8 md:p-12 shadow-[0_10px_40px_rgba(45,71,57,0.04)] rounded-lg"
          >
            <h2 className="font-headline-sm text-headline-sm text-primary mb-8">
              Request an Appointment
            </h2>
            {error && (
              <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg font-body-md text-body-md">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative group">
                  <input
                    type="text"
                    id="name"
                    placeholder=" "
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="peer w-full bg-transparent border-0 border-b border-outline-variant py-2 font-body-md text-on-surface focus:ring-0 focus:border-primary transition-all outline-none"
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-0 top-2 font-label-md text-label-md text-on-surface-variant transition-all peer-focus:-top-4 peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-4"
                  >
                    Full Name *
                  </label>
                </div>
                <div className="relative group">
                  <input
                    type="tel"
                    id="phone"
                    placeholder=" "
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="peer w-full bg-transparent border-0 border-b border-outline-variant py-2 font-body-md text-on-surface focus:ring-0 focus:border-primary transition-all outline-none"
                  />
                  <label
                    htmlFor="phone"
                    className="absolute left-0 top-2 font-label-md text-label-md text-on-surface-variant transition-all peer-focus:-top-4 peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-4"
                  >
                    Phone Number *
                  </label>
                </div>
              </div>

              <div className="relative group">
                <input
                  type="email"
                  id="email"
                  placeholder=" "
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="peer w-full bg-transparent border-0 border-b border-outline-variant py-2 font-body-md text-on-surface focus:ring-0 focus:border-primary transition-all outline-none"
                />
                <label
                  htmlFor="email"
                  className="absolute left-0 top-2 font-label-md text-label-md text-on-surface-variant transition-all peer-focus:-top-4 peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-4"
                >
                  Email Address
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative group">
                  <input
                    type="date"
                    id="date"
                    placeholder=" "
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="peer w-full bg-transparent border-0 border-b border-outline-variant py-2 font-body-md text-on-surface focus:ring-0 focus:border-primary transition-all outline-none"
                  />
                  <label
                    htmlFor="date"
                    className="absolute left-0 -top-4 font-label-md text-label-md text-on-surface-variant"
                  >
                    Preferred Date *
                  </label>
                </div>
                <div className="relative group">
                  <select
                    id="occasion"
                    value={formData.occasion}
                    onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                    className="peer w-full bg-transparent border-0 border-b border-outline-variant py-2 font-body-md text-on-surface focus:ring-0 focus:border-primary transition-all appearance-none outline-none"
                  >
                    <option value="" disabled></option>
                    <option value="office">Office Wear</option>
                    <option value="festive">Festive Celebration</option>
                    <option value="everyday">Everyday Elegance</option>
                  </select>
                  <label
                    htmlFor="occasion"
                    className="absolute left-0 -top-4 font-label-md text-label-md text-on-surface-variant"
                  >
                    Occasion
                  </label>
                  <ChevronDown size={18} className="absolute right-0 top-2 text-on-surface-variant pointer-events-none" />
                </div>
              </div>

              <div className="relative group">
                <textarea
                  id="message"
                  placeholder=" "
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="peer w-full bg-transparent border-0 border-b border-outline-variant py-2 font-body-md text-on-surface focus:ring-0 focus:border-primary transition-all resize-none outline-none"
                />
                <label
                  htmlFor="message"
                  className="absolute left-0 top-2 font-label-md text-label-md text-on-surface-variant transition-all peer-focus:-top-4 peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-4"
                >
                  How can we help you? (Optional)
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-12 py-4 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Confirm Request
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
                <p className="mt-4 font-label-md text-[12px] text-on-surface-variant opacity-70">
                  We will call you within 24 hours to finalize your time slot.
                </p>
              </div>
            </form>
          </motion.div>
        </section>
      </main>

      <Footer />
    </>
  );
}
