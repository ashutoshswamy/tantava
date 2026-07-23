"use client";

import PolicyLayout from "../components/PolicyLayout";
import { ChevronDown } from "lucide-react";

const faqs: { q: string; a: React.ReactNode }[] = [
  {
    q: "Where do you ship?",
    a: <p>We ship across India and worldwide.</p>,
  },
  {
    q: "How long will it take to dispatch and deliver my order?",
    a: (
      <>
        <p>Orders are usually dispatched within 2–3 business days.</p>
        <p>
          Once dispatched, deliveries within India generally take 10–12
          working days, depending on the location and courier service.
        </p>
        <p>
          Delivery timelines are indicative and may vary due to unforeseen
          circumstances, holidays, or transit delays.
        </p>
      </>
    ),
  },
  {
    q: "How can I track my order?",
    a: (
      <p>
        Once your order has been shipped, a tracking link will be shared with
        you through your registered contact details.
      </p>
    ),
  },
  {
    q: "What payment methods do you accept?",
    a: (
      <>
        <p>We accept secure online payments through trusted payment gateways, including:</p>
        <ul>
          <li>UPI</li>
          <li>Debit Cards</li>
          <li>Credit Cards</li>
          <li>Net Banking</li>
          <li>Other payment options provided through our payment partners</li>
        </ul>
      </>
    ),
  },
  {
    q: "Do you offer Cash on Delivery (COD)?",
    a: <p>Currently, Cash on Delivery is unavailable.</p>,
  },
  {
    q: "Can I cancel my order?",
    a: (
      <p>
        Orders cannot be cancelled once placed, as processing begins
        immediately after confirmation.
      </p>
    ),
  },
  {
    q: "Do you offer exchanges?",
    a: (
      <>
        <p>Yes, exchanges are available only for:</p>
        <ul>
          <li>Size-related issues</li>
          <li>Incorrect products received</li>
          <li>Manufacturing defects</li>
        </ul>
        <p>Exchange requests must be raised within 5 days of delivery.</p>
      </>
    ),
  },
  {
    q: "Do you offer customization?",
    a: <p>Currently, we do not offer size or print customization.</p>,
  },
  {
    q: "Are sale products eligible for exchange?",
    a: (
      <p>
        Sale or discounted products are eligible for exchange only in case of
        major manufacturing defects.
      </p>
    ),
  },
  {
    q: "Are all products designed by Tantava?",
    a: (
      <p>
        Our collections include both thoughtfully designed pieces and
        carefully curated styles sourced from trusted partners.
      </p>
    ),
  },
  {
    q: "How should I care for my garments?",
    a: (
      <ul>
        <li>Dry clean festive and embellished garments.</li>
        <li>Gentle hand wash is recommended for everyday wear.</li>
        <li>Follow the care instructions provided with the product.</li>
      </ul>
    ),
  },
  {
    q: "How can I get featured on your page?",
    a: (
      <p>
        Tag @_tantava on Instagram and share your look with us. We would love
        to feature your style.
      </p>
    ),
  },
];

export default function FaqPage() {
  return (
    <PolicyLayout
      title="Frequently Asked Questions"
      subtitle="Everything you need to know about shopping with Tantava."
    >
      <div className="divide-y divide-outline-variant/40">
        {faqs.map(({ q, a }) => (
          <details key={q} className="group py-5 first:pt-0 last:pb-0">
            <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-headline-sm text-headline-sm text-on-surface">
              {q}
              <ChevronDown
                size={20}
                className="shrink-0 text-on-surface-variant transition-transform group-open:rotate-180"
              />
            </summary>
            <div className="mt-4 space-y-3 font-body-md text-body-md text-on-surface-variant [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2">
              {a}
            </div>
          </details>
        ))}
      </div>

      <div className="text-center pt-4 border-t border-outline-variant/40">
        <p className="font-headline-sm text-headline-sm text-on-surface mb-2">
          Still have questions?
        </p>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Email{" "}
          <a href="mailto:tantavafashion@gmail.com" className="text-primary underline">
            tantavafashion@gmail.com
          </a>{" "}
          or WhatsApp{" "}
          <a href="https://wa.me/917558786317" className="text-primary underline">
            +91 7558786317
          </a>
        </p>
      </div>
    </PolicyLayout>
  );
}
