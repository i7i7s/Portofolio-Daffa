// Reads content/rolls.json and every photo it lists, then writes
// src/generated/catalog.json: size, a tiny blur placeholder and the camera
// data. EXIF inside the file wins; the "exif" block in JSON fills the gaps.
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import exifr from "exifr";
import sharp from "sharp";
import { z } from "zod";

const exifSchema = z
  .object({
    camera: z.string(),
    lens: z.string(),
    aperture: z.number(),
    shutter: z.string(),
    iso: z.number(),
    focal: z.number(),
    taken: z.string(),
  })
  .partial();

const contentSchema = z.object({
  site: z.object({
    name: z.string().min(1),
    title: z.string().min(1),
    intro: z.string().min(1),
    portfolioUrl: z.string().min(1),
  }),
  rolls: z
    .array(
      z.object({
        id: z.string().regex(/^[a-z0-9-]+$/),
        title: z.string().min(1),
        place: z.string().min(1),
        year: z.number().int(),
        stock: z.string().min(1),
        sample: z.boolean().default(false),
        frames: z
          .array(
            z.object({
              file: z.string().min(1),
              caption: z.string().min(1),
              mark: z.enum(["keep", "reject"]).optional(),
              exif: exifSchema.optional(),
            }),
          )
          .min(1),
      }),
    )
    .min(1),
});

const shutter = (seconds?: number) =>
  !seconds
    ? undefined
    : seconds >= 1
      ? `${seconds}s`
      : `1/${Math.round(1 / seconds)}`;

async function readExif(file: string) {
  const raw = await exifr
    .parse(file, [
      "Make",
      "Model",
      "LensModel",
      "FNumber",
      "ExposureTime",
      "ISO",
      "FocalLength",
      "DateTimeOriginal",
    ])
    .catch(() => undefined);
  if (!raw) return {};
  // exifr reads the camera clock as local time; keep it that way.
  const d = raw.DateTimeOriginal;
  const pad = (n: number) => String(n).padStart(2, "0");
  const taken =
    d instanceof Date
      ? `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
      : undefined;
  return exifSchema.parse(
    Object.fromEntries(
      Object.entries({
        camera: [raw.Make, raw.Model].filter(Boolean).join(" ") || undefined,
        lens: raw.LensModel,
        aperture: raw.FNumber,
        shutter: shutter(raw.ExposureTime),
        iso: raw.ISO,
        focal: raw.FocalLength ? Math.round(raw.FocalLength) : undefined,
        taken,
      }).filter(([, v]) => v !== undefined),
    ),
  );
}

const content = contentSchema.parse(
  JSON.parse(readFileSync("content/rolls.json", "utf8")),
);
const ids = new Set<string>();
const rolls = [];
for (const roll of content.rolls) {
  if (ids.has(roll.id)) throw new Error(`Duplicate roll id: ${roll.id}`);
  ids.add(roll.id);
  const frames = [];
  for (const [i, frame] of roll.frames.entries()) {
    const file = path.join("public/photos", frame.file);
    if (!existsSync(file)) throw new Error(`Missing photo: ${file}`);
    const image = sharp(file).rotate();
    const { width, height } = await image.metadata();
    const blur = await image
      .clone()
      .resize(16)
      .jpeg({ quality: 50 })
      .toBuffer();
    frames.push({
      slug: String(i + 1).padStart(2, "0"),
      src: `/photos/${frame.file}`,
      width: width!,
      height: height!,
      blur: `data:image/jpeg;base64,${blur.toString("base64")}`,
      caption: frame.caption,
      mark: frame.mark ?? null,
      exif: { ...frame.exif, ...(await readExif(file)) },
    });
  }
  rolls.push({ ...roll, frames });
}

mkdirSync("src/generated", { recursive: true });
writeFileSync(
  "src/generated/catalog.json",
  JSON.stringify({ site: content.site, rolls }, null, 2),
);
console.log(
  `Catalog: ${rolls.length} rolls, ${rolls.reduce((n, r) => n + r.frames.length, 0)} frames.`,
);
