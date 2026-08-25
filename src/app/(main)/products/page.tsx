import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import ProductsPageClient from "./products-page-client";

export const metadata: Metadata = buildMetadata({
  title: "Shop All Products",
  description: "Browse the full Hotmix collection of elegant, minimalist women's clothing — from everyday essentials to statement pieces.",
  path: "/products",
});

export default function Page() {
  return <ProductsPageClient />;
}
