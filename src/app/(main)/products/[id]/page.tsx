import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductForSeo, getAllPublishedProductIds } from "@/lib/products-server";
import { absoluteUrl, buildMetadata, stripHtml, truncate } from "@/lib/seo";
import JsonLd from "@/components/json-ld";
import ProductPageClient from "./product-page-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const ids = await getAllPublishedProductIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductForSeo(id);

  if (!product) {
    return buildMetadata({
      title: "Product not found",
      description: "This product is no longer available.",
      path: `/products/${id}`,
      noIndex: true,
    });
  }

  const description = truncate(stripHtml(product.description) || product.name, 160);

  return buildMetadata({
    title: product.name,
    description,
    path: `/products/${product.id}`,
    image: product.imageUrl,
    noIndex: product.status !== "published",
  });
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductForSeo(id);

  if (!product) {
    notFound();
  }

  const price = product.sale_price ?? product.price;
  const description = truncate(stripHtml(product.description) || product.name, 500);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description,
          image: product.imageUrl ? [product.imageUrl] : undefined,
          sku: product.id,
          offers: {
            "@type": "Offer",
            url: absoluteUrl(`/products/${product.id}`),
            priceCurrency: "MAD",
            price,
            availability:
              product.status === "archived"
                ? "https://schema.org/OutOfStock"
                : "https://schema.org/InStock",
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: "Products", item: absoluteUrl("/products") },
            { "@type": "ListItem", position: 3, name: product.name, item: absoluteUrl(`/products/${product.id}`) },
          ],
        }}
      />
      <ProductPageClient params={params} />
    </>
  );
}
