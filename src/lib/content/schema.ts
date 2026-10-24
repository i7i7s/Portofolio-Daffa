import { z } from "zod";
export const localized = z
  .object({ id: z.string().min(1), en: z.string().min(1) })
  .strict();
export const categories = ["web", "uiux", "data", "mobile"] as const;
const asset = z
  .string()
  .regex(/^\/images\/[a-zA-Z0-9/_.-]+$/)
  .refine((v) => !v.includes(".."));
const url = z
  .string()
  .url()
  .refine((v) => v.startsWith("https://"));
export const profileSchema = z.object({
  name: z.string().min(1),
  bio: localized,
  email: z.union([z.literal(""), z.email()]),
  cv: z.union([z.literal(""), z.string().regex(/^\/[\w/.-]+\.pdf$/), url]),
  socials: z.array(z.object({ label: z.string().min(1), url })),
  skills: z.array(z.string().min(1)),
  photo: z
    .object({
      src: asset,
      alt: localized,
      width: z.number().positive(),
      height: z.number().positive(),
    })
    .optional(),
  education: z.array(localized).default([]),
  experience: z.array(localized).default([]),
  siteUrl: z.union([z.literal(""), url]),
});
export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  status: z.enum(["draft", "published"]),
  sample: z.boolean().default(false),
  order: z.number(),
  featured: z.boolean(),
  categories: z.array(z.enum(categories)).min(1),
  title: localized,
  summary: localized,
  cover: asset,
  alt: localized,
  year: z.number().int().optional(),
  role: localized.optional(),
  tools: z.array(z.string()),
  links: z.object({
    demo: url.optional(),
    repository: url.optional(),
    prototype: url.optional(),
  }),
  media: z.array(
    z.object({
      src: asset,
      alt: localized,
      width: z.number().positive(),
      height: z.number().positive(),
    }),
  ),
});
export const photoSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  status: z.enum(["draft", "published"]),
  sample: z.boolean().default(false),
  order: z.number(),
  featured: z.boolean(),
  src: asset,
  width: z.number().positive(),
  height: z.number().positive(),
  alt: localized,
  caption: localized.optional(),
  album: localized.optional(),
  location: localized.optional(),
  year: z.number().int().optional(),
});
export type Project = z.infer<typeof projectSchema>;
export type Photo = z.infer<typeof photoSchema>;
export type Locale = "id" | "en";
