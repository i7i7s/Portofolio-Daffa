import type { Metadata } from "next";
import { profile, preview } from "./content";
import type { Locale } from "./content/schema";
export function pageMetadata(
  locale: Locale,
  title: string,
  description: string,
  path = "",
): Metadata {
  const root = profile.siteUrl || "http://localhost:3000";
  return {
    title: `${title} — ${profile.name}`,
    description,
    metadataBase: new URL(root),
    alternates: {
      canonical: `/${locale}/${path}`,
      languages: { id: `/id/${path}`, en: `/en/${path}` },
    },
    robots: preview ? { index: false, follow: false } : undefined,
    openGraph: {
      title: `${title} — ${profile.name}`,
      description,
      locale: locale === "id" ? "id_ID" : "en_US",
      type: "website",
      url: `/${locale}/${path}`,
    },
  };
}
