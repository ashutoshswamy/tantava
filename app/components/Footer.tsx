import Link from "next/link";
import { Camera, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-surface-container-low w-full py-stack-lg border-t border-outline-variant/30">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div>
          <Link href="/" className="font-headline-sm text-headline-sm text-primary mb-6 block">
            Tantava
          </Link>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6 max-w-xs">
            Ethnic &amp; Indo-Western wear from Pune — kurtas, anarkalis, and fusion sets for office, festive, and everyday elegance. Pan India shipping.
          </p>
          <div className="flex gap-4">
            <a href="https://instagram.com/_tantava" className="text-on-surface-variant hover:text-primary transition-all">
              <Camera size={20} />
            </a>
            <a href="#" className="text-on-surface-variant hover:text-primary transition-all">
              <Globe size={20} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-label-md text-label-md text-secondary font-bold mb-6">Shop</h4>
          <ul className="space-y-4">
            {["All Styles", "Embroidered Kurtas", "Anarkali Sets", "Printed Suits", "Co-ord Sets"].map((label) => (
              <li key={label}>
                <Link href="/shop" className="font-body-md text-body-md text-on-surface-variant hover:text-primary underline transition-all">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-label-md text-label-md text-secondary font-bold mb-6">Experience</h4>
          <ul className="space-y-4">
            {[
              { label: "Book Appointment", href: "/book-appointment" },
              { label: "Contact",          href: "/contact" },
              { label: "Instagram",        href: "https://instagram.com/_tantava" },
            ].map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className="font-body-md text-body-md text-on-surface-variant hover:text-primary underline transition-all">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-label-md text-label-md text-secondary font-bold mb-6">Policies</h4>
          <ul className="space-y-4">
            {["Privacy Policy", "Terms of Service", "Shipping & Returns"].map((label) => (
              <li key={label}>
                <a href="#" className="font-body-md text-body-md text-on-surface-variant hover:text-primary underline transition-all">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-stack-lg pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-label-md text-label-md text-on-surface-variant">
          © 2025 Tantava. Pune, India · Pan India Shipping.
        </p>
        <p className="font-label-md text-label-md text-on-surface-variant opacity-50">
          Made by Anahat Entertainment
        </p>
      </div>
    </footer>
  );
}
