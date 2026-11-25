import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { Product } from "@/lib/types";
import ProductDetailView from "@/components/ProductDetailView";

function loadProducts(): Product[] {
  const filePath = path.join(process.cwd(), "public", "data", "products.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as Product[];
}

export async function generateStaticParams() {
  const products = loadProducts();
  return products.map((p) => ({
    id: String(p.id),
  }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const products = loadProducts();
  const product = products.find((p) => String(p.id) === id);

  if (!product) {
    notFound();
  }

  // Pick 4 related products from same category or brand
  const related = products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category || p.brand === product.brand)
    )
    .slice(0, 4);

  return <ProductDetailView product={product} relatedProducts={related} />;
}
