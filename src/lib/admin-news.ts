import { slugifyVietnamese } from "./catalog";

export interface AdminNewsBody {
  title?: string;
  slug?: string;
  category?: string;
  summary?: string;
  image?: string;
  readTime?: string;
  highlights?: string[] | string;
  sections?: unknown[] | string;
  content?: string;
  published?: boolean;
}

function toStringArray(value: unknown): string[] {
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

function parseJson(value: unknown, fallback: unknown) {
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

export function buildNewsPayload(body: AdminNewsBody, existingSlug?: string) {
  const title = String(body.title ?? "").trim().slice(0, 300);
  if (title.length < 3) throw new Error("Tiêu đề phải có ít nhất 3 ký tự.");

  const slug =
    String(body.slug ?? "").trim() ||
    existingSlug ||
    `${slugifyVietnamese(title)}-${Date.now().toString(36)}`;

  return {
    title,
    slug,
    category: String(body.category ?? "").trim() || "Tin tức",
    summary: String(body.summary ?? "").trim() || null,
    image: String(body.image ?? "").trim() || null,
    read_time: String(body.readTime ?? "").trim() || null,
    highlights: toStringArray(body.highlights),
    sections: parseJson(body.sections, []),
    content: String(body.content ?? "").trim() || null,
    published: body.published !== false,
  };
}
