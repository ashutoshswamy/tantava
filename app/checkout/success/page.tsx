"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { CheckCircle2, Package, Truck, Home } from "lucide-react";
import { motion } from "framer-motion";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const steps = [
    { icon: <Package size={32} className="text-primary" />, title: "Preparation", desc: "Your piece enters our artisan workshop" },
    { icon: <Truck size={32} className="text-primary" />, title: "Dispatch", desc: "Shipped within 14–21 working days" },
    { icon: <Home size={32} className="text-primary" />, title: "Delivery", desc: "Delivered with signature packaging" },
  ];

  return (
    <main className="min-h-screen pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-margin-mobile text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
          className="w-24 h-24 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle2 size={48} className="text-secondary" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="font-headline-lg text-headline-lg text-on-surface mb-4"
        >
          Order Confirmed!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="font-body-lg text-body-lg text-on-surface-variant mb-2"
        >
          Thank you for your purchase. Your exquisite piece is being prepared with care.
        </motion.p>
        {orderId && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-label-md text-label-md text-on-surface-variant mt-4 bg-surface-container px-6 py-3 rounded-lg inline-block"
          >
            Order ID: <span className="text-primary font-bold">{orderId.slice(0, 8).toUpperCase()}</span>
          </motion.p>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/account/orders"
            className="px-8 py-4 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity"
          >
            View My Orders
          </Link>
          <Link
            href="/shop"
            className="px-8 py-4 border border-outline-variant text-on-surface rounded-lg font-label-md text-label-md hover:border-primary hover:text-primary transition-colors"
          >
            Continue Shopping
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 p-8 bg-surface-container-low rounded-xl"
        >
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-4">
            What happens next?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="flex flex-col items-center text-center gap-2"
              >
                {step.icon}
                <h3 className="font-label-md text-label-md text-on-surface">{step.title}</h3>
                <p className="font-body-md text-[13px] text-on-surface-variant">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen pt-32 flex items-center justify-center">Loading...</div>}>
        <SuccessContent />
      </Suspense>
      <Footer />
    </>
  );
}
