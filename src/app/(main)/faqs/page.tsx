import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import FaqsClient from "./faqs-client";

export const metadata: Metadata = buildMetadata({
  title: "FAQs",
  description: "Answers to frequently asked questions about Hotmix orders, shipping, sizing, and returns.",
  path: "/faqs",
});

export default function Page() {
  return <FaqsClient />;
}
