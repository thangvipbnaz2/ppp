import { slugifyVietnamese } from "./catalog";
import { getAdminClient } from "./supabase/admin";

export interface AdminProductBody {
  name?: string;
  sku?: string;
  categorySlug?: string;
  category?: string;
  brand?: string;
  priceNoVAT?: number | string | null;
  priceWithVAT?: number | string | null;
  retailPrice?: number | string | null;
  regularPrice?: number | string | null;
  vatRate?: number | string | null;
  priceStatus?: "available" | "contact";
  stockStatus?: "instock" | "outofstock";
  supportAmount?: number | string | null;
  supportMechanism?: string;
  giftSupport?: string;
  image?: string;
  images?: string[] | string;
  installationImages?: string[] | string;
  highlights?: string[] | string;
  applications?: string[] | string;
  specs?: Record<string, unknown> | string;
  specsTable?: unknown[] | string;
  attributes?: unknown[] | string;
  shortDescription?: string;
  description?: string;
  source?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

export function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

export function parseJson(value: unknown, fallback: unknown) {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }
  return value;
}

export function toInteger(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(String(value).replace(/[^\d-]/g, ""));
  if (!Number.isFinite(parsed)) return null;
  return Math.round(parsed);
}

export async function buildProductPayload(
  body: AdminProductBody,
  existingSlug: string | null,
) {
  const supabase = getAdminClient();
  if (!supabase) throw new Error("Supabase chưa được cấu hình.");

  const name = String(body.name ?? "").trim().slice(0, 300);
  if (name.length < 2) throw new Error("Tên sản phẩm phải có ít nhất 2 ký tự.");

  const categorySlug = String(body.categorySlug ?? body.category ?? "").trim();
  let categoryId: number | null = null;
  if (categorySlug) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .maybeSingle();
    categoryId = category?.id ?? null;
  }

  const priceWithVAT = toInteger(body.priceWithVAT);
  const priceStatus =
    body.priceStatus === "contact" || !priceWithVAT || priceWithVAT <= 0
      ? "contact"
      : "available";
  const isContact = priceStatus === "contact";
  const rawVat = Number(body.vatRate ?? 8);
  const vatRate = Number.isFinite(rawVat)
    ? rawVat > 1
      ? rawVat / 100
      : rawVat
    : 0.08;

  const slug =
    existingSlug ??
    `${slugifyVietnamese(name)}-${Date.now().toString(36)}`;

  return {
    name,
    sku: String(body.sku ?? "").trim() || null,
    slug,
    category_id: categoryId,
    category_original: String(body.category ?? "").trim() || null,
    brand: String(body.brand ?? "").trim() || null,
    price_no_vat: isContact ? null : toInteger(body.priceNoVAT),
    price_with_vat: isContact ? null : priceWithVAT,
    retail_price: isContact ? null : toInteger(body.retailPrice),
    regular_price: isContact
      ? null
      : toInteger(body.regularPrice) ?? toInteger(body.retailPrice),
    vat_rate: vatRate,
    price_status: priceStatus,
    stock_status:
      body.stockStatus === "outofstock" ? "outofstock" : "instock",
    support_amount: isContact ? null : toInteger(body.supportAmount),
    support_mechanism: String(body.supportMechanism ?? "").trim() || null,
    gift_support: String(body.giftSupport ?? "").trim() || null,
    image: String(body.image ?? "").trim() || null,
    images: toStringArray(body.images),
    installation_images: toStringArray(body.installationImages),
    highlights: toStringArray(body.highlights),
    applications: toStringArray(body.applications),
    specs: parseJson(body.specs, {}),
    specs_table: parseJson(body.specsTable, []),
    attributes: parseJson(body.attributes, []),
    short_description: String(body.shortDescription ?? "").trim() || null,
    description: String(body.description ?? "").trim() || null,
    source: String(body.source ?? "").trim() || null,
    is_active: body.isActive !== false,
    is_featured: Boolean(body.isFeatured),
  };
}
