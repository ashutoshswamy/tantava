"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useCart } from "@/store/cart";
import type { Product } from "@/lib/supabase";
import {
  Loader2, Award, Ruler, Check, Heart, MessageCircle, ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const accordionItems = [
  { title: "Product Description", key: "description" },
  { title: "Fabric & Care", content: "Dry Clean Only. Store in muslin cloth away from direct sunlight." },
  { title: "Delivery & Returns", content: "Complimentary shipping across India. 14–21 working days. Returns within 7 days for standard sizes." },
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("S");
  const [selectedImg, setSelectedImg] = useState(0);
  const [openAccordion, setOpenAccordion] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) router.push("/shop");
        else { setProduct(data); setLoading(false); }
      });
  }, [params.id, router]);

  const formatPrice = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "",
      size: selectedSize,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 size={48} className="text-primary animate-spin" />
    </div>
  );

  if (!product) return null;

  return (
    <>
      <Navbar activePage="shop" />
      <main className="pt-24 pb-stack-lg">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <nav className="flex gap-2 text-on-surface-variant font-label-md text-label-md mb-8">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-primary">Shop</Link>
            <span>/</span>
            <span className="text-on-surface">{product.name}</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12"
          >
            <div className="lg:col-span-7 flex flex-col md:flex-row-reverse gap-4">
              <div className="relative w-full aspect-[1/1.2] bg-surface-container overflow-hidden rounded-lg group">
                <img
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={product.images[selectedImg] || product.images[0]}
                />
                {product.badge && (
                  <div className="absolute top-4 left-4 bg-secondary text-on-secondary px-3 py-1 rounded-sm flex items-center gap-2 border border-primary-container">
                    <Award size={14} />
                    <span className="font-label-md text-[12px] tracking-widest uppercase">{product.badge}</span>
                  </div>
                )}
                {product.stock_quantity <= 3 && product.stock_quantity > 0 && (
                  <div className="absolute bottom-4 left-4 bg-error/90 text-on-error px-3 py-1 rounded text-[12px] font-label-md">
                    Only {product.stock_quantity} left
                  </div>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="flex md:flex-col gap-4 overflow-x-auto md:w-24">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImg(i)}
                      className={`flex-shrink-0 w-20 h-24 bg-surface-container rounded-sm overflow-hidden p-0.5 transition-opacity ${i === selectedImg ? "product-thumbnail-active" : "opacity-60 hover:opacity-100"}`}
                    >
                      <img alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover rounded-sm" src={img} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-5 flex flex-col gap-stack-md">
              <div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">{product.name}</h1>
                <p className="font-headline-sm text-headline-sm text-primary">{formatPrice(product.price)}</p>
                <p className="text-on-surface-variant font-label-md text-label-md mt-1">MRP incl. of all taxes</p>
                {product.fabric && (
                  <p className="font-label-md text-[12px] text-on-surface-variant mt-1 uppercase tracking-wider">
                    {product.fabric}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-6">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-label-md text-label-md uppercase tracking-wider">Select Size</span>
                    <button className="text-primary font-label-md text-label-md underline underline-offset-4 hover:opacity-80 transition-opacity flex items-center gap-1">
                      <Ruler size={16} />
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
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-outline-variant hover:border-primary"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-4 pt-4">
                  <div className="flex gap-4">
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock_quantity === 0}
                      className={`flex-1 font-label-md text-label-md py-4 rounded-lg uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 ${
                        added
                          ? "bg-secondary text-on-secondary"
                          : product.stock_quantity === 0
                          ? "bg-surface-container-high text-on-surface-variant cursor-not-allowed"
                          : "bg-secondary text-on-secondary hover:bg-secondary/90"
                      }`}
                    >
                      <AnimatePresence mode="wait">
                        {added ? (
                          <motion.span
                            key="added"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-2"
                          >
                            <Check size={18} />
                            Added to Bag
                          </motion.span>
                        ) : product.stock_quantity === 0 ? (
                          <motion.span key="out">Out of Stock</motion.span>
                        ) : (
                          <motion.span key="add">Add to Bag</motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                    <button className="w-14 h-14 border border-outline-variant flex items-center justify-center rounded-lg hover:border-primary hover:text-primary transition-all active:scale-90">
                      <Heart size={20} />
                    </button>
                  </div>
                  <Link
                    href="/book-appointment"
                    className="w-full flex items-center justify-center gap-2 border border-primary-container text-primary font-label-md text-label-md py-4 rounded-lg uppercase tracking-widest hover:bg-primary/5 transition-all"
                  >
                    <MessageCircle size={20} />
                    Request Custom Size
                  </Link>
                </div>
              </div>

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
                      <ChevronDown
                        size={20}
                        className="chevron-icon transition-transform duration-300"
                      />
                    </button>
                    <div className="accordion-content pt-2">
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        {item.key === "description" ? product.description : item.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
