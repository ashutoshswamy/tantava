import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { trackShipment } from "@/lib/shiprocket";
import { apiError } from "@/lib/api-utils";

const IS_TEST_MODE = process.env.SHIPROCKET_TEST_MODE === "true";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify the order belongs to this user
  const supabase = createServerSupabase();
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, user_id, shiprocket_order_id, shiprocket_shipment_id, shiprocket_awb_code")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.user_id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // In test mode with no shiprocket_order_id yet, synthesise a plausible mock
  if (IS_TEST_MODE && !order.shiprocket_order_id) {
    return NextResponse.json({
      tracking: {
        shiprocket_order_id: `TEST-SR-${orderId.slice(0, 8).toUpperCase()}`,
        shiprocket_shipment_id: `TEST-SHIP-${orderId.slice(0, 6).toUpperCase()}`,
        courier_name: "Test Courier (Test Mode)",
        awb_code: `TESTAWB${orderId.slice(0, 6).toUpperCase()}`,
        status: "Pickup Scheduled",
        tracking_url: null,
        activities: [
          {
            date: new Date().toISOString(),
            activity: "[TEST MODE] Shipment created on Shiprocket",
            location: "Mumbai, MH",
          },
          {
            date: new Date(Date.now() - 3_600_000).toISOString(),
            activity: "[TEST MODE] Order synced to Shiprocket",
            location: "Mumbai, MH",
          },
        ],
        estimated_delivery: new Date(Date.now() + 3 * 86_400_000).toISOString(),
        _test_mode: true,
      },
    });
  }

  // No Shiprocket order linked yet (live mode)
  if (!order.shiprocket_order_id) {
    return NextResponse.json({
      tracking: null,
      message: "Shipment not yet assigned",
    });
  }

  try {
    // Uses lib/shiprocket.ts which also respects IS_TEST_MODE internally
    const data = await trackShipment(order.shiprocket_order_id);

    const shipment = data?.data?.shipments?.[0] ?? null;
    const activities =
      data?.tracking_data?.shipment_track_activities ??
      data?.data?.shipment_track_activities ??
      [];

    const awb = shipment?.awb_code ?? order.shiprocket_awb_code ?? null;

    return NextResponse.json({
      tracking: {
        shiprocket_order_id: order.shiprocket_order_id,
        shiprocket_shipment_id: order.shiprocket_shipment_id ?? null,
        courier_name: shipment?.courier_name ?? null,
        awb_code: awb,
        status: shipment?.status ?? data?.data?.status ?? null,
        tracking_url: awb ? `https://shiprocket.co/tracking/${awb}` : null,
        activities,
        estimated_delivery: shipment?.etd ?? null,
        _test_mode: IS_TEST_MODE || data?._test_mode || false,
      },
    });
  } catch (err) {
    return apiError(
      "shiprocket.track.GET",
      err,
      500,
      "Failed to fetch tracking info"
    );
  }
}
