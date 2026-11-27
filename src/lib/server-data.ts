import fs from "node:fs";
import path from "node:path";
import { newsArticles } from "./company";
import {
  CATEGORY_GROUPS,
  EXCLUDED_PRODUCT_IDS,
  FEATURED_PRODUCT_IDS,
  applyBlutoothFixDeep,
  isNonElectricalProduct,
  resolveCategoryGroup,
} from "./catalog";
import { DEFAULT_SETTINGS } from "./site-config";
import { getAdminClient } from "./supabase/admin";
import type {
  CategoryGroup,
  NewsPost,
  Product,
  SiteSettings,
} from "./types";

const CONTACT_DEFAULT_PRICE = 150000;

interface DbCategoryRow {
  id: number;
  slug: string;
  name: string;
}

interface DbProductRow {
  id: number;
  sku: string | null;
  name: string;
  slug: string;
  category_id: number | null;
  category_original: string | null;
  brand: string | null;
  price_no_vat: number | null;
  price_with_vat: number | null;
  retail_price: number | null;
  regular_price: number | null;
  vat_rate: number | null;
  price_status: "available" | "contact" | null;
  stock_status: "instock" | "outofstock" | null;
  support_amount: number | null;
  support_mechanism: string | null;
  gift_support: string | null;
  image: string | null;
  images: unknown;
  installation_images: unknown;
  highlights: unknown;
  applications: unknown;
  specs: unknown;
  specs_table: unknown;
  attributes: unknown;
  short_description: string | null;
  description: string | null;
  source: string | null;
  is_active: boolean | null;
  is_featured: boolean | null;
  categories?: DbCategoryRow | DbCategoryRow[] | null;
}

let localProductsCache: Product[] | null = null;

function toArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function toObject<T>(value: unknown): T {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as T)
    : ({} as T);
}

function normalizeLocalProduct(raw: Product): Product {
  const fixed = applyBlutoothFixDeep(raw);
  const group = resolveCategoryGroup(fixed.category, fixed.name);
  const isContact =
    fixed.priceStatus === "contact" ||
    !fixed.priceWithVAT ||
    fixed.priceWithVAT <= 0 ||
    fixed.priceWithVAT === CONTACT_DEFAULT_PRICE;

  return {
    ...fixed,
    category: group.name,
    categorySlug: group.slug,
    categoryOriginal: fixed.category,
    priceStatus: isContact ? "contact" : "available",
    stockStatus: fixed.stockStatus === "outofstock" ? "outofstock" : "instock",
    priceNoVAT: isContact ? 0 : fixed.priceNoVAT ?? 0,
    priceWithVAT: isContact ? 0 : fixed.priceWithVAT ?? 0,
    retailPrice: isContact ? 0 : fixed.retailPrice ?? 0,
    regularPrice: isContact
      ? 0
      : fixed.regularPrice ?? fixed.retailPrice ?? 0,
    finalPrice: isContact ? 0 : fixed.priceWithVAT ?? 0,
    vatRate: fixed.vatRate ?? 0.08,
    isActive: true,
    isFeatured: FEATURED_PRODUCT_IDS.has(fixed.id),
  };
}

export function readLocalProducts(): Product[] {
  if (localProductsCache) return localProductsCache;

  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      "products.json",
    );
    const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as Product[];
    const seen = new Set<number>();
    const products: Product[] = [];

    for (const item of raw) {
      if (EXCLUDED_PRODUCT_IDS.has(item.id)) continue;
      if (isNonElectricalProduct(item.name)) continue;
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      products.push(normalizeLocalProduct(item));
    }

    localProductsCache = products;
    return products;
  } catch (error) {
    console.error("Không đọc được public/data/products.json:", error);
    localProductsCache = [];
    return localProductsCache;
  }
}

function getJoinedCategory(
  row: DbProductRow,
): DbCategoryRow | null {
  if (!row.categories) return null;
  if (Array.isArray(row.categories)) return row.categories[0] ?? null;
  return row.categories;
}

function mapDbProduct(row: DbProductRow): Product {
  const joinedCategory = getJoinedCategory(row);
  const fallbackGroup = resolveCategoryGroup(
    row.category_original ?? undefined,
    row.name,
  );
  const priceWithVAT = Number(row.price_with_vat) || 0;
  const priceStatus =
    row.price_status ?? (priceWithVAT > 0 ? "available" : "contact");
  const isContact = priceStatus === "contact";

  return {
    id: row.id,
    sku: row.sku ?? undefined,
    name: applyBlutoothFixDeep(row.name),
    slug: row.slug,
    category: /CSLH|CSBA|BD\s*TT0[124]L|chiếu gương/i.test(row.name) ? fallbackGroup.name : joinedCategory?.name ?? fallbackGroup.name,
    categorySlug: /CSLH|CSBA|BD\s*TT0[124]L|chiếu gương/i.test(row.name) ? fallbackGroup.slug : joinedCategory?.slug ?? fallbackGroup.slug,
    categoryId: row.category_id ?? joinedCategory?.id,
    categoryOriginal: row.category_original ?? undefined,
    brand: row.brand ?? undefined,
    priceNoVAT: isContact ? 0 : Number(row.price_no_vat) || 0,
    priceWithVAT: isContact ? 0 : priceWithVAT,
    retailPrice: isContact ? 0 : Number(row.retail_price) || 0,
    regularPrice: isContact
      ? 0
      : Number(row.regular_price) || Number(row.retail_price) || 0,
    finalPrice: isContact ? 0 : priceWithVAT,
    vatRate: Number(row.vat_rate) || 0.08,
    priceStatus: isContact ? "contact" : "available",
    stockStatus:
      row.stock_status === "outofstock" ? "outofstock" : "instock",
    supportAmount: row.support_amount ?? undefined,
    supportMechanism: row.support_mechanism ?? undefined,
    giftSupport: row.gift_support ?? undefined,
    image: row.image ?? undefined,
    images: toArray<string>(row.images),
    installationImages: toArray<string>(row.installation_images),
    highlights: toArray<string>(row.highlights),
    applications: toArray<string>(row.applications),
    specs: toObject<NonNullable<Product["specs"]>>(row.specs),
    specsTable: toArray<NonNullable<Product["specsTable"]>[number]>(
      row.specs_table,
    ),
    attributes: toArray<NonNullable<Product["attributes"]>[number]>(
      row.attributes,
    ),
    shortDescription: row.short_description ?? undefined,
    description: row.description ?? undefined,
    source: row.source ?? undefined,
    isActive: row.is_active !== false,
    isFeatured: Boolean(row.is_featured),
  };
}

export async function getProducts(): Promise<Product[]> {
  const supabase = getAdminClient();
  if (!supabase) return readLocalProducts();

  const { data, error } = await supabase
    .from("products")
    .select("*, categories(id, slug, name)")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    console.error("Lỗi đọc products từ Supabase, dùng dữ liệu local:", error.message);
    return readLocalProducts();
  }

  return ((data ?? []) as DbProductRow[]).filter(row => !EXCLUDED_PRODUCT_IDS.has(row.id)).map(row => applyBlutoothFixDeep(mapDbProduct(row)));
}

export async function getAdminProducts(): Promise<Product[]> {
  const supabase = getAdminClient();
  if (!supabase) {
    throw new Error(
      "Supabase chưa được cấu hình. Cần NEXT_PUBLIC_SUPABASE_URL và SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  const { data, error } = await supabase
    .from("products")
    .select("*, categories(id, slug, name)")
    .order("id", { ascending: false });

  if (error) throw new Error(error.message);
  return ((data ?? []) as DbProductRow[]).map(mapDbProduct);
}

export async function getProductById(
  id: number,
  includeInactive = false,
): Promise<Product | null> {
  const supabase = getAdminClient();
  if (!supabase) {
    return readLocalProducts().find((product) => product.id === id) ?? null;
  }

  let query = supabase
    .from("products")
    .select("*, categories(id, slug, name)")
    .eq("id", id);

  if (!includeInactive) query = query.eq("is_active", true);

  const { data, error } = await query.maybeSingle();

  if (error) {
    console.error("Lỗi đọc product từ Supabase:", error.message);
    return readLocalProducts().find((product) => product.id === id) ?? null;
  }

  if (!data) return null;
  return mapDbProduct(data as DbProductRow);
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const products = await getProducts();
  return products
    .filter(
      (item) =>
        item.id !== product.id &&
        (item.categorySlug === product.categorySlug ||
          (item.brand && item.brand === product.brand)),
    )
    .slice(0, limit);
}

export async function getCategoriesFull(): Promise<CategoryGroup[]> {
  const supabase = getAdminClient();
  if (!supabase) return CATEGORY_GROUPS;

  const { data, error } = await supabase
    .from("categories")
    .select("id, slug, name, description, icon, sort_order")
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) {
    if (error) console.error("Lỗi đọc categories:", error.message);
    return CATEGORY_GROUPS;
  }

  return data.map((row) => {
    const base = CATEGORY_GROUPS.find((group) => group.slug === row.slug);
    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      description: row.description ?? base?.description ?? "",
      icon: row.icon ?? base?.icon ?? "💡",
      sortOrder: row.sort_order ?? base?.sortOrder ?? 0,
      categories: base?.categories ?? [],
    };
  });
}

function normalizeBankInfo(value: unknown): SiteSettings["bankInfo"] {
  const bankInfo = toObject<Record<string, unknown>>(value);
  return {
    bank: typeof bankInfo.bank === "string" ? bankInfo.bank : "",
    branch: typeof bankInfo.branch === "string" ? bankInfo.branch : "",
    accountNumber:
      typeof bankInfo.account_number === "string"
        ? bankInfo.account_number
        : typeof bankInfo.accountNumber === "string"
          ? bankInfo.accountNumber
          : "",
    accountName:
      typeof bankInfo.account_name === "string"
        ? bankInfo.account_name
        : typeof bankInfo.accountName === "string"
          ? bankInfo.accountName
          : DEFAULT_SETTINGS.bankInfo.accountName,
    qrImage:
      typeof bankInfo.qr_image === "string"
        ? bankInfo.qr_image
        : typeof bankInfo.qrImage === "string"
          ? bankInfo.qrImage
          : DEFAULT_SETTINGS.bankInfo.qrImage,
  };
}

function toNumberSetting(value: unknown, fallback: number): number {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
}

export async function getSettings(): Promise<SiteSettings> {
  const supabase = getAdminClient();
  if (!supabase) return DEFAULT_SETTINGS;

  const { data, error } = await supabase
    .from("settings")
    .select("key, value");

  if (error) {
    console.error("Lỗi đọc settings:", error.message);
    return DEFAULT_SETTINGS;
  }

  const map: Record<string, unknown> = {};
  for (const row of data ?? []) {
    map[row.key] = row.value;
  }

  return {
    hotline:
      typeof map.hotline === "string"
        ? map.hotline
        : DEFAULT_SETTINGS.hotline,
    storeEmail:
      typeof map.store_email === "string"
        ? map.store_email
        : DEFAULT_SETTINGS.storeEmail,
    storeAddress:
      typeof map.store_address === "string"
        ? map.store_address
        : DEFAULT_SETTINGS.storeAddress,
    shippingFee: toNumberSetting(
      map.shipping_fee,
      DEFAULT_SETTINGS.shippingFee,
    ),
    freeShipThreshold: toNumberSetting(
      map.free_ship_threshold,
      DEFAULT_SETTINGS.freeShipThreshold,
    ),
    bankInfo: map.bank_info
      ? normalizeBankInfo(map.bank_info)
      : DEFAULT_SETTINGS.bankInfo,
  };
}

export function fallbackNewsPosts(): NewsPost[] {
  return newsArticles.map((article, index) => ({
    id: index + 1,
    slug: article.id,
    title: article.title,
    category: article.category,
    summary: article.summary,
    image: article.image,
    readTime: article.readTime,
    date: article.date,
    highlights: article.highlights,
    sections: article.sections.map((section) => ({
      heading: section.heading,
      content: section.bullets.join("\n"),
    })),
    published: true,
  }));
}

interface DbNewsRow {
  id: number;
  slug: string;
  title: string;
  category: string | null;
  summary: string | null;
  image: string | null;
  read_time: string | null;
  highlights: unknown;
  sections: unknown;
  content: string | null;
  published: boolean;
  published_at: string | null;
}

function mapDbNews(row: DbNewsRow): NewsPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category ?? "Tin tức",
    summary: row.summary ?? "",
    image: row.image ?? undefined,
    readTime: row.read_time ?? undefined,
    date: row.published_at
      ? new Date(row.published_at).toLocaleDateString("vi-VN")
      : "Cập nhật mới nhất",
    highlights: toArray<string>(row.highlights),
    sections: toArray<NewsPost["sections"][number]>(row.sections),
    content: row.content ?? undefined,
    published: row.published,
    publishedAt: row.published_at ?? undefined,
  };
}

export async function getNewsPosts(): Promise<NewsPost[]> {
  const supabase = getAdminClient();
  if (!supabase) return fallbackNewsPosts();

  const { data, error } = await supabase
    .from("news_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error || !data || data.length === 0) {
    if (error) console.error("Lỗi đọc news_posts:", error.message);
    return fallbackNewsPosts();
  }

  return (data as DbNewsRow[]).map(mapDbNews);
}

export async function getAdminNewsPosts(): Promise<NewsPost[]> {
  const supabase = getAdminClient();
  if (!supabase) {
    throw new Error(
      "Supabase chưa được cấu hình. Cần NEXT_PUBLIC_SUPABASE_URL và SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  const { data, error } = await supabase
    .from("news_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return ((data ?? []) as DbNewsRow[]).map(mapDbNews);
}
