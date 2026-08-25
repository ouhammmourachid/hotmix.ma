import type { Metadata } from "next";

export const SITE_URL = "https://www.hotmix.ma";
export const SITE_NAME = "Hotmix";
export const DEFAULT_OG_IMAGE = "/banner-16-9.png";
export const DEFAULT_OG_IMAGE_WIDTH = 1672;
export const DEFAULT_OG_IMAGE_HEIGHT = 941;

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1).trimEnd() + "…";
}

interface BuildMetadataOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}

export function buildMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
}: BuildMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image ? absoluteUrl(image) : absoluteUrl(DEFAULT_OG_IMAGE);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: DEFAULT_OG_IMAGE_WIDTH, height: DEFAULT_OG_IMAGE_HEIGHT }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
