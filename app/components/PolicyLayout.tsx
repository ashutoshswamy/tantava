"use client";

import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function PolicyLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
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
            {title}
          </h1>
          {subtitle && (
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              {subtitle}
            </p>
          )}
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-3xl mx-auto bg-surface-container-lowest p-5 sm:p-8 md:p-12 rounded-lg shadow-sm space-y-10"
        >
          {children}
        </motion.div>
      </main>

      <Footer />
    </>
  );
}

export function PolicySection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-headline-sm text-headline-sm text-on-surface mb-4">
        {heading}
      </h2>
      <div className="space-y-4 font-body-md text-body-md text-on-surface-variant [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_a]:text-primary [&_a]:underline">
        {children}
      </div>
    </section>
  );
}
