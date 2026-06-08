"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ConciergeButton from "../components/ConciergeButton";

const relatedProducts = [
  {
    name: "Heritage Gold Choker",
    price: "₹32,500",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvGlowhd0wwj0b824HleHSuKgFPlvluBl7kMHk8ObSInEuY5O3-TIP-YGil_Oe__IcHNPQmBqYC0R-_qyimcD2NGCT2EQBUfWwWTtZgzclgtcuA42jskjgSGXRxOJPpL4r8_UctTv8w76XjuC3lcV3JmvIp3XxFuSZydkXFncbuJLu7r4UAxaQofn9idDfIn3JXQ6rMEBHTlJplm7FkaggOVWnkfs2oOAKVPf9gHvy41-8aAMwjfkPz3W7-kP_KdL-_aMOc98s6Kg",
  },
  {
    name: "Ivory Zardosi Heels",
    price: "₹12,200",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCk3S2zAgCRkJl14bFQFcH3Bz6iV2-qyL0pGYzQZdgd3W8r3YldqeU6o2dWjK8Xa-FrmS1AZJl_0kou62DQASsSmvMPxxN4b8XK6pnyttyPRj5gHBLWFWEtJWTVUTXfFAjinK7lpg8fGBHMOQx3StKkEhGniAMuoXKrLdOLCsT83hjmOn-u_M6GpgdzZfY2R39cUwpaHagn9Dmj6y2Nw8K4jTFsXU0edUD6LMjSo4VBdJ-DvaD392BmPJ4RLlMAuMgDOD-tiVCw3_I",
  },
  {
    name: "Beaded Silk Potli",
    price: "₹6,800",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBG0ANjCLHP10TO-g9SIIqAcWSHsC9exgHkVYzEEfI87qwk_YsgEvtlnv0ySO4HNkSZIhIJudRwoL3yW57F6trG7S0rXqWrlatMUOEl4ncKlavpQiaUU9cKf0RQp2cMdYbDIlPSayoYRxtyUoqOQS6Ne9yJIcvJ1dHDAu_3KJJ_Bs_AkjbKUOz6tr_oS6Ymm4Nr3w3Ju-zAEqR8rGAPmgQLBOa8WwlyHoK0xjVQUIUHfhktm9dJbHYbndX0gECkaONg_DJHPfzNkRI",
  },
  {
    name: "Floral Motif Tikka",
    price: "₹18,900",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhWRDncLmdQzrrNTNaDwUmxNdP3aQnZWiX4HHGvQUghck0SSjXtFycs8HOsrSr_h5Tp_wzi-EdEq4fcsINsjN1fUms1UED05BswV5LC4gIwH88AO-DoIRR40krHPdGHHRFK3M7twNFjocUpWpAmD1Ag3NbaKLngxhSrrAdrjNnHGR1oLYKSotBuj6_78hmo9KkOApw4CKcZZ9r8_nyPBq0SuYKSWZnQpjPNUNvwTevNg1VPvOWXtlkn4edPzYBLn5xcdcULhoqEjY",
  },
];

const accordionItems = [
  {
    title: "Product Description",
    content:
      "A masterpiece of Indian craftsmanship, this Ivory lehenga is intricately hand-embroidered with 24K gold zari threads. Features a silk-organza base with heavy kalis and a sheer dupatta adorned with micro-pearls. Perfect for high-profile weddings and festive galas.",
  },
  {
    title: "Fabric & Care",
    content: "Body: 100% Mulberry Silk-Organza • Lining: Soft Cotton Shantoon • Embroidery: Gold Zari & Resham • Care: Dry Clean Only. Store in a muslin cloth.",
  },
  {
    title: "Delivery & Returns",
    content:
      "Complimentary shipping across India. Delivery within 14-21 working days for handcrafted pieces. Returns accepted within 7 days for standard sizes only. Custom orders are final sale.",
  },
];

export default function ProductPage() {
  const [selectedSize, setSelectedSize] = useState("S");
  const [openAccordion, setOpenAccordion] = useState(0);

  return (
    <>
      <Navbar activePage="shop" />

      <main className="pt-24 pb-stack-lg">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          {/* Breadcrumbs */}
          <nav className="flex gap-2 text-on-surface-variant font-label-md text-label-md mb-8">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-primary">Shop</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-primary">Collections</Link>
            <span>/</span>
            <span className="text-on-surface">Ivory &amp; Gold Handcrafted Lehenga</span>
          </nav>

          {/* Product Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Image Gallery */}
            <div className="lg:col-span-7 flex flex-col md:flex-row-reverse gap-4">
              <div className="relative w-full aspect-[1/1.2] bg-surface-container overflow-hidden rounded-lg group">
                <img
                  alt="Ivory & Gold Handcrafted Lehenga"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsxoNU-T7HvRebuq1YDPqVcbBlIwKVhg6mNuDPa6oQlYNDNptMLMyMxQDUpdzOiobI_14-PEB-ItkFSTNJOtzb8BLco84dgnVPcirWGpUtf-ZqkuAWJP7f83SgGZ3kq0vi3tlC209r-VIRtlyWLjHzF3FBVKAH0ESXLFmNB8zf0xZCE8wFBOMOMUfXUp61O8uP8FUhEWL7kv4DX8X0HI-tJdUpTOoTFvrWYY2QzXOROPIxZIef7mD8ZK23I9MU32ZG5E5_BGXiUvk"
                />
                <div className="absolute top-4 left-4 bg-secondary text-on-secondary px-3 py-1 rounded-sm flex items-center gap-2 border border-primary-container">
                  <span className="material-symbols-outlined text-[14px]">workspace_premium</span>
                  <span className="font-label-md text-[12px] tracking-widest uppercase">Handcrafted</span>
                </div>
              </div>
              <div className="flex md:flex-col gap-4 overflow-x-auto md:w-24">
                {[0, 1, 2].map((i) => (
                  <button
                    key={i}
                    className={`flex-shrink-0 w-20 h-24 bg-surface-container rounded-sm overflow-hidden p-0.5 transition-opacity ${i === 0 ? "product-thumbnail-active" : "opacity-60 hover:opacity-100"}`}
                  >
                    <img
                      alt={`Thumbnail ${i + 1}`}
                      className="w-full h-full object-cover rounded-sm"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsxoNU-T7HvRebuq1YDPqVcbBlIwKVhg6mNuDPa6oQlYNDNptMLMyMxQDUpdzOiobI_14-PEB-ItkFSTNJOtzb8BLco84dgnVPcirWGpUtf-ZqkuAWJP7f83SgGZ3kq0vi3tlC209r-VIRtlyWLjHzF3FBVKAH0ESXLFmNB8zf0xZCE8wFBOMOMUfXUp61O8uP8FUhEWL7kv4DX8X0HI-tJdUpTOoTFvrWYY2QzXOROPIxZIef7mD8ZK23I9MU32ZG5E5_BGXiUvk"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:col-span-5 flex flex-col gap-stack-md">
              <div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">
                  Ivory &amp; Gold Handcrafted Lehenga
                </h1>
                <p className="font-headline-sm text-headline-sm text-primary">₹85,000</p>
                <p className="text-on-surface-variant font-label-md text-label-md mt-1">
                  MRP incl. of all taxes
                </p>
              </div>

              <div className="flex flex-col gap-6">
                {/* Size Selection */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-label-md text-label-md uppercase tracking-wider">
                      Select Size
                    </span>
                    <button className="text-primary font-label-md text-label-md underline underline-offset-4 hover:opacity-80 transition-opacity flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">straighten</span>
                      Size Guide
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {["XS", "S", "M", "L", "XL"].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`h-12 border font-label-md flex items-center justify-center transition-colors ${
                          selectedSize === size
                            ? "border-primary bg-primary/5"
                            : "border-outline-variant hover:border-primary"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col gap-4 pt-4">
                  <div className="flex gap-4">
                    <button className="flex-1 bg-secondary text-on-secondary font-label-md text-label-md py-4 rounded-lg uppercase tracking-widest hover:bg-secondary/90 transition-all shadow-md active:scale-95">
                      Add to Cart
                    </button>
                    <button className="w-14 h-14 border border-outline-variant flex items-center justify-center rounded-lg hover:border-primary hover:text-primary transition-all active:scale-90">
                      <span className="material-symbols-outlined">favorite</span>
                    </button>
                  </div>
                  <Link
                    href="/book-appointment"
                    className="w-full flex items-center justify-center gap-2 border border-primary-container text-primary font-label-md text-label-md py-4 rounded-lg uppercase tracking-widest hover:bg-primary/5 transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px]">chat</span>
                    Request Custom Size
                  </Link>
                </div>
              </div>

              {/* Accordion */}
              <div className="border-t border-outline-variant pt-4">
                {accordionItems.map((item, i) => (
                  <div
                    key={item.title}
                    className={`accordion-item border-b border-outline-variant mb-4 pb-4 ${openAccordion === i ? "open" : ""}`}
                  >
                    <button
                      onClick={() => setOpenAccordion(openAccordion === i ? -1 : i)}
                      className="w-full flex justify-between items-center text-left py-2 group"
                    >
                      <span className="font-label-md text-label-md uppercase tracking-wider group-hover:text-primary transition-colors">
                        {item.title}
                      </span>
                      <span className="material-symbols-outlined chevron-icon transition-transform duration-300">
                        expand_more
                      </span>
                    </button>
                    <div className="accordion-content pt-2">
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related Products */}
          <section className="mt-stack-lg pt-stack-lg border-t border-outline-variant">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface">
                  Complete the Look
                </h2>
                <p className="text-on-surface-variant mt-2">
                  Curated additions for your ensemble
                </p>
              </div>
              <Link
                href="/shop"
                className="text-primary font-label-md text-label-md underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
              {relatedProducts.map((rel) => (
                <div key={rel.name} className="group cursor-pointer">
                  <div className="relative aspect-[1/1.2] mb-4 bg-surface-container overflow-hidden rounded-sm shadow-sm transition-all hover:shadow-md">
                    <img
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      src={rel.img}
                      alt={rel.name}
                    />
                    <div className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-[20px]">favorite</span>
                    </div>
                  </div>
                  <h3 className="font-label-md text-label-md text-on-surface-variant group-hover:text-primary transition-colors uppercase">
                    {rel.name}
                  </h3>
                  <p className="font-body-md text-body-md text-primary mt-1">{rel.price}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
      <ConciergeButton />
    </>
  );
}
