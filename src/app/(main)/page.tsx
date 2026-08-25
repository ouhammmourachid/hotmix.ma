import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";
import HomePageContent from '@/components/home-page-content';

export const metadata: Metadata = {
  alternates: {
    canonical: absoluteUrl("/"),
  },
};

export default function Homepage() {
  return <HomePageContent />;
}
