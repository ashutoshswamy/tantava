"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ConciergeButton from "../components/ConciergeButton";

const products = [
  {
    name: "Vanya Forest Silk Saree",
    subtitle: "Heritage Banarasi • ₹1,24,000",
    badge: "Handcrafted",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxfEFOJR7eUb02ny8c8aJ11yyVWDopvGAgqdCV46XfQEbG080Zb_UM2Lww7HUuJ8zkSumRtfTdh-v9CvmIQlpUBbKRnwCBIkcgxi4oAI50PSOnOOtIJiG8dXiKQEwWpkrj5rY9I9mpGo9b6S8utBLMHR77GNyCg0v4aI7qAT6F-MemhvFL3I9kEEzakxeazEZSfujBzB9tMk1lewpCKxhHwoXqp94d_MAmoERTwR5Eqsb6JbAdPWiEXVLnblgHzWyiMpfv-x_dXDo",
    hoverImg:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDSIuDQbh8IIh7sZnfDHYn77pGQNyK8Ota9iiEgHw33QFEaCbgbgNtCgtIzkqWDDcFW3Ea7qQ9JWAYr-ke9C3PVQG3F06RFSPyNtsvTMs73u6MEswNrS_QBeXsmEL9wxzPg8SVt5JfkDy_xWRKXa_mIo2TDSK4SDa6cIRipevaZDVxD48ad9m3JZLG07d0RkjqzXgBb1vvIxMou1i1hbxK3IoBGFDBX8ggRwBf2p018P1FoGZlXryw5nswb-QqrcUjYle68I7x0rGg",
  },
  {
    name: "Meera Fusion Ensemble",
    subtitle: "Handspun Cotton • ₹85,500",
    badge: "Limited Pieces",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSIuDQbh8IIh7sZnfDHYn77pGQNyK8Ota9iiEgHw33QFEaCbgbgNtCgtIzkqWDDcFW3Ea7qQ9JWAYr-ke9C3PVQG3F06RFSPyNtsvTMs73u6MEswNrS_QBeXsmEL9wxzPg8SVt5JfkDy_xWRKXa_mIo2TDSK4SDa6cIRipevaZDVxD48ad9m3JZLG07d0RkjqzXgBb1vvIxMou1i1hbxK3IoBGFDBX8ggRwBf2p018P1FoGZlXryw5nswb-QqrcUjYle68I7x0rGg",
    hoverImg:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAxfEFOJR7eUb02ny8c8aJ11yyVWDopvGAgqdCV46XfQEbG080Zb_UM2Lww7HUuJ8zkSumRtfTdh-v9CvmIQlpUBbKRnwCBIkcgxi4oAI50PSOnOOtIJiG8dXiKQEwWpkrj5rY9I9mpGo9b6S8utBLMHR77GNyCg0v4aI7qAT6F-MemhvFL3I9kEEzakxeazEZSfujBzB9tMk1lewpCKxhHwoXqp94d_MAmoERTwR5Eqsb6JbAdPWiEXVLnblgHzWyiMpfv-x_dXDo",
  },
  {
    name: "Aditi Ivory Lehenga",
    subtitle: "Bridal Collection • ₹3,80,000",
    badge: "Handcrafted",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCsxoNU-T7HvRebuq1YDPqVcbBlIwKVhg6mNuDPa6oQlYNDNptMLMyMxQDUpdzOiobI_14-PEB-ItkFSTNJOtzb8BLco84dgnVPcirWGpUtf-ZqkuAWJP7f83SgGZ3kq0vi3tlC209r-VIRtlyWLjHzF3FBVKAH0ESXLFmNB8zf0xZCE8wFBOMOMUfXUp61O8uP8FUhEWL7kv4DX8X0HI-tJdUpTOoTFvrWYY2QzXOROPIxZIef7mD8ZK23I9MU32ZG5E5_BGXiUvk",
    hoverImg:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDSIuDQbh8IIh7sZnfDHYn77pGQNyK8Ota9iiEgHw33QFEaCbgbgNtCgtIzkqWDDcFW3Ea7qQ9JWAYr-ke9C3PVQG3F06RFSPyNtsvTMs73u6MEswNrS_QBeXsmEL9wxzPg8SVt5JfkDy_xWRKXa_mIo2TDSK4SDa6cIRipevaZDVxD48ad9m3JZLG07d0RkjqzXgBb1vvIxMou1i1hbxK3IoBGFDBX8ggRwBf2p018P1FoGZlXryw5nswb-QqrcUjYle68I7x0rGg",
  },
  {
    name: "Crimson Heritage Wrap",
    subtitle: "Muga Silk • ₹42,000",
    badge: null,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAv3LnQpTIqcI5OYHS5OHiyTafXMNHup70yzvD1HV9YGExOh0nDOUPFelqnPaMH-_PEO-AvVT2Q1aLGpiDoFIsyGBp8n2gqfSOT3s97h22v1YeWYZ4cfbA9_hnMQfDL4udwiWGoNB0wLckeIfnZLBXbYk4ve-_5-CqpN_QKFOobBba6j4OosJoglkQnB7BYjR4_R_HyS0PK1cgiXe_Yx-IeRd5rSLYa8ELHo5BdrYZW4QKBhN9mPJWwogxAuo9cHWguX_d4_mjuu5s",
    hoverImg: null,
  },
  {
    name: "Emerald Temple Set",
    subtitle: "22k Gold • ₹2,15,000",
    badge: "Limited Pieces",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYY8F0btZlw6RyfLNXerlvvzCYWP41SPvKSdVWgKeXWaffxsywpFQUtUpwPXxSCcZz0rWbbDw3q1KrI3b2uup-ePVXZSAfwFru7O4XruAJBaeaggfnQTx0f91gTrjThKF-qV2OK9bQjLPA5_xmC4HwtO-IxUJzR47BkBtUbe05tMtxKk3yIsqaqmSYAajy9fCGdMtdDL6DQ8cCbuKaG7KcU5XLWOnyDuSR_xIF1KFNtBYpyqvFcn7nB2TgaGLobAncqwL4RnxZC80",
    hoverImg: null,
  },
  {
    name: "Zia Peach Anarkali",
    subtitle: "Chiffon Silk • ₹68,000",
    badge: null,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjeBwYk8JsWTWTijrZNiLO0_k7RAIU9AdyIivz4XbqRgClhKp-FFE-GND64bRwmTLKcxh6qyaMplOIxoiR0f93WrCiaiAG5qcDDRmHCBgEwPZiwEj3ah9c8aJ7ll9bALxd7fiIAUb83oZBgvEhWk4uWfa9J7-TnCBNWwoW8gWc3ahnAIEg2cJl_gujh23tyJPITlLS_9IJDdunBiCqkJeZBMLYrkacjPPSDfO2-lzI14R16dqnhO-oiQAi3ltqW5QyyaJxM90awP4",
    hoverImg: null,
  },
];

export default function ShopPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState<(typeof products)[0] | null>(null);
  const [selectedSize, setSelectedSize] = useState("S");

  const openModal = (product: (typeof products)[0]) => {
    setModalProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalProduct(null);
  };

  return (
    <>
      <Navbar activePage="shop" />

      {/* Header */}
      <header className="pt-32 pb-12 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <nav className="flex gap-2 mb-4 text-on-surface-variant font-label-md text-label-md">
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
              <span>/</span>
              <span className="text-primary">Shop All</span>
            </nav>
            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
              The Curated Collection
            </h1>
            <p className="max-w-2xl mt-4 font-body-lg text-body-lg text-on-surface-variant">
              Discover timeless pieces handcrafted by master artisans, blending
              centuries-old heritage with modern editorial sophistication.
            </p>
          </div>
          <div className="flex items-center gap-4 border-b border-outline-variant pb-2 min-w-[200px]">
            <span className="material-symbols-outlined text-outline">sort</span>
            <select className="bg-transparent border-none focus:ring-0 font-label-md text-label-md text-on-surface-variant cursor-pointer w-full">
              <option>Sort by: Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Popularity</option>
            </select>
          </div>
        </div>
      </header>

      <main className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-stack-lg">
        <div className="flex flex-col lg:flex-row gap-gutter">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
            <div>
              <h3 className="font-label-md text-label-md text-primary mb-4 flex justify-between items-center cursor-pointer">
                CATEGORY
                <span className="material-symbols-outlined text-sm">
                  expand_more
                </span>
              </h3>
              <div className="space-y-3 font-body-md text-body-md text-on-surface-variant">
                {["Sarees", "Lehengas", "Fusion Wear", "Blouses"].map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="rounded border-outline-variant text-primary w-4 h-4"
                      defaultChecked={cat === "Fusion Wear"}
                    />
                    <span className="group-hover:text-primary transition-colors">
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-label-md text-label-md text-primary mb-4 flex justify-between items-center cursor-pointer">
                OCCASION
                <span className="material-symbols-outlined text-sm">
                  expand_more
                </span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Bridal", "Festive", "Casual", "Formal"].map((occ) => (
                  <button
                    key={occ}
                    className={`px-4 py-2 rounded-full font-label-md text-label-md transition-all ${
                      occ === "Festive"
                        ? "bg-primary text-on-primary"
                        : "border border-outline-variant hover:border-primary hover:text-primary"
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-label-md text-label-md text-primary mb-4 flex justify-between items-center cursor-pointer">
                FABRIC
                <span className="material-symbols-outlined text-sm">
                  expand_more
                </span>
              </h3>
              <div className="space-y-3 font-body-md text-body-md text-on-surface-variant">
                {["Handloom Silk", "Banarasi Georgette", "Chanderi"].map(
                  (fab) => (
                    <label key={fab} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="fabric"
                        className="rounded-full border-outline-variant text-primary w-4 h-4"
                      />
                      <span className="group-hover:text-primary transition-colors">
                        {fab}
                      </span>
                    </label>
                  )
                )}
              </div>
            </div>

            <div>
              <h3 className="font-label-md text-label-md text-primary mb-4 flex justify-between items-center cursor-pointer">
                PRICE (₹)
                <span className="material-symbols-outlined text-sm">
                  expand_more
                </span>
              </h3>
              <div className="px-2">
                <input
                  type="range"
                  min="5000"
                  max="500000"
                  step="1000"
                  className="w-full h-1 bg-outline-variant appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between mt-2 font-label-md text-label-md text-on-surface-variant">
                  <span>₹5,000</span>
                  <span>₹5,00,000+</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-label-md text-label-md text-primary mb-4">
                COLOR
              </h3>
              <div className="grid grid-cols-5 gap-3">
                {[
                  { bg: "#2D4739", title: "Forest Green" },
                  { bg: "#FFFDF9", title: "Ivory" },
                  { bg: "#934848", title: "Dusty Rose" },
                  { bg: "#C9A84C", title: "Gold" },
                  { bg: "#1b1c1a", title: "Ebony" },
                ].map((c) => (
                  <button
                    key={c.title}
                    title={c.title}
                    className="w-8 h-8 rounded-full border border-outline-variant"
                    style={{ backgroundColor: c.bg }}
                  />
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
              {products.map((product) => (
                <div key={product.name} className="group relative">
                  <div className="relative aspect-[0.73] overflow-hidden bg-surface-container mb-4">
                    {product.badge && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-secondary text-primary-container font-label-md text-[10px] px-3 py-1 uppercase tracking-widest border border-primary-container">
                          {product.badge}
                        </span>
                      </div>
                    )}
                    <img
                      alt={product.name}
                      className="w-full h-full object-cover"
                      src={product.img}
                    />
                    {product.hoverImg && (
                      <img
                        alt={product.name + " hover"}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                        src={product.hoverImg}
                      />
                    )}
                    <div className="absolute inset-0 bg-on-surface/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <button
                      onClick={() => openModal(product)}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 bg-surface text-primary font-label-md text-label-md px-6 py-3 shadow-lg transition-all duration-500 whitespace-nowrap"
                    >
                      QUICK VIEW
                    </button>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-headline-sm text-headline-sm text-primary">
                      {product.name}
                    </h3>
                    <p className="font-label-md text-label-md text-on-surface-variant">
                      {product.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-20 flex justify-center items-center gap-4">
              <button className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-all">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <span className="font-label-md text-label-md text-primary">1</span>
              {[2, 3].map((n) => (
                <button key={n} className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
                  {n}
                </button>
              ))}
              <span className="text-on-surface-variant">...</span>
              <button className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
                8
              </button>
              <button className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-all">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Quick View Modal */}
      {modalOpen && modalProduct && (
        <div
          className="fixed inset-0 z-[60] bg-on-surface/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-surface w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-on-surface hover:text-primary z-10"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 aspect-[0.73] bg-surface-container">
                <img
                  alt={modalProduct.name}
                  className="w-full h-full object-cover"
                  src={modalProduct.img}
                />
              </div>
              <div className="w-full md:w-1/2 p-8 md:p-12 space-y-6">
                <div>
                  <span className="font-label-md text-label-md text-primary tracking-widest uppercase">
                    New Arrival
                  </span>
                  <h2 className="font-headline-md text-headline-md text-primary mt-2">
                    {modalProduct.name}
                  </h2>
                  <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">
                    {modalProduct.subtitle.split("•")[1]?.trim()}
                  </p>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Each weave tells a story of heritage. Hand-loomed with pure
                  mulberry silk and dipped in organic forest dyes, this piece
                  features the signature Tantava intricate gold zari work.
                </p>
                <div className="space-y-4 pt-4 border-t border-outline-variant">
                  <div>
                    <span className="font-label-md text-label-md block mb-2">
                      Select Size
                    </span>
                    <div className="flex gap-2">
                      {["XS", "S", "M", "L"].map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-12 h-12 border rounded flex items-center justify-center font-label-md transition-all ${
                            selectedSize === size
                              ? "border-primary text-primary bg-primary/5"
                              : "border-outline-variant hover:border-primary hover:text-primary"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button className="w-full bg-primary text-on-primary py-4 rounded font-label-md text-label-md tracking-widest hover:bg-on-primary-fixed-variant transition-colors">
                    ADD TO BAG
                  </button>
                  <Link
                    href="/book-appointment"
                    className="block w-full border border-primary text-primary py-4 rounded font-label-md text-label-md tracking-widest hover:bg-primary-container/10 transition-colors text-center"
                  >
                    BOOK VIRTUAL CONSULTATION
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <ConciergeButton />
    </>
  );
}
