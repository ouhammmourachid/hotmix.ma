import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import PrivacyPolicyClient from "./privacy-policy-client";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How Hotmix collects, uses, and protects your personal data.",
  path: "/privacy-policy",
});

export default function Page() {
  return <PrivacyPolicyClient />;
}
