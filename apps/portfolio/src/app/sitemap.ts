import type { MetadataRoute } from "next";
import { profile, preview, projects } from "@/lib/content";
export default function sitemap(): MetadataRoute.Sitemap {
  if (preview || !profile.siteUrl) return [];
  return ["id", "en"].flatMap((locale) =>
    [
      "",
      "projects/",
      "photography/",
      ...projects
        .filter((p) => p.status === "published" && !p.sample)
        .map((p) => `projects/${p.slug}/`),
    ].map((path) => ({ url: `${profile.siteUrl}/${locale}/${path}` })),
  );
}
