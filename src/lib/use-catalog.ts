"use client";
import { useEffect, useState } from "react";
import type { Product } from "./types";
export function useCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => { fetch("/api/products").then(r => { if (!r.ok) throw new Error(); return r.json(); }).then(setProducts).catch(() => {}); }, []);
  return products;
}
