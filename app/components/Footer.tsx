import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-container-low w-full py-stack-lg border-t border-outline-variant/30">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div>
          <Link
            href="/"
            className="font-headline-sm text-headline-sm text-primary mb-6 block"
          >
            Tantava
          </Link>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6 max-w-xs">
            Handcrafted luxury from Bengaluru, India. Honoring heritage,
            celebrating modern elegance.
          </p>
          <div className="flex gap-4">
            <a
              href="https://instagram.com/_tantava"
              className="text-on-surface-variant hover:text-primary transition-all"
            >
              <span className="material-symbols-outlined">photo_camera</span>
            </a>
            <a
              href="#"
              className="text-on-surface-variant hover:text-primary transition-all"
            >
              <span className="material-symbols-outlined">language</span>
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-label-md text-label-md text-secondary font-bold mb-6">
            Collections
          </h4>
          <ul className="space-y-4">
            <li>
              <Link
                href="/shop"
                className="font-body-md text-body-md text-on-surface-variant hover:text-primary underline transition-all"
              >
                Shop
              </Link>
            </li>
            <li>
              <Link
                href="/shop"
                className="font-body-md text-body-md text-on-surface-variant hover:text-primary underline transition-all"
              >
                Lehengas
              </Link>
            </li>
            <li>
              <Link
                href="/shop"
                className="font-body-md text-body-md text-on-surface-variant hover:text-primary underline transition-all"
              >
                Sarees
              </Link>
            </li>
            <li>
              <Link
                href="/shop"
                className="font-body-md text-body-md text-on-surface-variant hover:text-primary underline transition-all"
              >
                Indo-western
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-label-md text-label-md text-secondary font-bold mb-6">
            Experience
          </h4>
          <ul className="space-y-4">
            <li>
              <Link
                href="/our-story"
                className="font-body-md text-body-md text-on-surface-variant hover:text-primary underline transition-all"
              >
                Our Story
              </Link>
            </li>
            <li>
              <Link
                href="/book-appointment"
                className="font-body-md text-body-md text-on-surface-variant hover:text-primary underline transition-all"
              >
                Book Appointment
              </Link>
            </li>
            <li>
              <a
                href="https://instagram.com/_tantava"
                className="font-body-md text-body-md text-on-surface-variant hover:text-primary underline transition-all"
              >
                Instagram
              </a>
            </li>
            <li>
              <Link
                href="/contact"
                className="font-body-md text-body-md text-on-surface-variant hover:text-primary underline transition-all"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-label-md text-label-md text-secondary font-bold mb-6">
            Policies
          </h4>
          <ul className="space-y-4">
            <li>
              <a
                href="#"
                className="font-body-md text-body-md text-on-surface-variant hover:text-primary underline transition-all"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="font-body-md text-body-md text-on-surface-variant hover:text-primary underline transition-all"
              >
                Terms of Service
              </a>
            </li>
            <li>
              <a
                href="#"
                className="font-body-md text-body-md text-on-surface-variant hover:text-primary underline transition-all"
              >
                Shipping &amp; Returns
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-stack-lg pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-label-md text-label-md text-on-surface-variant">
          © 2024 Tantava. Handcrafted in Bengaluru, India.
        </p>
        <p className="font-label-md text-label-md text-on-surface-variant opacity-50">
          Made by Anahat Entertainment
        </p>
      </div>
    </footer>
  );
}
