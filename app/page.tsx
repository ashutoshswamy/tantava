"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ArrowRight, Truck, Ruler, Store, Layers } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import type { Product, Collection, StoreSettings } from "@/lib/supabase";

const craftPromises = [
  { icon: <Truck size={20} className="opacity-80" />, label: "Pan India Shipping" },
  { icon: <Ruler size={20} className="opacity-80" />, label: "XS - XXXL" },
  { icon: <FaWhatsapp size={20} className="opacity-80" />, label: "Order via WhatsApp" },
  { icon: <Store size={20} className="opacity-80" />, label: "Pop-ups & Exhibitions" },
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
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collectionOffset, setCollectionOffset] = useState(0);
  const [testimonialsEnabled, setTestimonialsEnabled] = useState(false);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [saleTickerText, setSaleTickerText] = useState("");
  const [saleTickerEnabled, setSaleTickerEnabled] = useState(false);
  const [saleTickerColor, setSaleTickerColor] = useState<string | null>(null);
  const [saleTickerTextColor, setSaleTickerTextColor] = useState<string | null>(null);
  const [saleTickerSpeed, setSaleTickerSpeed] = useState(0);

  useEffect(() => {
    fetch("/api/products?active=true&limit=4")
      .then((r) => r.json())
      .then((data) => setNewArrivals(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    fetch("/api/collections")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setCollections(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (collections.length <= 1) return;
    const t = setInterval(() => setCollectionOffset((o) => (o + 1) % collections.length), 3500);
    return () => clearInterval(t);
  }, [collections.length]);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const t = setInterval(() => setHeroIndex((i) => (i + 1) % heroImages.length), 5000);
    return () => clearInterval(t);
  }, [heroImages.length]);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data: StoreSettings) => {
        setTestimonialsEnabled(data.testimonials_enabled);
        setHeroImages(data.hero_images?.length ? data.hero_images : data.hero_image ? [data.hero_image] : []);
        setSaleTickerText(data.sale_ticker_text);
        setSaleTickerEnabled(data.sale_ticker_enabled);
        setSaleTickerColor(data.sale_ticker_color);
        setSaleTickerTextColor(data.sale_ticker_text_color);
        setSaleTickerSpeed(data.sale_ticker_speed_seconds);
      })
      .catch(() => {});
  }, []);

  const formatPrice = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

  return (
    <>
      <Navbar activePage="home" />

      {/* Sale Ticker */}
      {saleTickerEnabled && (
      <div
        className="relative z-30 overflow-hidden py-2"
        style={{
          background: saleTickerColor
            ? `linear-gradient(90deg, ${saleTickerColor}, ${saleTickerColor}dd, ${saleTickerColor})`
            : "linear-gradient(90deg, var(--color-on-primary-container), var(--color-primary), var(--color-on-primary-container))",
        }}
      >
        <div
          className="flex gap-10 animate-marquee w-max whitespace-nowrap"
          style={{ animationDuration: `${saleTickerSpeed}s` }}
        >
          {Array(2).fill(null).map((_, i) => (
            <div key={i} className="flex gap-10">
              {Array(6).fill(null).map((_, j) => (
                <span
                  key={j}
                  className="font-label-md text-[11px] tracking-[0.3em] uppercase flex items-center gap-3"
                  style={{ color: saleTickerTextColor || "var(--color-on-primary)" }}
                >
                  {saleTickerText} <span style={{ opacity: 0.4 }}>✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Hero */}
      <header className="relative min-h-[500px] h-[calc(100svh-6.5rem)] md:h-[calc(100svh-7.5rem)] overflow-hidden">
        {heroImages.map((img, i) => (
          <div
            key={img + i}
            className="absolute inset-0 w-full h-full bg-scroll md:bg-fixed transition-opacity duration-1000 ease-in-out"
            style={{
              backgroundImage: `url('${img}')`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
              opacity: i === heroIndex ? 1 : 0,
            }}
          />
        ))}
      </header>

      {/* Collections Bento Grid */}
      {collections.length > 0 && (
        <section className="py-stack-lg bg-surface">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="mb-10 md:mb-12">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Shop by Collection</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Curated edits, each with its own story.
              </p>
            </div>

            <div className="relative h-[320px] sm:h-[420px] overflow-hidden rounded-2xl">
              <AnimatePresence initial={false} mode="popLayout">
                {(() => {
                  const col = collections[collectionOffset % collections.length];
                  return (
                    <motion.div
                      key={col.id}
                      initial={{ x: "100%" }}
                      animate={{ x: 0 }}
                      exit={{ x: "-100%" }}
                      transition={{ duration: 0.7, ease: "easeInOut" }}
                      className="absolute inset-0"
                    >
                      <Link
                        href={`/collections/${col.slug}`}
                        className="group relative rounded-2xl overflow-hidden bg-surface-container block w-full h-full"
                      >
                        {col.cover_image ? (
                          <img
                            src={col.cover_image}
                            alt={col.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Layers size={40} className="text-outline-variant" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-on-surface/70 via-on-surface/10 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                          <h3 className="font-headline-sm text-[16px] sm:text-[20px] text-white leading-snug">
                            {col.name}
                          </h3>
                          <span className="inline-flex items-center gap-1 text-white/80 font-label-md text-[11px] uppercase tracking-wider mt-1 group-hover:gap-2 transition-all duration-300">
                            Explore <ArrowRight size={13} />
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>
          </div>
        </section>
      )}

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
                  <div className="relative aspect-[0.73] overflow-hidden rounded-lg mb-4 shadow-sm group-hover:shadow-md transition-shadow duration-300 bg-white">
                    <img
                      alt={product.name}
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
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

      {/* Testimonials */}
      {testimonialsEnabled && (
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
                className="w-[260px] sm:w-[320px] shrink-0 flex flex-col justify-between gap-5 p-5 sm:p-7 rounded-2xl border border-primary/10 bg-[#fffbf0] hover:border-primary/25 transition-colors duration-300"
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
      )}

      <Footer />
    </>
  );
}
