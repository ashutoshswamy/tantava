"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ConciergeButton from "../components/ConciergeButton";

export default function BookAppointmentPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    occasion: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you! We will call you within 24 hours to finalize your time slot.");
  };

  return (
    <>
      <Navbar activePage="book-appointment" />

      <main className="pt-32 pb-stack-lg">
        {/* Hero */}
        <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-16 text-center">
          <h1 className="font-headline-lg text-headline-lg md:text-display-lg mb-4 text-primary">
            Private Consultations
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Experience the art of slow fashion with a personalized walkthrough
            of our latest handcrafted collections at our Bengaluru studio.
          </p>
        </section>

        {/* Booking + Info */}
        <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-gutter">
          {/* Studio Info */}
          <div className="lg:col-span-5 space-y-12">
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
                <h3 className="font-headline-sm text-headline-sm text-primary mb-2">
                  Our Studio
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  42, Heritage Lane, Indiranagar
                  <br />
                  Bengaluru, Karnataka 560038
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
                  <span className="material-symbols-outlined">chat</span>
                  Quick Contact via WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-7 bg-surface-container-lowest p-8 md:p-12 shadow-[0_10px_40px_rgba(45,71,57,0.04)] rounded-lg">
            <h2 className="font-headline-sm text-headline-sm text-primary mb-8">
              Request an Appointment
            </h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative group">
                  <input
                    type="text"
                    id="name"
                    placeholder=" "
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="peer w-full bg-transparent border-0 border-b border-outline-variant py-2 font-body-md text-on-surface focus:ring-0 focus:border-primary transition-all outline-none"
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-0 top-2 font-label-md text-label-md text-on-surface-variant transition-all peer-focus:-top-4 peer-focus:text-primary peer-focus:text-label-md peer-[:not(:placeholder-shown)]:-top-4"
                  >
                    Full Name
                  </label>
                </div>
                <div className="relative group">
                  <input
                    type="tel"
                    id="phone"
                    placeholder=" "
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="peer w-full bg-transparent border-0 border-b border-outline-variant py-2 font-body-md text-on-surface focus:ring-0 focus:border-primary transition-all outline-none"
                  />
                  <label
                    htmlFor="phone"
                    className="absolute left-0 top-2 font-label-md text-label-md text-on-surface-variant transition-all peer-focus:-top-4 peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-4"
                  >
                    Phone Number
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative group">
                  <input
                    type="date"
                    id="date"
                    placeholder=" "
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="peer w-full bg-transparent border-0 border-b border-outline-variant py-2 font-body-md text-on-surface focus:ring-0 focus:border-primary transition-all outline-none"
                  />
                  <label
                    htmlFor="date"
                    className="absolute left-0 -top-4 font-label-md text-label-md text-on-surface-variant"
                  >
                    Preferred Date
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
                    <option value="wedding">Wedding</option>
                    <option value="festive">Festive Celebration</option>
                    <option value="everyday">Everyday Luxury</option>
                    <option value="gift">Gifting</option>
                  </select>
                  <label
                    htmlFor="occasion"
                    className="absolute left-0 -top-4 font-label-md text-label-md text-on-surface-variant"
                  >
                    Occasion
                  </label>
                  <span className="absolute right-0 top-2 material-symbols-outlined text-on-surface-variant pointer-events-none">
                    expand_more
                  </span>
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
                  className="w-full md:w-auto px-12 py-4 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  Confirm Request
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
                <p className="mt-4 font-label-md text-[12px] text-on-surface-variant opacity-70">
                  We will call you within 24 hours to finalize your time slot.
                </p>
              </div>
            </form>
          </div>
        </section>

        {/* Gallery */}
        <section className="mt-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "https://lh3.googleusercontent.com/aida-public/AB6AXuDOlC7Rn-FI2A2-tYaOCeRtH8X9VsP19Rxd_u2MWQLJQCuDyHTm61nLfE1x5c22TIjPlZvBQWUxIhsbQrjjFY4cB49F5_OU1EocSQbNMidXIzaAi2PKBzmMTcCcKREhBlpeArbmylVvUCLuIZ5EwxqMdaJ2Pf6vTJDul4lNvAmRNJyG800oEZj-EQxYC7vUJED_0Uj6r2QiH09tg3R3un4swm8pE87CSZl95pvPar1FN3gOGBIb_RvFLKArWarVvvFhTtvdbIX7MQg",
              "https://lh3.googleusercontent.com/aida-public/AB6AXuBZuCrA6WRqVHoiU2tHvB_r74Z3wKPPCTdxdUs1KGKwiXEF3YNdQiikaSrXoJeeguSrFXNvlnE5EuWUsdWHdbuk6ERvpeCddWlxU2bROiVZsH2Gi7JRbcx_ifHrAb7FamQZaktCa9RyDvsMtY0x9ZRuvpGzSPyY05qJ2Xr5a7QICPm6tA_flbJZe94_mLdyeGPG9hD_hurozn8M4a74_AWJcC7AhZ9yB_aRXDb9JU4W1_KSvvupwNWi8VP2QKNO8oKu-bG3bFGjnUU",
              "https://lh3.googleusercontent.com/aida-public/AB6AXuAgukwLoJjeKH58tUIJ4t10sVGhETS-KuBDrvboi0wTNKHSbZXeJjB3gaKWWg2_HmDoMom_XpNPfwhO0y9p1lFHltIOu-qgWBxQ61u40N90PeaLByp746HUfBqQSVesROlQizKAzOm98728-yOUACceF-3wtn004g9qGh7o28keAZH53xn5ku13-NVjU1hOL91OYyBp3mJ4xXdtVJq0UusQDg7HcM_LCCRAXKVCxxSJLi5HonEYinwdn7vcnkatcjSZCslrzF_dFMk",
              "https://lh3.googleusercontent.com/aida-public/AB6AXuD-D5Bo2LGkFUfbyyQJv1FQ9ICDPz3v4VhB6-6LJeCpUAJfvpjdZ6O-ok38GINmZPhIUMu7TuUak9Nb2xko0m_-88vpXyNLahcxYnxH0bb6CGa13BlqVxSOLABuvAmrt8J_eN9HQDnx0EixQcI5EfSJZmeLOcmAskokobmTkkxOoJOw6NG0UFGFuXxaoOvD9_IMBuDbz5qCpcXxzc7GZEuIOFfCcxvMwGQJVAwYdijYvL1LDvX-OXPRmspegdyF6GZfhzyC28gWeGg",
            ].map((src, i) => (
              <div
                key={i}
                className={`aspect-[3/4] bg-surface-container overflow-hidden ${i % 2 === 1 ? "translate-y-8" : ""}`}
              >
                <img className="w-full h-full object-cover" src={src} alt={`Gallery ${i + 1}`} />
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <ConciergeButton />
    </>
  );
}
