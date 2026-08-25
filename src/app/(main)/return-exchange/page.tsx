import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import ReturnExchangeClient from "./return-exchange-client";

export const metadata: Metadata = buildMetadata({
  title: "Returns & Exchanges",
  description: "Hotmix's return and exchange policy — window, conditions, and how to start a return.",
  path: "/return-exchange",
});

export default function Page() {
  return <ReturnExchangeClient />;
}
