"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ArrowRight, Truck, Ruler, Store, Pencil, Zap } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import type { Product } from "@/lib/supabase";

const craftPromises = [
  { icon: <Truck size={20} className="opacity-80" />, label: "Pan India Shipping" },
  { icon: <Ruler size={20} className="opacity-80" />, label: "XS · S · M · L · XL · XXL" },
  { icon: <FaWhatsapp size={20} className="opacity-80" />, label: "Order via WhatsApp" },
  { icon: <Store size={20} className="opacity-80" />, label: "Pop-ups & Exhibitions" },
];

const craftStory = [
  {
    icon: <Pencil size={24} className="text-primary" />,
    title: "Zari, Moti & Sequin Work",
    desc: "From rich zardozi to delicate moti and sequin detailing our pieces carry the mark of skilled craft on every inch of fabric.",
  },
  {
    icon: <Zap size={24} className="text-primary" />,
    title: "Mul Chanderi & Tissue Fabrics",
    desc: "We work with Mul Chanderi, tissue fabric, and fine silks lightweight, breathable materials with a subtle shine that drapes beautifully.",
  },
  {
    icon: <Ruler size={24} className="text-primary" />,
    title: "Inclusive Sizing",
    desc: "All styles available in XS, S, M, L, XL, and XXL because every body deserves a perfect fit.",
  },
];

const testimonials = [
  {
    name: "Meenakshi Sundaram",
    city: "Madurai",
    state: "Tamil Nadu",
    rating: 5,
    text: "The anarkali I ordered for my sister's wedding was absolutely stunning. The zari work is so intricate and the fabric drapes like a dream. Got endless compliments all evening!",
    tag: "Wedding Guest",
  },
  {
    name: "Jasleen Kaur",
    city: "Amritsar",
    state: "Punjab",
    rating: 5,
    text: "The fit was absolutely perfect - the Mul Chanderi kurta feels so lightweight and breathable. Honestly the best ethnic wear I've ever owned. Will be ordering again soon!",
    tag: "Repeat Customer",
  },
  {
    name: "Durga Bhavani",
    city: "Vijayawada",
    state: "Andhra Pradesh",
    rating: 5,
    text: "Ordered via WhatsApp and the process was so smooth. My fusion set arrived beautifully packed with a handwritten note. Such personal attention to detail - love this brand!",
    tag: "WhatsApp Order",
  },
  {
    name: "Chandralekha Devi",
    city: "Guwahati",
    state: "Assam",
    rating: 5,
    text: "Visited the pop-up exhibition and was blown away by the quality. The embroidery on the gown is so delicate. Already bought three pieces and planning my next order!",
    tag: "Pop-up Visitor",
  },
  {
    name: "Savitri Nambiar",
    city: "Thrissur",
    state: "Kerala",
    rating: 5,
    text: "The handloom saree I received exceeded every expectation. The weave is so fine and the colours are exactly as shown. Packaging was beautiful too - felt like a gift to myself!",
    tag: "First Order",
  },
  {
    name: "Rekha Choudhary",
    city: "Jodhpur",
    state: "Rajasthan",
    rating: 5,
    text: "Bought the leheriya dupatta set and I keep getting asked where it's from. The block print is crisp and the fabric washes so well. Tantava truly understands Indian craft!",
    tag: "Gifted a Friend",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  }),
};

export default function HomePage() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products?active=true&limit=4")
      .then((r) => r.json())
      .then((data) => setNewArrivals(Array.isArray(data) ? data : []));
  }, []);

  const formatPrice = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

  return (
    <>
      <Navbar />

      {/* Hero */}
      <header className="relative min-h-[520px] h-[calc(100svh-4rem)] md:h-[calc(100svh-5rem)] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-scroll md:bg-fixed"
            style={{
              backgroundImage: "url('/hero.png')",
              backgroundSize: "cover",
              backgroundPosition: "center top",
            }}
          />
          {/* Gradient: transparent on left (shows the dress), blush-white on right (text area) */}
          <div className="absolute inset-0 bg-gradient-to-l from-background/90 via-background/40 to-transparent" />
        </div>

        <div className="relative z-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
          {/* Text pushed to the right half */}
          <div className="mx-auto sm:ml-auto sm:mr-0 w-full max-w-lg text-left sm:text-right">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-label-md text-label-md text-primary/70 tracking-[0.25em] uppercase mb-4 block"
            >
              Threads of Tradition and Trends
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="font-headline-lg-mobile md:font-display-lg text-headline-lg-mobile md:text-display-lg text-on-surface mb-6 leading-tight"
            >
              Ethnic &amp; Indo-Western Wear for Every Occasion
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="font-body-lg text-body-lg text-on-surface-variant mb-8"
            >
              Curated kurtas, anarkalis, and fusion sets for office, festive celebrations, and everyday elegance.
            </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-start sm:justify-end"
              >
                <Link
                  href="/shop"
                  className="w-full sm:w-auto bg-primary text-on-primary px-10 py-4 rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity duration-300 text-center shadow-md"
                >
                  Shop the Collection
                </Link>
                <Link
                  href="/contact"
                  className="w-full sm:w-auto border border-primary text-primary px-10 py-4 rounded-lg font-label-md text-label-md hover:bg-primary/10 transition-all duration-300 text-center"
                >
                  Contact Us
                </Link>
              </motion.div>
            </div>
        </div>
      </header>

      {/* Craft Promise Strip */}
      <section className="bg-secondary py-5">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-wrap justify-center md:justify-between gap-6 text-on-secondary">
            {craftPromises.map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                {icon}
                <span className="font-label-md text-[13px] tracking-wider">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-stack-lg bg-surface">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2">New Arrivals</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Fresh handcrafted pieces, just in from the studio.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-primary font-label-md text-label-md hover:gap-3 transition-all duration-300 self-start sm:self-auto"
            >
              View All <ArrowRight size={18} />
            </Link>
          </div>

          <div className="flex overflow-x-auto gap-gutter pb-8 custom-scrollbar scroll-smooth">
            {newArrivals.map((product, i) => (
              <motion.div
                key={product.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
              >
                <Link href={`/shop/${product.id}`} className="min-w-[220px] sm:min-w-[280px] md:min-w-[340px] group cursor-pointer block">
                  <div className="relative aspect-[0.73] overflow-hidden rounded-lg mb-4 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                    <img
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={product.images[0] || ""}
                    />
                    {product.badge && (
                      <div className="absolute top-4 left-4 bg-secondary border border-primary-container px-3 py-1 text-on-secondary font-label-md text-[12px]">
                        {product.badge}
                      </div>
                    )}
                  </div>
                  <h3 className="font-headline-sm text-[18px] text-on-surface mb-1">{product.name}</h3>
                  <p className="font-label-md text-label-md text-primary mb-2">{formatPrice(product.price)}</p>
                  <div className="w-full py-3 border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface-variant text-center hover:bg-surface-container transition-colors">
                    View Details
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Craft Story */}
      <section className="py-24 relative overflow-hidden bg-[#fdf5f8]">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 0%, #f5dce8 0%, transparent 70%)",
        }} />

        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
              className="mb-16 md:mb-20"
            >
            <span className="text-[10px] tracking-[0.5em] uppercase text-primary/50 block mb-4">
              Why Tantava
            </span>
            <h2
              className="text-[26px] sm:text-4xl md:text-5xl font-light text-on-surface leading-tight"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: "-0.02em" }}
            >
              Crafted with{" "}
              <em className="text-primary" style={{ fontStyle: "italic" }}>Intention</em>
            </h2>
          </motion.div>

          <div className="divide-y divide-primary/10">
            {craftStory.map(({ title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
                className="py-10 md:py-12 grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-3 items-start md:items-center group"
              >
                <div className="md:col-span-2">
                  <span
                    className="text-[3.25rem] sm:text-[4.5rem] md:text-[6.5rem] font-bold leading-none select-none text-primary/[0.07] group-hover:text-primary/[0.13] transition-colors duration-700"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="hidden md:flex md:col-span-1 justify-center">
                  <div className="w-5 h-px bg-primary/25 group-hover:w-10 group-hover:bg-primary/60 transition-all duration-500" />
                </div>

                <div className="md:col-span-4">
                  <h3
                    className="text-lg md:text-2xl text-on-surface font-light leading-snug"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    {title}
                  </h3>
                </div>

                <div className="md:col-span-5 md:text-right">
                  <p className="text-on-surface-variant text-[14px] md:text-[15px] leading-relaxed">
                    {desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-surface overflow-hidden">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
          >
            <div>
              <span className="text-[10px] tracking-[0.5em] uppercase text-primary/50 block mb-4">
                Customer Love
              </span>
              <h2
                className="text-[26px] sm:text-4xl md:text-5xl font-light text-on-surface leading-tight"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: "-0.02em" }}
              >
                What Our{" "}
                <em className="text-primary" style={{ fontStyle: "italic" }}>Customers Say</em>
              </h2>
            </div>
            <p className="text-on-surface-variant text-sm max-w-xs md:text-right">
              Real stories from women who wear Tantava every day.
            </p>
          </motion.div>
        </div>

        {/* Marquee */}
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 h-full w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, var(--color-surface), transparent)" }} />
          <div className="absolute right-0 top-0 h-full w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, var(--color-surface), transparent)" }} />

          <div className="flex gap-5 animate-marquee w-max hover:[animation-play-state:paused]">
            {[...testimonials, ...testimonials].map(({ name, city, state, text }, i) => (
              <div
                key={i}
                className="w-[260px] sm:w-[320px] shrink-0 flex flex-col justify-between gap-5 p-5 sm:p-7 rounded-2xl border border-primary/10 bg-[#fdf5f8] hover:border-primary/25 transition-colors duration-300"
              >
                <div>
                  <span
                    className="text-5xl leading-none text-primary/20 block mb-3 select-none"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    &ldquo;
                  </span>
                  <p
                    className="text-[14px] leading-relaxed text-on-surface-variant"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    {text}
                  </p>
                </div>
                <div className="pt-4 border-t border-primary/10">
                  <p className="text-[13px] font-medium text-on-surface">{name}</p>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">{city}, {state}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment Banner */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="max-w-container-max mx-auto relative overflow-hidden rounded-3xl"
          style={{ background: "linear-gradient(135deg, #9e3462 0%, #6b1e40 60%, #3d0e24 100%)" }}
        >
          {/* Decorative circles */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #f5c0d8, transparent 70%)" }} />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #f5c0d8, transparent 70%)" }} />
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Ccircle cx='30' cy='30' r='1' fill='white'/%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }} />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Left */}
            <div className="p-6 sm:p-10 md:p-16 flex flex-col justify-center">
              <span className="text-[10px] tracking-[0.5em] uppercase text-white/40 block mb-5">
                Personal Styling
              </span>
              <h2
                className="text-[26px] sm:text-4xl md:text-5xl font-light text-white leading-tight mb-6"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: "-0.02em" }}
              >
                Find Your<br />
                <em style={{ fontStyle: "italic" }}>Perfect Look</em>
              </h2>
              <p className="text-white/60 text-[15px] leading-relaxed mb-10 max-w-sm">
                Reach out to our team, or connect with us instantly on WhatsApp.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/contact"
                  className="inline-block bg-white text-primary px-8 py-4 rounded-xl font-label-md text-label-md hover:bg-white/90 transition-colors shadow-lg text-center"
                >
                  Get in Touch
                </Link>
                <a
                  href="https://wa.me/919999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block border border-white/25 text-white px-8 py-4 rounded-xl font-label-md text-label-md hover:bg-white/10 transition-colors text-center"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>

            {/* Right: feature list */}
            <div className="p-6 sm:p-10 md:p-16 flex flex-col justify-center gap-8 border-t border-white/10 md:border-t-0 md:border-l md:border-white/10">
              {[
                { num: "01", label: "In-Person Styling", desc: "Visit us at our studio or catch us at pop-up exhibitions." },
                { num: "02", label: "All Sizes XS – XXL", desc: "Every piece available across the full size range, no exceptions." },
                { num: "03", label: "Quick WhatsApp Orders", desc: "Browse, ask questions, and place your order directly on WhatsApp." },
              ].map(({ num, label, desc }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="flex gap-5 items-start group"
                >
                  <span
                    className="text-3xl font-bold text-white/10 leading-none shrink-0 group-hover:text-white/20 transition-colors duration-500"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {num}
                  </span>
                  <div>
                    <p className="text-white text-[15px] font-medium mb-1" style={{ fontFamily: "Georgia, serif" }}>{label}</p>
                    <p className="text-white/50 text-[13px] leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}
