import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import AboutUsClient from "./about-us-client";

export const metadata: Metadata = buildMetadata({
  title: "About Us",
  description: "Learn about Hotmix, a women's clothing brand built on elegance, simplicity, and timeless style.",
  path: "/about-us",
});

export default function Page() {
  return <AboutUsClient />;
}
