import type { MetadataRoute } from "next";
import { profile, preview, projects } from "@/lib/content";
import { rolls, frameHref } from "@/lib/foto/catalog";
export default function sitemap(): MetadataRoute.Sitemap {
  if (preview || !profile.siteUrl) return [];
  const site = ["id", "en"].flatMap((locale) =>
    [
      "",
      "projects/",
      ...projects
        .filter((p) => p.status === "published" && !p.sample)
        .map((p) => `projects/${p.slug}/`),
    ].map((path) => ({ url: `${profile.siteUrl}/${locale}/${path}` })),
  );
  const foto = [
    "/foto/",
    ...rolls.flatMap((r) => r.frames.map((f) => frameHref(r.id, f.slug))),
  ]
    .filter(() => rolls.every((r) => !r.sample))
    .map((path) => ({ url: `${profile.siteUrl}${path}` }));
  return [...site, ...foto];
}
