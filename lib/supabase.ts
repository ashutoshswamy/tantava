import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Collection = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cover_image: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discount_price: number | null;
  category: string;
  fabric: string | null;
  care: string | null;
  free_delivery: boolean;
  images: string[];
  size_inventory: Record<string, number>;
  sku: string | null;
  badge: string | null;
  is_active: boolean;
  collection_id: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type StoreSettings = {
  delivery_info: string | null;
  returns_info: string | null;
  hero_image: string | null;
  theme_color: string | null;
  sale_ticker_text: string;
  sale_ticker_enabled: boolean;
  checkout_mode: "razorpay" | "whatsapp";
  whatsapp_number: string | null;
  testimonials_enabled: boolean;
  updated_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  user_email: string | null;
  user_name: string | null;
  items: OrderItem[];
  subtotal: number;
  total: number;
  status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  shipping_address: ShippingAddress | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
};

export type ShippingAddress = {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
};

