import { NextResponse } from "next/server";

// Logs the real error server-side, returns a generic message to the client
// so internal schema/constraint details never leak in API responses.
export function apiError(context: string, error: unknown, status = 500, publicMessage = "Something went wrong") {
  console.error(`[api] ${context}:`, error);
  return NextResponse.json({ error: publicMessage }, { status });
}

export class ValidationError extends Error {}

function str(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}

function num(v: unknown): number | undefined {
  return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}

export function validateProductInput(body: Record<string, unknown>, partial: boolean) {
  const out: Record<string, unknown> = {};
  const required = (key: string, val: unknown) => {
    if (!partial && val === undefined) throw new ValidationError(`${key} is required`);
  };

  if ("name" in body || !partial) {
    const v = str(body.name);
    required("name", v);
    if (v !== undefined) out.name = v;
  }
  if ("price" in body || !partial) {
    const v = num(body.price);
    required("price", v);
    if (v !== undefined) {
      if (v < 0) throw new ValidationError("price must not be negative");
      out.price = v;
    }
  }
  if ("discount_price" in body) {
    const v = body.discount_price;
    if (v !== null) {
      const n = num(v);
      if (n === undefined || n < 0) throw new ValidationError("discount_price must be a non-negative number or null");
      out.discount_price = n;
    } else {
      out.discount_price = null;
    }
  }
  if ("category" in body) {
    const v = str(body.category);
    if (v !== undefined) out.category = v;
  }
  if ("description" in body) {
    const v = str(body.description);
    if (v !== undefined) out.description = v;
  }
  if ("fabric" in body) {
    const v = body.fabric;
    if (v !== null && typeof v !== "string") throw new ValidationError("fabric must be a string or null");
    out.fabric = v;
  }
  if ("care" in body) {
    const v = body.care;
    if (v !== null && typeof v !== "string") throw new ValidationError("care must be a string or null");
    out.care = v;
  }
  if ("badge" in body) {
    const v = body.badge;
    if (v !== null && typeof v !== "string") throw new ValidationError("badge must be a string or null");
    out.badge = v;
  }
  if ("free_delivery" in body) {
    if (typeof body.free_delivery !== "boolean") throw new ValidationError("free_delivery must be a boolean");
    out.free_delivery = body.free_delivery;
  }
  if ("sku" in body) {
    const v = body.sku;
    if (v !== null && typeof v !== "string") throw new ValidationError("sku must be a string or null");
    out.sku = v;
  }
  if ("images" in body) {
    if (!Array.isArray(body.images) || !body.images.every((i) => typeof i === "string")) {
      throw new ValidationError("images must be an array of strings");
    }
    out.images = body.images;
  }
  if ("size_inventory" in body) {
    if (typeof body.size_inventory !== "object" || body.size_inventory === null || Array.isArray(body.size_inventory)) {
      throw new ValidationError("size_inventory must be an object");
    }
    for (const v of Object.values(body.size_inventory as Record<string, unknown>)) {
      if (typeof v !== "number" || !Number.isFinite(v) || v < 0) {
        throw new ValidationError("size_inventory values must be non-negative numbers");
      }
    }
    out.size_inventory = body.size_inventory;
  }
  if ("collection_id" in body) {
    const v = body.collection_id;
    if (v !== null && typeof v !== "string") throw new ValidationError("collection_id must be a string or null");
    out.collection_id = v;
  }
  if ("is_active" in body) {
    if (typeof body.is_active !== "boolean") throw new ValidationError("is_active must be a boolean");
    out.is_active = body.is_active;
  }
  if ("sort_order" in body) {
    const v = num(body.sort_order);
    if (v === undefined) throw new ValidationError("sort_order must be a number");
    out.sort_order = v;
  }

  return out;
}

export function validateCategoryInput(body: Record<string, unknown>, partial: boolean) {
  const out: Record<string, unknown> = {};
  if ("name" in body || !partial) {
    const v = str(body.name);
    if (!partial && v === undefined) throw new ValidationError("name is required");
    if (v !== undefined) out.name = v;
  }
  if ("slug" in body) {
    const v = str(body.slug);
    if (v !== undefined) out.slug = v;
  }
  if ("is_active" in body) {
    if (typeof body.is_active !== "boolean") throw new ValidationError("is_active must be a boolean");
    out.is_active = body.is_active;
  }
  if ("sort_order" in body) {
    const v = num(body.sort_order);
    if (v === undefined) throw new ValidationError("sort_order must be a number");
    out.sort_order = v;
  }
  return out;
}

export function validateCollectionInput(body: Record<string, unknown>, partial: boolean) {
  const out: Record<string, unknown> = {};
  if ("name" in body || !partial) {
    const v = str(body.name);
    if (!partial && v === undefined) throw new ValidationError("name is required");
    if (v !== undefined) out.name = v;
  }
  if ("slug" in body) {
    const v = str(body.slug);
    if (v !== undefined) out.slug = v;
  }
  if ("description" in body) {
    const v = body.description;
    if (v !== null && typeof v !== "string") throw new ValidationError("description must be a string or null");
    out.description = v;
  }
  if ("cover_image" in body) {
    const v = body.cover_image;
    if (v !== null && typeof v !== "string") throw new ValidationError("cover_image must be a string or null");
    out.cover_image = v;
  }
  if ("is_active" in body) {
    if (typeof body.is_active !== "boolean") throw new ValidationError("is_active must be a boolean");
    out.is_active = body.is_active;
  }
  if ("sort_order" in body) {
    const v = num(body.sort_order);
    if (v === undefined) throw new ValidationError("sort_order must be a number");
    out.sort_order = v;
  }
  return out;
}

export function validateSettingsInput(body: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  if ("delivery_info" in body) {
    const v = str(body.delivery_info);
    if (v === undefined) throw new ValidationError("delivery_info must be a string");
    out.delivery_info = v;
  }
  if ("returns_info" in body) {
    const v = str(body.returns_info);
    if (v === undefined) throw new ValidationError("returns_info must be a string");
    out.returns_info = v;
  }
  if ("hero_image" in body) {
    if (body.hero_image !== null && typeof body.hero_image !== "string") {
      throw new ValidationError("hero_image must be a string or null");
    }
    out.hero_image = body.hero_image;
  }
  if ("checkout_mode" in body) {
    const v = str(body.checkout_mode);
    if (v === undefined || !["razorpay", "whatsapp"].includes(v)) {
      throw new ValidationError("checkout_mode must be 'razorpay' or 'whatsapp'");
    }
    out.checkout_mode = v;
  }
  if ("whatsapp_number" in body) {
    const v = str(body.whatsapp_number);
    if (v === undefined) throw new ValidationError("whatsapp_number must be a string");
    out.whatsapp_number = v;
  }
  if ("testimonials_enabled" in body) {
    if (typeof body.testimonials_enabled !== "boolean") throw new ValidationError("testimonials_enabled must be a boolean");
    out.testimonials_enabled = body.testimonials_enabled;
  }
  if ("sale_ticker_text" in body) {
    const v = str(body.sale_ticker_text);
    if (v === undefined) throw new ValidationError("sale_ticker_text must be a string");
    out.sale_ticker_text = v;
  }
  if ("sale_ticker_enabled" in body) {
    if (typeof body.sale_ticker_enabled !== "boolean") throw new ValidationError("sale_ticker_enabled must be a boolean");
    out.sale_ticker_enabled = body.sale_ticker_enabled;
  }
  return out;
}

const ORDER_STATUSES = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];

export function validateOrderCreateInput(body: Record<string, unknown>) {
  if (typeof body.user_email !== "string") throw new ValidationError("user_email is required");
  if (typeof body.user_name !== "string") throw new ValidationError("user_name is required");
  if (!body.shipping_address || typeof body.shipping_address !== "object") {
    throw new ValidationError("shipping_address is required");
  }
  if (!Array.isArray(body.items) || body.items.length === 0) {
    throw new ValidationError("items must be a non-empty array");
  }
  const subtotal = num(body.subtotal);
  const total = num(body.total);
  if (subtotal === undefined || subtotal < 0) throw new ValidationError("subtotal must be a non-negative number");
  if (total === undefined || total < 0) throw new ValidationError("total must be a non-negative number");
  if (body.status !== undefined && !ORDER_STATUSES.includes(body.status as string)) {
    throw new ValidationError("invalid status");
  }
  if (body.user_id !== undefined && typeof body.user_id !== "string") {
    throw new ValidationError("user_id must be a string");
  }
  return {
    user_id: str(body.user_id),
    user_email: body.user_email,
    user_name: body.user_name,
    shipping_address: body.shipping_address,
    items: body.items,
    subtotal,
    total,
    status: (body.status as string) ?? "pending",
  };
}

export function validateOrderUpdateInput(body: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  if ("status" in body) {
    if (!ORDER_STATUSES.includes(body.status as string)) throw new ValidationError("invalid status");
    out.status = body.status;
  }
  if ("shipping_address" in body) {
    if (!body.shipping_address || typeof body.shipping_address !== "object") {
      throw new ValidationError("shipping_address must be an object");
    }
    out.shipping_address = body.shipping_address;
  }
  if ("admin_notes" in body) {
    const v = str(body.admin_notes);
    if (v !== undefined) out.admin_notes = v;
  }
  return out;
}
