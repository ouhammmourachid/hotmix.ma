import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Collections",
  description: "Explore Hotmix's curated collections of minimalist, elegant women's clothing.",
  path: "/collections",
});

export default function CollectionsPage() {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <h1 className="text-2xl font-bold">Collections Page</h1>
        </div>
    );
}
