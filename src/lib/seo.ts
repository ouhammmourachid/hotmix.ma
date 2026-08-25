import type { Metadata } from "next";

export const SITE_URL = "https://www.hotmix.ma";
export const SITE_NAME = "Hotmix";
export const DEFAULT_OG_IMAGE = "/banner-16-9.png";
export const DEFAULT_OG_IMAGE_WIDTH = 1672;
export const DEFAULT_OG_IMAGE_HEIGHT = 941;

export function absoluteUrl(path: string): string {
  const url = new URL(path, SITE_URL);
  if (!url.pathname.endsWith("/") && !/\.[a-zA-Z0-9]+$/.test(url.pathname)) {
    url.pathname += "/";
  }
  return url.toString();
}

const HTML_ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  eacute: "é", egrave: "è", ecirc: "ê", euml: "ë",
  agrave: "à", acirc: "â", auml: "ä",
  ocirc: "ô", ouml: "ö",
  ucirc: "û", ugrave: "ù", uuml: "ü",
  icirc: "î", iuml: "ï",
  ccedil: "ç",
  oelig: "œ", aelig: "æ",
  Eacute: "É", Egrave: "È", Ecirc: "Ê",
  Agrave: "À", Acirc: "Â",
  Ccedil: "Ç",
};

function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
    .replace(/&([a-zA-Z]+);/g, (match, name: string) => HTML_ENTITIES[name] ?? match);
}

export function stripHtml(html: string): string {
  const withoutTags = html.replace(/<[^>]*>/g, " ");
  const decoded = decodeEntities(withoutTags);
  const withoutMarkdown = decoded
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/_(.*?)_/g, "$1");
  return withoutMarkdown.replace(/\s+/g, " ").trim();
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
  const ogImageDimensions = image
    ? {}
    : { width: DEFAULT_OG_IMAGE_WIDTH, height: DEFAULT_OG_IMAGE_HEIGHT };

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
      images: [{ url: ogImage, ...ogImageDimensions }],
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
