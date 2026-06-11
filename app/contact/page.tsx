"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { MessageCircle, ArrowRight, Camera, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "bespoke",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your inquiry. We'll be in touch soon.");
  };

  return (
    <>
      <Navbar activePage="contact" />

      <main className="pt-32 pb-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-stack-md text-center max-w-2xl mx-auto"
        >
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4">
            Get in Touch
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Questions about sizing, fabric, or an order? Reach us here or chat directly on WhatsApp we typically respond within a few hours.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-7 bg-surface-container-lowest p-5 sm:p-8 md:p-12 rounded-lg shadow-sm"
          >
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-8">
              Send an Inquiry
            </h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  placeholder=" "
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="peer w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 transition-colors py-2 px-0 font-body-md text-body-md outline-none"
                />
                <label
                  htmlFor="name"
                  className="absolute left-0 -top-4 font-label-md text-label-md text-primary"
                >
                  Your Name
                </label>
              </div>

              <div className="relative">
                <input
                  type="email"
                  id="email"
                  placeholder=" "
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="peer w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 transition-colors py-2 px-0 font-body-md text-body-md outline-none"
                />
                <label
                  htmlFor="email"
                  className="absolute left-0 -top-4 font-label-md text-label-md text-primary"
                >
                  Email Address
                </label>
              </div>

              <div className="relative">
                <select
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="peer w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 transition-colors py-2 px-0 font-body-md text-body-md appearance-none outline-none"
                >
                  <option value="bespoke">Bespoke Order</option>
                  <option value="appointment">Book Appointment</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="other">General Inquiry</option>
                </select>
                <label
                  htmlFor="subject"
                  className="absolute left-0 -top-4 font-label-md text-label-md text-primary"
                >
                  Interest
                </label>
              </div>

              <div className="relative">
                <textarea
                  id="message"
                  placeholder=" "
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="peer w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 transition-colors py-2 px-0 font-body-md text-body-md resize-none outline-none"
                />
                <label
                  htmlFor="message"
                  className="absolute left-0 -top-4 font-label-md text-label-md text-primary"
                >
                  How can we help?
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-secondary text-on-secondary rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity active:scale-[0.98]"
              >
                SUBMIT INQUIRY
              </button>
            </form>
          </motion.div>

          {/* Side Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:col-span-5 space-y-gutter"
          >
            {/* Concierge Card */}
            <div className="bg-primary-container p-6 sm:p-8 rounded-lg flex min-h-[280px] flex-col justify-between items-start shadow-sm">
              <div>
                <div className="bg-primary/20 p-3 rounded-full mb-6 inline-block">
                  <MessageCircle size={24} className="text-on-primary-container" />
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-primary-container mb-2">
                  Tantava Concierge
                </h3>
                <p className="font-body-md text-body-md text-on-primary-fixed-variant mb-8">
                  Chat with us for immediate assistance, fabric swatches, or to
                  place an order via WhatsApp.
                </p>
              </div>
              <a
                href="https://wa.me/910000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-label-md text-label-md text-on-primary-container group"
              >
                START CONVERSATION
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Instagram & Studio */}
            <div className="bg-surface-container-high p-8 rounded-lg shadow-sm">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <Camera size={20} className="text-secondary" />
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface-variant">
                      Follow Our Journey
                    </p>
                    <a
                      href="https://instagram.com/_tantava"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body-lg text-body-lg text-secondary font-bold hover:underline"
                    >
                      @_tantava
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <MapPin size={20} className="text-secondary" />
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface-variant">
                      Studio Location
                    </p>
                    <p className="font-body-md text-body-md text-on-surface">
                      Kothrud, Pune, Maharashtra
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
}
