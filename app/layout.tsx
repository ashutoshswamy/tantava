import type { Metadata } from "next";
import { Cormorant_Garamond, Nunito } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Tantava | Threads of Tradition and Trends",
  description:
    "Curated ethnic & Indo-Western wear for office, festive, and everyday elegance. Handcrafted kurtas, anarkalis, and fusion sets. Pan India shipping.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${cormorant.variable} ${nunito.variable}`}>
        <head />
        <body className="bg-background text-on-surface font-body-md overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
