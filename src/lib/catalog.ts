import categoryGroupsData from "@/data/category-groups.json";
import type { CategoryGroup, Product } from "./types";

export const CATEGORY_GROUPS = categoryGroupsData as CategoryGroup[];

const GROUP_BY_CATEGORY = new Map<string, CategoryGroup>();
for (const group of CATEGORY_GROUPS) {
  for (const category of group.categories) {
    GROUP_BY_CATEGORY.set(category, group);
  }
}

const GROUP_BY_SLUG = new Map<string, CategoryGroup>(
  CATEGORY_GROUPS.map((group) => [group.slug, group]),
);

export const DEFAULT_GROUP =
  GROUP_BY_SLUG.get("thiet-bi-dien-khac") ?? CATEGORY_GROUPS[CATEGORY_GROUPS.length - 1];

export const EXCLUDED_PRODUCT_IDS = new Set([289, 291, 670, 671, 672]);

export const FEATURED_PRODUCT_IDS = new Set([
  252, 169, 206, 194, 231, 175, 192, 115, 102, 103, 85, 86, 98, 563, 96, 254,
]);

const NON_ELECTRICAL_PATTERN =
  /bình nước|bình giữ nhiệt|phích|ruột phích|ly giữ nhiệt|ca giữ nhiệt/i;

export function getCategoryGroup(slugOrName: string): CategoryGroup | undefined {
  return GROUP_BY_SLUG.get(slugOrName) ?? GROUP_BY_CATEGORY.get(slugOrName);
}

export function fixBlutoothText(value: string): string {
  return value.replace(/blutooth/gi, "Bluetooth").replaceAll("Gía", "Giá").replaceAll("6500K/4000K//3000K", "6500K/4000K/3000K").replace(/(AT04 110\/(?:7|12)W\.DA)(?! —)/gi, "$1 — chip Samsung, CRI 82, lỗ khoét 115mm");
}

function smartKeywords(name: string): boolean {
  return /cảm biến|công tắc|ổ cắm|wifi|wi-fi|\bble\b|bluetooth|thông minh|smart|điều khiển/i.test(
    name,
  );
}

function resolveSpecialGroup(name: string): CategoryGroup {
  if (smartKeywords(name)) {
    return GROUP_BY_SLUG.get("smart-home") ?? DEFAULT_GROUP;
  }
  if (/gắn tường|ốp tường|chiếu gương|gương/i.test(name)) {
    return GROUP_BY_SLUG.get("den-led-gan-tuong") ?? DEFAULT_GROUP;
  }
  if (/thả trần|thả/i.test(name)) {
    return GROUP_BY_SLUG.get("den-led-trang-tri") ?? DEFAULT_GROUP;
  }
  return DEFAULT_GROUP;
}

export function resolveCategoryGroup(
  originalCategory: string | undefined,
  productName = "",
): CategoryGroup {
  if (/CSLH|CSBA/i.test(productName)) return DEFAULT_GROUP;
  if (/BD\s*TT0[124]L/i.test(productName)) return GROUP_BY_SLUG.get("den-led-trang-tri") ?? DEFAULT_GROUP;
  if (/chiếu gương|\bG0[24]\b/i.test(productName)) return GROUP_BY_SLUG.get("den-led-gan-tuong") ?? DEFAULT_GROUP;
  const category = fixBlutoothText(originalCategory ?? "");
  const direct = GROUP_BY_CATEGORY.get(category);
  if (direct) {
    if (direct.slug === "thiet-bi-dien-khac") {
      return resolveSpecialGroup(productName);
    }
    return direct;
  }
  return resolveSpecialGroup(productName);
}

export function isContactProduct(product: Pick<Product, "priceStatus" | "priceWithVAT">): boolean {
  return product.priceStatus === "contact" || !product.priceWithVAT || product.priceWithVAT <= 0;
}

export function isOutOfStock(product: Pick<Product, "stockStatus">): boolean {
  return product.stockStatus === "outofstock";
}

export function isNonElectricalProduct(name: string): boolean {
  return NON_ELECTRICAL_PATTERN.test(name);
}

export function normalizePhone(phone: string): string {
  const digits = String(phone ?? "").replace(/\D/g, "");
  if (digits.startsWith("84")) return `0${digits.slice(2)}`;
  return digits;
}

export function isValidPhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  return normalized.length >= 9 && normalized.length <= 11;
}

export function slugifyVietnamese(value: string): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export function parsePriceNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return Math.round(value);
  if (value === null || value === undefined) return 0;
  const text = String(value).trim();
  if (!text) return 0;
  if (/liên hệ|thương lượng/i.test(text)) return 0;
  const cleaned = text.replace(/[^\d]/g, "");
  if (!cleaned) return 0;
  return Number(cleaned);
}

export function computeGroupCounts(products: Product[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const product of products) {
    const slug = product.categorySlug ?? resolveCategoryGroup(product.category, product.name).slug;
    counts[slug] = (counts[slug] ?? 0) + 1;
  }
  return counts;
}

export function withGroupCounts(
  products: Product[],
  groups: CategoryGroup[] = CATEGORY_GROUPS,
): CategoryGroup[] {
  const counts = computeGroupCounts(products);
  return groups.map((group) => ({ ...group, count: counts[group.slug] ?? 0 }));
}

export function applyBlutoothFixDeep<T>(value: T): T {
  if (typeof value === "string") return fixBlutoothText(value) as unknown as T;
  if (Array.isArray(value)) return value.map((item) => applyBlutoothFixDeep(item)) as unknown as T;
  if (value && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      result[fixBlutoothText(key)] = applyBlutoothFixDeep(item);
    }
    return result as T;
  }
  return value;
}
