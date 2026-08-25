import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import SearchPageClient from "./search-page-client";

export const metadata: Metadata = buildMetadata({
  title: "Search Results",
  description: "Search the Hotmix catalog of elegant, minimalist women's clothing.",
  path: "/search",
  noIndex: true,
});

export default function Page() {
  return <SearchPageClient />;
}
