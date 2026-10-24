// Original SVG interface studies and abstract landscapes. Never sourced from the reference screenshot.
import { mkdirSync, writeFileSync } from "node:fs";
const write = (p, s) => {
  mkdirSync(p.slice(0, p.lastIndexOf("/")), { recursive: true });
  writeFileSync(p, s);
};
const svg = (body, w = 1200, h = 850) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
write(
  "public/images/projects/ruang.svg",
  svg(
    `<rect width="1200" height="850" fill="#c6d6c5"/><circle cx="1050" cy="50" r="420" fill="#b8cbb7"/><g transform="translate(115 115) rotate(-3 485 320)"><rect width="970" height="620" rx="14" fill="#fbfaf5"/><path d="M0 54H970" stroke="#d4d4c6"/><g fill="#b9bfad"><circle cx="28" cy="27" r="5"/><circle cx="46" cy="27" r="5"/><circle cx="64" cy="27" r="5"/></g><text x="42" y="108" font-family="Arial" font-size="28" font-weight="700" fill="#253b30">ruang.</text><text x="710" y="105" font-family="Arial" font-size="14" fill="#253b30">EXPLORE / JOURNAL</text><text x="42" y="213" font-family="Arial" font-size="57" font-weight="700" fill="#253b30">Less noise.</text><text x="42" y="277" font-family="Arial" font-size="57" font-weight="700" fill="#253b30">More room.</text><rect x="42" y="323" width="147" height="43" rx="22" fill="#263c30"/><path d="M74 344H153M142 334l11 10-11 10" stroke="#fff" stroke-width="2"/><rect x="42" y="450" width="320" height="8" fill="#c4c9b9"/><rect x="42" y="473" width="245" height="8" fill="#d5d8ce"/><g transform="translate(520 145)"><rect width="400" height="410" fill="#e6e8da"/><ellipse cx="200" cy="355" rx="155" ry="30" fill="#c8ceb9"/><path d="M88 295V145Q88 35 200 35Q312 35 312 145V295Z" fill="#7f9271"/><path d="M127 295V150Q127 77 200 77Q273 77 273 150V295" fill="#b3bda1"/><rect x="125" y="265" width="150" height="55" rx="7" fill="#314739"/><path d="M147 320v42m106-42v42" stroke="#314739" stroke-width="12"/></g><text x="42" y="580" font-family="monospace" font-size="14" fill="#253b30">INTERFACE STUDY / 01</text></g>`,
  ),
);
write(
  "public/images/projects/saku.svg",
  svg(
    `<rect width="1200" height="850" fill="#cfc9e6"/><circle cx="170" cy="790" r="400" fill="#beb5da"/><g transform="translate(185 100) rotate(-9 175 320)"><rect width="350" height="650" rx="48" fill="#29232e"/><rect x="12" y="12" width="326" height="626" rx="38" fill="#faf8f2"/><rect x="125" y="24" width="100" height="22" rx="11" fill="#29232e"/><text x="36" y="103" font-size="28" font-weight="700" font-family="Arial">saku.</text><text x="36" y="163" font-size="16" font-family="Arial" fill="#605765">A little more clarity.</text><rect x="28" y="196" width="294" height="171" rx="20" fill="#ded7f3"/><text x="48" y="240" font-size="13" font-family="Arial">YOUR SPACE</text><text x="48" y="293" font-size="36" font-weight="700" font-family="Arial">Make room</text><text x="48" y="333" font-size="36" font-weight="700" font-family="Arial">for ideas.</text><rect x="28" y="398" width="137" height="135" rx="16" fill="#e2e8da"/><rect x="185" y="398" width="137" height="135" rx="16" fill="#eee0cf"/><path d="M65 450h60m-30-30v60" stroke="#30372c" stroke-width="3"/><circle cx="252" cy="450" r="24" fill="none" stroke="#6d513c" stroke-width="3"/><path d="M38 584h274" stroke="#d6cfdc" stroke-width="2"/></g><g transform="translate(650 180) rotate(8 175 270)"><rect width="330" height="540" rx="35" fill="#faf8f2"/><text x="32" y="70" font-size="24" font-family="Arial" font-weight="700">One step at a time.</text><circle cx="165" cy="235" r="100" fill="#e0d9f1"/><path d="M120 233l32 32 65-69" fill="none" stroke="#65507d" stroke-width="15"/><rect x="35" y="390" width="260" height="55" rx="25" fill="#352a42"/><path d="M100 418h130" stroke="#fff" stroke-width="3"/><text x="40" y="490" font-size="14" font-family="monospace" fill="#605765">INTERFACE STUDY / 02</text></g>`,
  ),
);
write(
  "public/images/projects/pola.svg",
  svg(
    `<rect width="1200" height="850" fill="#e9c8b4"/><g transform="translate(100 115) rotate(2 500 310)"><rect width="1000" height="620" rx="12" fill="#f9f7f2"/><rect width="175" height="620" rx="12" fill="#302e2c"/><text x="28" y="64" font-size="30" font-family="Arial" font-weight="700" fill="#fff">pola /</text><g fill="#99928b"><rect x="28" y="120" width="100" height="8"/><rect x="28" y="160" width="83" height="8"/><rect x="28" y="200" width="110" height="8"/></g><text x="215" y="70" font-size="25" font-family="Arial" font-weight="700" fill="#302e2c">Patterns, in perspective.</text><g fill="#e9e6df"><rect x="215" y="110" width="215" height="100" rx="8"/><rect x="455" y="110" width="215" height="100" rx="8"/><rect x="695" y="110" width="265" height="100" rx="8"/></g><g fill="#a6aca0"><rect x="240" y="140" width="100" height="10"/><rect x="240" y="170" width="145" height="16"/><rect x="480" y="140" width="90" height="10"/><rect x="480" y="170" width="145" height="16"/></g><text x="720" y="169" font-size="19" font-family="monospace" fill="#57534e">SAMPLE DATA</text><path d="M220 530H950M220 460H950M220 390H950M220 320H950" stroke="#dedad1"/><g fill="#db784a"><rect x="250" y="400" width="65" height="130"/><rect x="360" y="350" width="65" height="180"/><rect x="470" y="390" width="65" height="140"/><rect x="580" y="300" width="65" height="230"/><rect x="690" y="330" width="65" height="200"/><rect x="800" y="260" width="65" height="270"/></g><text x="220" y="585" font-family="monospace" font-size="14" fill="#57534e">DATA VISUALIZATION STUDY / 03</text></g>`,
  ),
);
const photos = [
  ["light", "Cahaya & bidang", "Light & planes", "#b7c5c0", "#d8c0a0"],
  ["quiet", "Jeda di tepian", "A quiet edge", "#b5c9cb", "#e7d5b4"],
  [
    "shape",
    "Percakapan bentuk",
    "Shapes in conversation",
    "#cba88e",
    "#e3d3b7",
  ],
  ["blue", "Setelah biru", "After the blue", "#9eafbf", "#d4d4c8"],
];
for (const [i, [slug, , , sky, ground]] of photos.entries())
  write(
    `public/images/photography/${slug}.svg`,
    svg(
      `<defs><linearGradient id="s" x2="0" y2="1"><stop stop-color="${sky}"/><stop offset="1" stop-color="#efebe1"/></linearGradient><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".10"/></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply"/></filter></defs><g filter="url(#grain)"><rect width="1000" height="1200" fill="url(#s)"/><circle cx="${720 - i * 110}" cy="250" r="95" fill="#f6eedb"/><path d="M0 ${780 - i * 50}L1000 620V1200H0Z" fill="${ground}"/>${i % 2 === 0 ? '<path d="M170 920V370l340-130v650Z" fill="#e8ddc6"/><path d="M510 240l190 150v520l-190-20Z" fill="#a38c74"/><path d="M510 890l190 20 300 290H820Z" fill="#887e72"/><path d="M265 885V570q0-130 145-140v435Z" fill="#6d776e"/>' : '<path d="M0 800Q300 670 600 790T1000 780V1200H0Z" fill="#6e9395"/><path d="M0 950Q290 760 610 920T1000 900V1200H0Z" fill="#315c65"/><path d="M100 1010Q310 920 540 980" fill="none" stroke="#b8c6bf" stroke-width="4"/>'}</g>`,
      1000,
      1200,
    ),
  );
const items = [
  [
    "ruang",
    ["web", "uiux"],
    "Ruang — antarmuka web",
    "Ruang — web interface",
    "Eksplorasi struktur halaman dan antarmuka web yang tenang.",
    "Exploring page structure and a calm web interface.",
  ],
  [
    "saku",
    ["uiux", "mobile"],
    "Saku — alur aplikasi",
    "Saku — app flow",
    "Studi alur sederhana untuk layar kecil.",
    "A simple flow study for small screens.",
  ],
  [
    "pola",
    ["data"],
    "Pola — cerita dalam data",
    "Pola — stories in data",
    "Contoh penyajian grafik dengan konteks yang mudah dibaca.",
    "A sample chart presentation with readable context.",
  ],
];
write(
  "content/projects.json",
  JSON.stringify(
    items.map(([slug, categories, id, en, si, se], i) => ({
      slug,
      categories,
      status: "draft",
      sample: true,
      order: i + 1,
      featured: true,
      title: { id, en },
      summary: { id: si, en: se },
      cover: `/images/projects/${slug}.svg`,
      alt: {
        id: `Ilustrasi antarmuka contoh ${slug}; bukan karya pribadi`,
        en: `Sample ${slug} interface illustration; not personal work`,
      },
      tools: [],
      links: {},
      media: [],
    })),
    null,
    2,
  ),
);
write(
  "content/photography.json",
  JSON.stringify(
    photos.map(([slug, id, en], i) => ({
      id: slug,
      status: "draft",
      sample: true,
      order: i + 1,
      featured: true,
      src: `/images/photography/${slug}.svg`,
      width: 1000,
      height: 1200,
      alt: {
        id: `Ilustrasi geometris contoh: ${id.toLowerCase()}`,
        en: `Sample geometric illustration: ${en.toLowerCase()}`,
      },
      caption: { id, en },
    })),
    null,
    2,
  ),
);
for (const [slug] of items) {
  write(
    `content/projects/${slug}/id.mdx`,
    `## Masalah\n\nBagian ini adalah contoh struktur cerita. Tuliskan kebutuhan pengguna, konteks, dan batasan proyek Anda di sini.\n\n## Peran saya\n\nJelaskan kontribusi Anda sendiri. Jika bekerja dalam tim, bedakan tugas pribadi dari hasil bersama.\n\n## Proses\n\nMulai dari pertanyaan, buat sketsa alur, lalu uji keputusan antarmuka. Ganti paragraf ini dengan langkah yang benar-benar Anda lakukan.\n\n<ProcessDiagram steps="Pertanyaan|Eksplorasi|Prototipe|Evaluasi" />\n\n## Solusi dan hasil\n\nJelaskan solusi, alasan di balik keputusan, dan hal yang Anda pelajari. Contoh ini tidak menyatakan hasil riset atau angka dampak apa pun.\n\n<figure><img src="/images/projects/${slug}.svg" alt="Ilustrasi antarmuka contoh, bukan proyek pribadi" /><figcaption>Media contoh — ganti dengan tangkapan layar karya Anda.</figcaption></figure>\n`,
  );
  write(
    `content/projects/${slug}/en.mdx`,
    `## The problem\n\nThis is a sample story structure. Describe your users’ needs, the context, and your project’s constraints here.\n\n## My role\n\nExplain your own contribution. For team projects, distinguish individual responsibilities from shared outcomes.\n\n## The process\n\nStart with a question, sketch the flow, then test interface decisions. Replace this paragraph with steps you actually took.\n\n<ProcessDiagram steps="Question|Explore|Prototype|Evaluate" />\n\n## Solution and outcome\n\nDescribe the solution, the reasons behind your decisions, and what you learned. This sample makes no claims about research findings or impact metrics.\n\n<figure><img src="/images/projects/${slug}.svg" alt="Sample interface illustration, not a personal project" /><figcaption>Sample media — replace with a screenshot of your own work.</figcaption></figure>\n`,
  );
}
