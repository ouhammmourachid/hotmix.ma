import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import SalePageClient from "./sale-page-client";

export const metadata: Metadata = buildMetadata({
  title: "Sale",
  description: "Shop discounted Hotmix pieces — elegant, minimalist women's clothing at reduced prices while stocks last.",
  path: "/sale",
});

export default function Page() {
  return <SalePageClient />;
}
