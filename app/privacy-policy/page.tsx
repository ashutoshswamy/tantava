import PolicyLayout, { PolicySection } from "../components/PolicyLayout";

export const metadata = {
  title: "Privacy Policy",
  description: "Read Tantava's privacy policy — how we collect, use, and protect your personal data.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      subtitle="Last Updated: June 2026 — At Tantava, we respect your privacy and are committed to protecting your personal information."
    >
      <PolicySection heading="Information We Collect">
        <p>We may collect:</p>
        <p className="font-bold text-on-surface">Information provided by you:</p>
        <ul>
          <li>Name</li>
          <li>Phone number</li>
          <li>Email address</li>
          <li>Billing and shipping address</li>
          <li>Order details</li>
          <li>Customer support communication</li>
        </ul>
        <p>
          Payment information is securely processed through payment gateways
          and is not stored by Tantava.
        </p>
        <p className="font-bold text-on-surface">Automatically collected information:</p>
        <p>When you browse our website, we may collect:</p>
        <ul>
          <li>Device information</li>
          <li>Browser details</li>
          <li>IP address</li>
          <li>Website activity</li>
          <li>Cookies and analytics data</li>
        </ul>
      </PolicySection>

      <PolicySection heading="How We Use Your Information">
        <p>Your information is used for:</p>
        <ul>
          <li><span className="font-bold text-on-surface">Order Processing</span> — to confirm, process, and deliver your purchases.</li>
          <li><span className="font-bold text-on-surface">Customer Support</span> — to respond to queries and resolve concerns.</li>
          <li><span className="font-bold text-on-surface">Improvement</span> — to improve our products, website experience, and services.</li>
          <li><span className="font-bold text-on-surface">Communication</span> — to send order updates, delivery notifications, and promotional communication (where consent is provided).</li>
          <li><span className="font-bold text-on-surface">Security</span> — to prevent fraud and protect our customers.</li>
        </ul>
      </PolicySection>

      <PolicySection heading="Data Protection Commitment">
        <p>Tantava does not sell, rent, or trade customer information.</p>
        <p>
          Your information is used only for providing services and improving
          your experience.
        </p>
      </PolicySection>

      <PolicySection heading="Cookies">
        <p>Cookies help us:</p>
        <ul>
          <li>Improve website performance</li>
          <li>Remember preferences</li>
          <li>Understand customer behaviour</li>
        </ul>
        <p>You may disable cookies through your browser settings.</p>
      </PolicySection>

      <PolicySection heading="Sharing of Information">
        <p>
          Information may be shared only with trusted partners required for
          business operations:
        </p>
        <ul>
          <li>Payment gateways</li>
          <li>Courier partners</li>
          <li>Technology providers</li>
          <li>Legal authorities when required</li>
        </ul>
      </PolicySection>

      <PolicySection heading="Data Security">
        <p>We use reasonable security measures to protect your personal information.</p>
        <p>However, no online system can guarantee complete security.</p>
      </PolicySection>

      <PolicySection heading="Your Rights">
        <p>You may request:</p>
        <ul>
          <li>Access to your personal information</li>
          <li>Correction of incorrect details</li>
          <li>Withdrawal of marketing consent</li>
          <li>Deletion of information where legally applicable</li>
        </ul>
      </PolicySection>

      <PolicySection heading="Third-Party Links">
        <p>
          Our website may contain links to external websites. Tantava is not
          responsible for their privacy practices.
        </p>
      </PolicySection>

      <PolicySection heading="Children's Privacy">
        <p>Our website is not intended for users below 16 years of age.</p>
      </PolicySection>

      <PolicySection heading="Applicable Law">
        <p>
          This Privacy Policy is governed by applicable Indian laws,
          including the Digital Personal Data Protection Act, 2023, wherever
          applicable.
        </p>
      </PolicySection>

      <PolicySection heading="Contact Us">
        <p className="font-bold text-on-surface">Tantava</p>
        <p>
          Kothrud, Pune 411038
          <br />
          Maharashtra, India
        </p>
        <p>
          Email:{" "}
          <a href="mailto:tantavafashion@gmail.com">tantavafashion@gmail.com</a>
        </p>
        <p>
          WhatsApp:{" "}
          <a href="https://wa.me/917558786317">+91 7558786317</a>
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
