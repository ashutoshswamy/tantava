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
      <Navbar />

      <main className="pt-8 sm:pt-12 pb-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-stack-md text-center max-w-2xl mx-auto"
        >
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4">
            About Tantava
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Tantava is a celebration of handloom craft — timeless silhouettes cut
            from fabric woven by artisans across India, made for the way you
            actually live and dress.
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-3xl mx-auto space-y-6 font-body-md text-body-md text-on-surface-variant"
        >
          <p>
            Every Tantava piece begins with fabric, not a sketch. We work
            directly with handloom weavers and small ateliers, choosing yarns
            and weaves first and letting the garment take shape around what the
            cloth wants to be. The result is clothing that drapes honestly and
            wears in, not out.
          </p>
          <p>
            We ship pan-India, keep sizing wide (XS–XXXL), and take orders
            straight over WhatsApp for anyone who prefers a conversation to a
            checkout page. You&apos;ll also find us at pop-ups and exhibitions
            through the year — details are always on our Instagram.
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
