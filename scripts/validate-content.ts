import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import {
  profileSchema,
  projectSchema,
  photoSchema,
} from "../src/lib/content/schema";
import { serialize } from "next-mdx-remote/serialize";
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const profile = profileSchema.parse(read("content/profile.json"));
const projects = projectSchema.array().parse(read("content/projects.json"));
const photos = photoSchema.array().parse(read("content/photography.json"));
const errors: string[] = [];
if (profile.photo) checkAsset(profile.photo.src);
function checkAsset(p: string) {
  if (!existsSync(path.join("public", p))) errors.push(`Missing asset: ${p}`);
}
function unique(values: string[], label: string) {
  if (new Set(values).size !== values.length) errors.push(`Duplicate ${label}`);
}
unique(
  projects.map((p) => p.slug),
  "project slug",
);
unique(
  photos.map((p) => p.id),
  "photo ID",
);
for (const p of projects) {
  checkAsset(p.cover);
  p.media.forEach((m) => checkAsset(m.src));
  if (p.sample && p.status === "published")
    errors.push(`Sample cannot be published: ${p.slug}`);
  for (const l of ["id", "en"]) {
    const file = `content/projects/${p.slug}/${l}.mdx`;
    if (!existsSync(file) || !readFileSync(file, "utf8").trim())
      errors.push(`Missing story: ${file}`);
  }
}
for (const p of photos) {
  checkAsset(p.src);
  if (p.sample && p.status === "published")
    errors.push(`Sample cannot be published: ${p.id}`);
}
if (profile.cv.startsWith("/") && !existsSync(path.join("public", profile.cv)))
  errors.push("Missing CV");
const id = read("messages/id.json"),
  en = read("messages/en.json");
if (
  JSON.stringify(Object.keys(id).sort()) !==
  JSON.stringify(Object.keys(en).sort())
)
  errors.push("Message keys differ between locales");
for (const [locale, messages] of Object.entries({ id, en }))
  for (const [key, value] of Object.entries(messages))
    if (typeof value !== "string" || !value.trim())
      errors.push(`Empty message ${locale}.${key}`);
if (process.argv.includes("--release")) {
  if (profile.name.includes("["))
    errors.push("Release requires your real display name");
  if (!profile.email) errors.push("Release requires a valid email");
  if (!profile.siteUrl)
    errors.push("Release requires siteUrl for canonical metadata");
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
Promise.all(
  projects.flatMap((p) =>
    ["id", "en"].map((l) =>
      serialize(readFileSync(`content/projects/${p.slug}/${l}.mdx`, "utf8"), {
        blockJS: true,
      }),
    ),
  ),
)
  .then(() =>
    console.log(
      `Content valid: ${projects.length} projects, ${photos.length} gallery entries, 2 languages, MDX syntax checked. ${process.argv.includes("--release") ? "Release readiness passed." : "Drafts are allowed; release readiness is a separate check."}`,
    ),
  )
  .catch((error) => {
    console.error("Invalid MDX:", error.message);
    process.exitCode = 1;
  });
