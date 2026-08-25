import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import ContactUsClient from "./contact-us-client";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us",
  description: "Get in touch with the Hotmix team — questions about orders, sizing, or products.",
  path: "/contact-us",
});

export default function Page() {
  return <ContactUsClient />;
}
