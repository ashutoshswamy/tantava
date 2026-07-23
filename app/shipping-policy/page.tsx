import PolicyLayout, { PolicySection } from "../components/PolicyLayout";

export const metadata = {
  title: "Shipping Policy — Tantava",
};

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout
      title="Shipping Policy"
      subtitle="At Tantava, we carefully prepare every order to ensure it reaches you safely and efficiently."
    >
      <PolicySection heading="Domestic Shipping (India)">
        <ul>
          <li>Orders are dispatched within 2–3 business days.</li>
          <li>Delivery generally takes 10–12 working days after dispatch.</li>
          <li>Saturdays, Sundays, and public holidays are not considered business days.</li>
          <li>
            Delivery timelines may vary depending on location, courier
            availability, and unforeseen circumstances.
          </li>
          <li>Tracking details are shared once the order is shipped.</li>
        </ul>
      </PolicySection>

      <PolicySection heading="International Shipping">
        <p>We ship worldwide.</p>
        <ul>
          <li>International shipping charges depend on destination and package weight.</li>
          <li>Delivery timelines vary based on country and customs procedures.</li>
          <li>
            Customs duties, import taxes, and additional charges (if
            applicable) are the customer&apos;s responsibility.
          </li>
          <li>International orders are not eligible for return or exchange.</li>
        </ul>
      </PolicySection>

      <PolicySection heading="Incorrect Shipping Information">
        <p>
          Customers are responsible for providing accurate delivery
          information.
        </p>
        <p>
          If an order is returned due to an incorrect or incomplete address,
          additional shipping charges for re-dispatch will be borne by the
          customer.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
