import data from "@/generated/foto-catalog.json";
import { profile } from "@/lib/content";

export type Exif = {
  camera?: string;
  lens?: string;
  aperture?: number;
  shutter?: string;
  iso?: number;
  focal?: number;
  taken?: string;
};
export type Frame = {
  slug: string;
  src: string;
  width: number;
  height: number;
  blur: string;
  caption: string;
  mark: "keep" | "reject" | null;
  exif: Exif;
};
export type Roll = {
  id: string;
  title: string;
  place: string;
  year: number;
  stock: string;
  sample: boolean;
  frames: Frame[];
};

export const site = { ...data.site, name: profile.name };
export const rolls = data.rolls as Roll[];

export const findFrame = (roll: string, slug: string) => {
  const r = rolls.find((x) => x.id === roll);
  const index = r?.frames.findIndex((f) => f.slug === slug) ?? -1;
  return r && index >= 0 ? { roll: r, frame: r.frames[index], index } : null;
};

export const frameHref = (roll: string, slug: string) =>
  `/foto/${roll}/${slug}/`;

export const rollNumber = (id: string) =>
  String(rolls.findIndex((r) => r.id === id) + 1).padStart(2, "0");

// Film edge numbering: frames run 1, 1A, 2, 2A … along the strip.
export const edgeNumber = (i: number) =>
  `${Math.floor(i / 2) + 1}${i % 2 ? "A" : ""}`;

export const exifLine = (e: Exif) =>
  [
    e.aperture && `ƒ/${e.aperture}`,
    e.shutter,
    e.iso && `ISO ${e.iso}`,
    e.focal && `${e.focal}mm`,
  ].filter(Boolean) as string[];

// Every frame across all rolls, used by the orbit and the home page.
export const allFrames = rolls.flatMap((r) =>
  r.frames.map((f) => ({
    ...f,
    roll: r.id,
    sample: r.sample,
    href: frameHref(r.id, f.slug),
  })),
);
export type LineFrame = (typeof allFrames)[number];

// Frames for the portfolio home page: one favourite per roll first, so the
// cards do not repeat the same scene, then any other keeps.
export const teaserFrames = (n: number) => {
  const firsts = rolls
    .map(
      (r) =>
        allFrames.find((f) => f.roll === r.id && f.mark === "keep") ??
        allFrames.find((f) => f.roll === r.id),
    )
    .filter((f) => f !== undefined);
  const rest = allFrames.filter(
    (f) => f.mark === "keep" && !firsts.includes(f),
  );
  return [...firsts, ...rest].slice(0, n);
};
