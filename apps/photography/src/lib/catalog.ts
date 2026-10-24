import data from "@/generated/catalog.json";

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

export const site = data.site;
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

// Every frame across all rolls, used by the drying line.
export const allFrames = rolls.flatMap((r) =>
  r.frames.map((f) => ({ ...f, roll: r.id, href: frameHref(r.id, f.slug) })),
);
export type LineFrame = (typeof allFrames)[number];
