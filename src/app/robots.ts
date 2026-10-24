import type { MetadataRoute } from "next";
import { profile, preview } from "@/lib/content";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      ...(preview ? { disallow: "/" } : { allow: "/" }),
    },
    ...(profile.siteUrl ? { sitemap: `${profile.siteUrl}/sitemap.xml` } : {}),
  };
}
