import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const ROOT = path.resolve(import.meta.dirname, "../..");
export const HARVEST = path.join(ROOT, "harvest");
export const RAW = path.join(HARVEST, "raw");
export const IMAGE_DIR = path.join(ROOT, "public", "images", "harvest");
export const ORIGIN = "https://rangdongapvina.com.vn";
export const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36 AnPhuCatalogHarvester/1.0";
export const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
export function ensureDirs() { for (const p of [HARVEST, RAW, IMAGE_DIR]) fs.mkdirSync(p, { recursive: true }); }
export function writeJson(file, data) { fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8"); }
export function readJson(file, fallback = []) { try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return fallback; } }
export function csvCell(value) { return `"${String(value ?? "").replaceAll('"', '""')}"`; }
export function writeCsv(file, headers, rows) { fs.writeFileSync(file, [headers, ...rows].map(row => row.map(csvCell).join(",")).join("\n") + "\n", "utf8"); }
export function stripHtml(value = "") { return String(value).replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&#8211;|&ndash;/gi, "–").replace(/\s+/g, " ").trim(); }
export function normalize(value = "") { return stripHtml(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/gi, "d").toLowerCase().replace(/\b(chinh hang|rang dong|kingled|ledvance|kingeco)\b/g, " ").replace(/[^a-z0-9]+/g, " ").trim(); }
export function slugify(value = "") { return normalize(value).replaceAll(" ", "-").slice(0, 100); }
export function absoluteUrl(value, base = ORIGIN) { try { return new URL(value, base).href; } catch { return ""; } }
export function extractImageUrls(html = "", base = ORIGIN) { const found = new Set(); for (const m of html.matchAll(/(?:src|data-src|data-large_image|href)=["']([^"']+\.(?:jpe?g|png|webp|gif)(?:\?[^"']*)?)["']/gi)) found.add(absoluteUrl(m[1], base)); return [...found]; }
let lastRequest = 0;
export async function request(url, { binary = false, attempts = 3 } = {}) {
  let error;
  for (let i = 0; i < attempts; i++) {
    const delay = Math.max(0, 1000 - (Date.now() - lastRequest)); if (delay) await wait(delay);
    lastRequest = Date.now();
    try { const response = await fetch(url, { headers: { "user-agent": UA, accept: binary ? "image/avif,image/webp,image/*,*/*" : "application/json,text/html,application/xml;q=0.9,*/*;q=0.8" }, redirect: "follow", signal: AbortSignal.timeout(30000) }); if (!response.ok) throw new Error(`${response.status} ${response.statusText}`); return binary ? Buffer.from(await response.arrayBuffer()) : { body: await response.text(), headers: response.headers, url: response.url }; } catch (e) { error = e; if (i < attempts - 1) await wait(1000 * (i + 1)); }
  }
  throw new Error(`${url}: ${error?.message ?? error}`);
}
export function imageFile(url) { const clean = new URL(url); const ext = path.extname(clean.pathname).toLowerCase(); const safeExt = /^\.(jpg|jpeg|png|webp|gif)$/.test(ext) ? ext : ".jpg"; return `${slugify(path.basename(clean.pathname, ext)) || "image"}-${crypto.createHash("sha1").update(url).digest("hex").slice(0, 10)}${safeExt}`; }
export async function downloadImages(records) { const map = [], failures = []; for (const record of records) { for (const url of [...new Set(record.urls.filter(Boolean))]) { const filename = imageFile(url); const target = path.join(IMAGE_DIR, filename); try { if (!fs.existsSync(target)) fs.writeFileSync(target, await request(url, { binary: true })); map.push([url, `/images/harvest/${filename}`, record.sku || record.slug || ""]); } catch (e) { failures.push([url, record.sku || record.slug || "", e.message]); } } } return { map, failures }; }
