"use client";

import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ArrowRight, Truck, Ruler, MessageCircle, Store, Pencil, Zap } from "lucide-react";
import { motion } from "framer-motion";

const newArrivals = [
  { name: "Mauve Floral Anarkali",            price: "₹10,500", badge: "TRENDING",    img: "/catalog/IMG_2139.png" },
  { name: "Turmeric Zari Embroidered Suit",   price: "₹13,500", badge: "HANDCRAFTED", img: "/catalog/IMG_2133.png" },
  { name: "Chartreuse Chikankari Tassel Set", price: "₹11,500", badge: "HANDCRAFTED", img: "/catalog/2902c634-87c6-40c8-a8bc-000a14c0630c.jpg" },
  { name: "Crimson Silk Embroidered Suit",    price: "₹9,200",  badge: "NEW",         img: "/catalog/IMG_2163.png" },
];

const craftPromises = [
  { icon: <Truck size={20} className="opacity-80" />, label: "Pan India Shipping" },
  { icon: <Ruler size={20} className="opacity-80" />, label: "M · L · XL · XXL + Custom" },
  { icon: <MessageCircle size={20} className="opacity-80" />, label: "Order via WhatsApp" },
  { icon: <Store size={20} className="opacity-80" />, label: "Pune Pop-ups & Exhibitions" },
];

const craftStory = [
  {
    icon: <Pencil size={24} className="text-primary" />,
    title: "Zari, Moti & Sequin Work",
    desc: "From rich zardozi to delicate moti and sequin detailing — our pieces carry the mark of skilled craft on every inch of fabric.",
  },
  {
    icon: <Zap size={24} className="text-primary" />,
    title: "Mul Chanderi & Tissue Fabrics",
    desc: "We work with Mul Chanderi, tissue fabric, and fine silks — lightweight, breathable materials with a subtle shine that drapes beautifully.",
  },
  {
    icon: <Ruler size={24} className="text-primary" />,
    title: "Inclusive Sizing",
    desc: "All styles available in M, L, XL, and XXL. Custom sizing also available — because every body deserves a perfect fit.",
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
  return (
    <>
      <Navbar />

      {/* Hero */}
      <header className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img
            alt="Tantava — Handcrafted Kurtis"
            className="w-full h-full object-cover object-top hero-zoom"
            src="/hero.png"
          />
        </div>
        <div className="relative z-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-label-md text-label-md text-white/70 tracking-[0.25em] uppercase mb-4 block"
            >
              Threads of Tradition and Trends
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="font-headline-lg-mobile md:font-display-lg text-headline-lg-mobile md:text-display-lg text-white mb-6"
            >
              Ethnic & Indo-Western Wear for Every Occasion
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="font-body-lg text-body-lg text-white/85 mb-8 max-w-lg"
            >
              Curated kurtas, anarkalis, and fusion sets for office, festive celebrations, and everyday elegance. Pan India shipping. Custom sizing available.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/shop"
                className="bg-secondary text-on-secondary px-10 py-4 rounded-lg font-label-md text-label-md hover:scale-[1.02] transition-transform duration-300 text-center"
              >
                Shop the Collection
              </Link>
              <Link
                href="/book-appointment"
                className="border border-white text-white px-10 py-4 rounded-lg font-label-md text-label-md hover:bg-white/10 transition-all duration-300 backdrop-blur-sm text-center"
              >
                Book a Styling Session
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
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2">New Arrivals</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Fresh handcrafted pieces, just in from the studio.
              </p>
            </div>
            <Link
              href="/shop"
              className="hidden md:flex items-center gap-2 text-primary font-label-md text-label-md hover:gap-3 transition-all duration-300"
            >
              View All <ArrowRight size={18} />
            </Link>
          </div>

          <div className="flex overflow-x-auto gap-gutter pb-8 custom-scrollbar scroll-smooth">
            {newArrivals.map((item, i) => (
              <motion.div
                key={item.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
              >
                <Link
                  href="/shop"
                  className="min-w-[280px] md:min-w-[340px] group cursor-pointer block"
                >
                  <div className="relative aspect-[0.73] overflow-hidden rounded-lg mb-4 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                    <img
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={item.img}
                    />
                    {item.badge && (
                      <div className="absolute top-4 left-4 bg-secondary border border-primary-container px-3 py-1 text-on-secondary font-label-md text-[12px]">
                        {item.badge}
                      </div>
                    )}
                  </div>
                  <h3 className="font-headline-sm text-[18px] text-on-surface mb-1">{item.name}</h3>
                  <p className="font-label-md text-label-md text-primary mb-2">{item.price}</p>
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
      <section className="py-stack-lg bg-surface">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            {craftStory.map(({ icon, title, desc }, i) => (
              <motion.div
                key={title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                variants={fadeUp}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center">
                  {icon}
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">{title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-xs">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment Banner */}
      <section className="my-stack-lg px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto bg-secondary rounded-xl p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="grid grid-cols-6 h-full w-full">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="border-r border-on-secondary" />
              ))}
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7 }}
            className="relative z-10 max-w-2xl mx-auto"
          >
            <h2 className="font-headline-lg text-headline-lg text-on-secondary mb-6">
              Find Your Perfect Look
            </h2>
            <p className="font-body-lg text-body-lg text-on-secondary/80 mb-10">
              Book a personal styling session with our team in Pune, or reach us instantly on WhatsApp. Custom sizing available for every piece.
            </p>
            <Link
              href="/book-appointment"
              className="inline-block bg-primary-container text-on-primary-container px-12 py-5 rounded-lg font-label-md text-label-md hover:scale-105 transition-all shadow-lg"
            >
              Book a Styling Session
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
