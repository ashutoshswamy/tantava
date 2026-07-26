"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { Ruler, Truck, Store, Layers } from "lucide-react";

const values = [
  { icon: <Layers size={20} className="opacity-80" />, label: "Handloom Fabrics" },
  { icon: <Ruler size={20} className="opacity-80" />, label: "XS - XXXL" },
  { icon: <Truck size={20} className="opacity-80" />, label: "Pan India Shipping" },
  { icon: <Store size={20} className="opacity-80" />, label: "Pop-ups & Exhibitions" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar activePage="about" />

      <main className="pt-8 sm:pt-12 pb-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-stack-md text-center max-w-2xl mx-auto"
        >
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4">
            About Us
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant italic">
            Threads of tradition and trends.
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-3xl mx-auto space-y-6 font-body-md text-body-md text-on-surface-variant"
        >
          <p>
            There&apos;s a difference between clothing that fills a rack and
            clothing that actually earns a place in your wardrobe. That
            difference is where Tantava started.
          </p>
          <p>
            Founded in 2026, Tantava Curated is our current collection —
            festive wear, office staples, everyday dresses, co-ord sets, and
            ethnic and Indo-Western pieces, each one chosen for how it&apos;s
            cut, how it&apos;s made, and how long it lasts. Nothing here made
            it in by accident. Every piece had to earn its place — good enough
            for a second look, a second wear, a second season.
          </p>
          <p>
            Next up is Tantava Creations, our first step into building instead
            of just choosing. Original designs, made in-house, carrying the
            same care that went into curating everything before it.
          </p>
          <p>Two names, one instinct: curate first, create next.</p>
          <p>
            Tantava isn&apos;t trying to dress everyone. Just the women paying
            attention.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-stack-md grid grid-cols-2 md:grid-cols-4 gap-gutter max-w-3xl mx-auto"
        >
          {values.map(({ icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-3 text-center bg-surface-container-lowest p-6 rounded-lg shadow-sm"
            >
              {icon}
              <span className="font-label-md text-label-md text-on-surface-variant">
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </main>

      <Footer />
    </>
  );
}
