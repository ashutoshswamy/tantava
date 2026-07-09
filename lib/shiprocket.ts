// ─── Shiprocket API Client ────────────────────────────────────────────────
//
// TEST MODE BEHAVIOUR
// Set SHIPROCKET_TEST_MODE=true in .env.local to enable test mode.
// In test mode every outbound API call is intercepted:
//   - createShiprocketOrder  → logs payload, returns a mock response
//   - trackShipment          → returns a deterministic mock tracking object
// No network requests are made to Shiprocket in test mode, so you'll never
// accidentally create real shipments or incur charges during development.
//
// Switch to live by setting SHIPROCKET_TEST_MODE=false (or removing the var).
// ─────────────────────────────────────────────────────────────────────────

const BASE = "https://apiv2.shiprocket.in/v1/external";

const IS_TEST_MODE = process.env.SHIPROCKET_TEST_MODE === "true";

// ─── Auth ────────────────────────────────────────────────────────────────

async function getToken(): Promise<string> {
  if (IS_TEST_MODE) return "test-mode-token";

  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Shiprocket auth failed: ${data.message}`);
  return data.token;
}

// ─── Types ───────────────────────────────────────────────────────────────

export interface ShiprocketOrderItem {
  name: string;
  sku: string;
  units: number;
  selling_price: number; // rupees
}

export interface ShiprocketOrderPayload {
  orderId: string;       // our internal order ID (UUID)
  orderDate: string;     // ISO date string
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: ShiprocketOrderItem[];
  subtotal: number;      // rupees
}

export interface ShiprocketOrderResult {
  shiprocket_order_id: string;
  shipment_id: string | null;
  status: string;
  awb_code?: string;
  // raw Shiprocket response is also spread in
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// ─── Mock helpers (test mode only) ───────────────────────────────────────

function mockOrderResult(orderId: string): ShiprocketOrderResult {
  return {
    shiprocket_order_id: `TEST-SR-${orderId.slice(0, 8).toUpperCase()}`,
    shipment_id: `TEST-SHIP-${orderId.slice(0, 6).toUpperCase()}`,
    status: "NEW",
    awb_code: `TEST-AWB-${orderId.slice(0, 6).toUpperCase()}`,
    _test_mode: true,
  };
}

function mockTrackingResult(shiprocketOrderId: string) {
  return {
    data: {
      id: shiprocketOrderId,
      status: "Pickup Scheduled",
      shipments: [
        {
          courier_name: "Test Courier (Test Mode)",
          awb_code: "TESTAWB123456",
          status: "Pickup Scheduled",
          etd: new Date(Date.now() + 3 * 86_400_000).toISOString(),
        },
      ],
    },
    tracking_data: {
      shipment_track_activities: [
        {
          date: new Date().toISOString(),
          activity: "[TEST] Order received at Shiprocket",
          location: "Mumbai, MH",
          "sr-status": "1",
        },
        {
          date: new Date(Date.now() - 3_600_000).toISOString(),
          activity: "[TEST] Shipment created",
          location: "Mumbai, MH",
          "sr-status": "0",
        },
      ],
    },
    _test_mode: true,
  };
}

// ─── Create Order ────────────────────────────────────────────────────────

export async function createShiprocketOrder(
  payload: ShiprocketOrderPayload
): Promise<ShiprocketOrderResult> {
  if (IS_TEST_MODE) {
    const mock = mockOrderResult(payload.orderId);
    console.log(
      "[Shiprocket TEST MODE] createShiprocketOrder — payload logged, no API call made.\n",
      JSON.stringify({ payload, mock }, null, 2)
    );
    return mock;
  }

  const token = await getToken();

  const body = {
    order_id: payload.orderId,
    order_date: payload.orderDate,
    pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || "Primary",
    billing_customer_name: payload.customerName.split(" ")[0],
    billing_last_name: payload.customerName.split(" ").slice(1).join(" ") || "-",
    billing_address: payload.address,
    billing_city: payload.city,
    billing_pincode: payload.pincode,
    billing_state: payload.state,
    billing_country: "India",
    billing_email: payload.customerEmail,
    billing_phone: payload.customerPhone,
    shipping_is_billing: true,
    order_items: payload.items.map((item) => ({
      name: item.name,
      sku: item.sku,
      units: item.units,
      selling_price: item.selling_price,
      discount: 0,
      tax: 0,
      hsn: 0,
    })),
    payment_method: "Prepaid",
    sub_total: payload.subtotal,
    length: 10,
    breadth: 10,
    height: 5,
    weight: 0.5,
  };

  const res = await fetch(`${BASE}/orders/create/adhoc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Shiprocket order creation failed: ${JSON.stringify(data)}`);
  }

  // Shiprocket's live API returns order_id/shipment_id, not shiprocket_order_id —
  // normalise to the same shape the test-mode mock returns so callers don't
  // need to branch on IS_TEST_MODE.
  return {
    ...data,
    shiprocket_order_id: String(data.order_id),
    shipment_id: data.shipment_id != null ? String(data.shipment_id) : null,
    status: data.status,
    awb_code: data.awb_code || undefined,
  };
}

// ─── Track Shipment ──────────────────────────────────────────────────────

export async function trackShipment(shiprocketOrderId: string) {
  if (IS_TEST_MODE) {
    const mock = mockTrackingResult(shiprocketOrderId);
    console.log(
      `[Shiprocket TEST MODE] trackShipment(${shiprocketOrderId}) — returning mock data.`
    );
    return mock;
  }

  const token = await getToken();
  const res = await fetch(`${BASE}/orders/show/${shiprocketOrderId}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Shiprocket tracking failed: ${JSON.stringify(data)}`);
  }
  return data;
}
