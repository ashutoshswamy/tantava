import PolicyLayout, { PolicySection } from "../components/PolicyLayout";

export const metadata = {
  title: "Return, Exchange & Store Credit Policy — Tantava",
};

export default function ReturnPolicyPage() {
  return (
    <PolicyLayout
      title="Return, Exchange & Store Credit Policy"
      subtitle="At Tantava, every product is carefully checked before dispatch. We aim to provide a smooth and transparent shopping experience."
    >
      <PolicySection heading="Order Cancellation">
        <p>Orders cannot be cancelled after placement.</p>
      </PolicySection>

      <PolicySection heading="Refunds">
        <p>Tantava does not provide monetary refunds.</p>
        <p>For eligible cases, customers will receive Store Credit after verification.</p>
      </PolicySection>

      <PolicySection heading="Exchange Policy">
        <p>Exchange is available only for:</p>
        <ul>
          <li>Size issues</li>
          <li>Wrong product received</li>
          <li>Manufacturing defects</li>
        </ul>
        <p>Exchange requests must be submitted within 5 days of delivery.</p>
      </PolicySection>

      <PolicySection heading="Exchange Conditions">
        <p>Products must be:</p>
        <ul>
          <li>Unused</li>
          <li>Unwashed</li>
          <li>Unworn</li>
          <li>With original tags attached</li>
          <li>In original packaging</li>
        </ul>
        <p>
          Products showing signs of use, damage, alteration, or washing will
          not qualify.
        </p>
      </PolicySection>

      <PolicySection heading="Damaged or Incorrect Products">
        <p>If you receive a damaged or incorrect product, please share:</p>
        <ul>
          <li>Clear photographs of the product</li>
          <li>Order details</li>
          <li>Issue description</li>
        </ul>
        <p>within 24 hours of delivery.</p>
        <p>After verification, Tantava may provide replacement or store credit.</p>
      </PolicySection>

      <PolicySection heading="Return Shipping">
        <p>
          Customers may be responsible for return shipping charges unless the
          product received is incorrect or defective.
        </p>
      </PolicySection>

      <PolicySection heading="Store Credit">
        <p>Approved returns/exchanges will receive:</p>
        <ul>
          <li>Store Credit valid for 6 months</li>
          <li>Non-transferable credit</li>
          <li>Not redeemable for cash</li>
        </ul>
      </PolicySection>

      <PolicySection heading="Sale Items">
        <p>
          Sale and discounted products cannot be exchanged unless there is a
          major manufacturing defect.
        </p>
      </PolicySection>

      <PolicySection heading="Customized / Altered Products">
        <p>
          Customized, altered, worn, washed, or damaged products are not
          eligible for exchange.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
