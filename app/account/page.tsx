"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { User, Package, CalendarDays, ShoppingBag, Headphones } from "lucide-react";

const quickLinks = [
  { href: "/account/orders",    icon: <Package size={32} />,      title: "My Orders",         desc: "Track and manage your orders" },
  { href: "/book-appointment",  icon: <CalendarDays size={32} />, title: "Book Appointment",  desc: "Schedule a private consultation" },
  { href: "/shop",              icon: <ShoppingBag size={32} />,  title: "Continue Shopping", desc: "Explore our curated collections" },
  { href: "/contact",           icon: <Headphones size={32} />,   title: "Support",            desc: "Get help with your orders" },
];

export default function AccountPage() {
  const { user } = useUser();

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-stack-lg min-h-screen">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="mb-12">
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">My Account</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Welcome back, {user?.firstName || "valued customer"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <div className="bg-surface-container-low rounded-xl p-8 flex flex-col items-center text-center gap-4">
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={40} className="text-primary" />
                </div>
              )}
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                  {user?.fullName}
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {user?.emailAddresses[0]?.emailAddress}
                </p>
              </div>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="bg-surface-container-low rounded-xl p-6 hover:bg-surface-container transition-colors group"
                >
                  <div className="text-primary mb-3 group-hover:scale-110 transition-transform inline-block">
                    {item.icon}
                  </div>
                  <h3 className="font-headline-sm text-[18px] text-on-surface mb-1">
                    {item.title}
                  </h3>
                  <p className="font-body-md text-[14px] text-on-surface-variant">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
