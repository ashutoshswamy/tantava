import type { Metadata } from "next";
import { Cormorant_Garamond, Nunito, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import ThemeInjector from "./components/ThemeInjector";
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

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-playfair",
});

const SITE_URL = "https://thetantava.in";
const SITE_NAME = "Tantava";
const DESCRIPTION =
  "Curated ethnic & Indo-Western wear for office, festive, and everyday elegance. Handcrafted kurtas, anarkalis, and fusion sets. Pan India shipping.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Tantava | Threads of Tradition and Trends",
    template: "%s | Tantava",
  },
  description: DESCRIPTION,
  keywords: [
    "Tantava",
    "ethnic wear",
    "Indo-Western wear",
    "kurtas",
    "anarkalis",
    "handloom sarees",
    "fusion sets",
    "Indian fashion online",
  ],
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: "Tantava | Threads of Tradition and Trends",
    description: DESCRIPTION,
    locale: "en_IN",
    images: [{ url: "/og-image.png", width: 1729, height: 910, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tantava | Threads of Tradition and Trends",
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: SITE_NAME,
  url: SITE_URL,
  sameAs: ["https://instagram.com/_tantava"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${cormorant.variable} ${nunito.variable} ${playfair.variable}`}>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
          />
        </head>
        <body className="bg-background text-on-surface font-body-md overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
          <Script src="https://www.googletagmanager.com/gtag/js?id=G-SDE2LDM8ZE" strategy="afterInteractive" />
          <Script id="ga-gtag" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-SDE2LDM8ZE');`}
          </Script>
          <ThemeInjector />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
