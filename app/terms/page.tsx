import PolicyLayout, { PolicySection } from "../components/PolicyLayout";

export const metadata = {
  title: "Terms of Service — Tantava",
};

export default function TermsPage() {
  return (
    <PolicyLayout
      title="Terms of Service"
      subtitle="Welcome to Tantava. By accessing our website or placing an order with us, you agree to the following Terms of Service."
    >
      <PolicySection heading="Products">
        <p>
          Tantava offers thoughtfully designed and curated women&apos;s
          apparel, including:
        </p>
        <ul>
          <li>Kurtis</li>
          <li>Co-ord Sets</li>
          <li>Three-piece Sets</li>
          <li>Festive Wear</li>
          <li>Office Wear</li>
          <li>Tops</li>
          <li>Other fashion collections</li>
        </ul>
        <p>
          Certain products are designed by Tantava, while others are
          carefully curated from trusted sources.
        </p>
        <p>
          Due to photography lighting, screen settings, handcrafted
          techniques, and fabric characteristics, slight variations in
          colour, texture, embroidery placement, or finish may occur. These
          variations are natural and are not considered defects.
        </p>
      </PolicySection>

      <PolicySection heading="Pricing">
        <p>All prices displayed on the website are in Indian Rupees (INR).</p>
        <p>Prices and product availability may change without prior notice.</p>
        <p>
          Applicable taxes, if any, will be charged according to prevailing
          laws and Tantava&apos;s registration status.
        </p>
      </PolicySection>

      <PolicySection heading="Orders">
        <p>All orders are subject to product availability.</p>
        <p>Once an order is placed, it cannot be cancelled or modified.</p>
        <p>
          In rare situations such as stock unavailability or operational
          issues, Tantava reserves the right to cancel an order and notify
          the customer.
        </p>
      </PolicySection>

      <PolicySection heading="Payments">
        <p>Payments are processed securely through trusted payment partners.</p>
        <p>
          Tantava does not store or access your card, banking, or payment
          credentials.
        </p>
        <p>
          In case payment is deducted but an order is not successfully
          created, the amount will be processed for reversal/refund
          according to the payment gateway&apos;s timelines.
        </p>
      </PolicySection>

      <PolicySection heading="Intellectual Property">
        <p>All website content including:</p>
        <ul>
          <li>Logos</li>
          <li>Product images</li>
          <li>Campaign photographs</li>
          <li>Graphics</li>
          <li>Written content</li>
        </ul>
        <p>
          belongs exclusively to Tantava and cannot be copied, reproduced, or
          used without prior written permission.
        </p>
      </PolicySection>

      <PolicySection heading="Website Usage">
        <p>You agree not to:</p>
        <ul>
          <li>Misuse the website</li>
          <li>Engage in fraudulent activities</li>
          <li>Attempt unauthorized access</li>
          <li>Use website content for commercial purposes without permission</li>
        </ul>
      </PolicySection>

      <PolicySection heading="Governing Law">
        <p>These Terms shall be governed by the laws of India.</p>
        <p>
          Any disputes relating to the website or purchases shall fall under
          the jurisdiction of courts located in Pune, Maharashtra.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
