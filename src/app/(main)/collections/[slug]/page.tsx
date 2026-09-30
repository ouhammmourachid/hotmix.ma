import type { Metadata } from "next";
import { getCategoryBySlug, getAllCategorySlugs } from "@/lib/categories-server";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import JsonLd from "@/components/json-ld";
import CollectionPageClient from "./collection-page-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ISR: pages not generated at build time are rendered on first request, and every
// page is refreshed at most once a minute, so backend changes show up without a rebuild.
export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return buildMetadata({
      title: "Collection not found",
      description: "This collection is no longer available.",
      path: `/collections/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: category.name,
    description: `Shop the ${category.name} collection at Hotmix — elegant, minimalist women's clothing.`,
    path: `/collections/${slug}`,
  });
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  return (
    <>
      {category && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
              { "@type": "ListItem", position: 2, name: "Collections", item: absoluteUrl("/collections") },
              { "@type": "ListItem", position: 3, name: category.name, item: absoluteUrl(`/collections/${slug}`) },
            ],
          }}
        />
      )}
      <CollectionPageClient />
    </>
  );
}
