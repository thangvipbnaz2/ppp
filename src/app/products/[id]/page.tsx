import { notFound } from "next/navigation";
import ProductDetailView from "@/components/ProductDetailView";
import { getProductById, getRelatedProducts } from "@/lib/server-data";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId) || productId <= 0) notFound();

  const product = await getProductById(productId);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);

  return <ProductDetailView product={product} relatedProducts={related} />;
}
