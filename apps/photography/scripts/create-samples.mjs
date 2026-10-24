// Paints the sample "photographs" used before real photos are added.
// They are illustrations, flagged with "sample": true in content/rolls.json.
import { mkdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const out = path.join(process.cwd(), "public/photos");

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

const grain = (w, h, seed) => `
  <filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${seed}"/>
  <feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .55 0"/></filter>
  <rect width="${w}" height="${h}" filter="url(#g)" opacity=".35" style="mix-blend-mode:overlay"/>
  <radialGradient id="v" cx=".5" cy=".5" r=".75"><stop offset=".6" stop-opacity="0"/><stop offset="1" stop-opacity=".45"/></radialGradient>
  <rect width="${w}" height="${h}" fill="url(#v)"/>`;

function city(w, h, r, i) {
  const skyTop = [
    "#1b2140",
    "#2a2c55",
    "#3b3a63",
    "#141a33",
    "#4a4d7a",
    "#0f1428",
  ][i];
  const skyLow = [
    "#7d6a8e",
    "#c08a7a",
    "#9a7a90",
    "#3b4160",
    "#e0a07a",
    "#30355a",
  ][i];
  const horizon = h * (0.58 + r() * 0.08);
  let shapes = "";
  let x = -20;
  while (x < w) {
    const bw = 60 + r() * 140;
    const bh = 120 + r() * h * 0.42;
    shapes += `<rect x="${x}" y="${horizon - bh}" width="${bw}" height="${bh}" fill="#0d1018"/>`;
    for (let wy = horizon - bh + 16; wy < horizon - 14; wy += 22)
      for (let wx = x + 10; wx < x + bw - 12; wx += 18)
        if (r() < 0.28)
          shapes += `<rect x="${wx}" y="${wy}" width="8" height="11" fill="${r() < 0.7 ? "#f6c76b" : "#9fd0ff"}" opacity="${0.6 + r() * 0.4}"/>`;
    x += bw + 4;
  }
  const lamp = w * (0.2 + r() * 0.6);
  return `
  <linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${skyTop}"/><stop offset="1" stop-color="${skyLow}"/></linearGradient>
  <rect width="${w}" height="${h}" fill="url(#s)"/>
  ${shapes}
  <g transform="translate(0 ${2 * horizon}) scale(1 -1)" opacity=".35" filter="url(#b)">${shapes}</g>
  <filter id="b"><feGaussianBlur stdDeviation="6"/></filter>
  <rect y="${horizon}" width="${w}" height="${h - horizon}" fill="#0b0e16" opacity=".55"/>
  <radialGradient id="l"><stop offset="0" stop-color="#ffd27a" stop-opacity=".9"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
  <circle cx="${lamp}" cy="${horizon - 140}" r="120" fill="url(#l)"/>
  <rect x="${lamp - 3}" y="${horizon - 140}" width="6" height="140" fill="#07090e"/>`;
}

function coast(w, h, r, i) {
  const skies = [
    ["#f6b26b", "#e9765b"],
    ["#ffd8a0", "#f2a07a"],
    ["#f3c58f", "#d9a679"],
    ["#3d4a85", "#8a7fb0"],
    ["#f8c48a", "#c9775e"],
    ["#ffe1b0", "#f0a982"],
  ][i];
  const horizon = h * (0.5 + r() * 0.1);
  const sunX = w * (0.25 + r() * 0.5);
  let waves = "";
  for (let y = horizon + 18; y < h; y += 22 + r() * 18)
    waves += `<path d="M0 ${y} Q ${w / 4} ${y - 8} ${w / 2} ${y} T ${w} ${y}" stroke="#ffffff" stroke-opacity="${0.08 + r() * 0.15}" stroke-width="2" fill="none"/>`;
  const sand =
    i === 2
      ? `<path d="M0 ${h * 0.7} Q ${w * 0.4} ${h * 0.55} ${w} ${h * 0.75} L ${w} ${h} L 0 ${h} Z" fill="#c98a5a"/>`
      : "";
  return `
  <linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${skies[0]}"/><stop offset="1" stop-color="${skies[1]}"/></linearGradient>
  <rect width="${w}" height="${h}" fill="url(#s)"/>
  <circle cx="${sunX}" cy="${horizon - 40 - r() * 80}" r="${50 + r() * 30}" fill="#fff1c9" opacity="${i === 3 ? 0.25 : 0.95}"/>
  <path d="M0 ${horizon} L ${w * 0.18} ${horizon - 40} L ${w * 0.32} ${horizon} Z" fill="#3b2f4a" opacity=".8"/>
  <rect y="${horizon}" width="${w}" height="${h - horizon}" fill="${i === 3 ? "#28305a" : "#3f5f78"}"/>
  <rect x="${sunX - 30}" y="${horizon}" width="60" height="${h - horizon}" fill="#ffe3a6" opacity=".25"/>
  ${waves}${sand}
  ${i === 3 ? `<rect x="${w * 0.55}" y="${horizon - 6}" width="${w * 0.5}" height="10" fill="#141a33"/>` : ""}`;
}

function hills(w, h, r, i) {
  const sky = [
    "#dfe6e2",
    "#e8efe6",
    "#f5e3c2",
    "#e3ebe2",
    "#fbfaf4",
    "#e0e8dc",
  ][i];
  let layers = "";
  const greens = ["#9fb79a", "#7d9c7a", "#5e7f5c", "#3f5e40", "#2c4630"];
  greens.forEach((g, k) => {
    const base = h * (0.35 + k * 0.13);
    const a = 40 + r() * 70;
    layers += `<path d="M0 ${base} C ${w * 0.25} ${base - a} ${w * 0.5} ${base + a} ${w} ${base - a / 2} L ${w} ${h} L 0 ${h} Z" fill="${g}" opacity="${i === 4 ? 0.55 : 1}"/>`;
    if (k >= 2)
      for (let y = base + 20; y < h; y += 26)
        layers += `<path d="M0 ${y} C ${w * 0.3} ${y - 18} ${w * 0.6} ${y + 18} ${w} ${y - 6}" stroke="#26402a" stroke-opacity=".25" stroke-width="3" fill="none"/>`;
    if (k === 1)
      layers += `<rect y="${base - 60}" width="${w}" height="140" fill="#ffffff" opacity=".35" filter="url(#b)"/>`;
  });
  const tree =
    i === 3
      ? `<rect x="${w * 0.48}" y="${h * 0.38}" width="14" height="${h * 0.22}" fill="#1f2b20"/><circle cx="${w * 0.48 + 7}" cy="${h * 0.36}" r="${w * 0.12}" fill="#2a3d2b"/>`
      : "";
  return `
  <filter id="b"><feGaussianBlur stdDeviation="22"/></filter>
  <rect width="${w}" height="${h}" fill="${sky}"/>
  <circle cx="${w * (0.2 + r() * 0.6)}" cy="${h * 0.18}" r="46" fill="#fff8e6" opacity=".9"/>
  ${layers}${tree}`;
}

const rolls = [
  ["kota-hujan", city, 11, [5]],
  ["pesisir", coast, 23, []],
  ["kebun-pagi", hills, 37, [3]],
];

for (const [id, paint, seed, portrait] of rolls) {
  mkdirSync(path.join(out, id), { recursive: true });
  for (let i = 0; i < 6; i++) {
    const [w, h] = portrait.includes(i) ? [1000, 1250] : [1500, 1000];
    const r = rng(seed * 100 + i);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${paint(w, h, r, i)}${grain(w, h, seed + i)}</svg>`;
    const file = path.join(out, id, `0${i + 1}.jpg`);
    await sharp(Buffer.from(svg))
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(file);
    console.log("wrote", path.relative(process.cwd(), file));
  }
}
