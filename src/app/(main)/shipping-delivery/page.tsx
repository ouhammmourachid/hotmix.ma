import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import ShippingDeliveryClient from "./shipping-delivery-client";

export const metadata: Metadata = buildMetadata({
  title: "Shipping & Delivery",
  description: "Hotmix shipping rates, delivery times, and coverage across Morocco.",
  path: "/shipping-delivery",
});

export default function Page() {
  return <ShippingDeliveryClient />;
}
