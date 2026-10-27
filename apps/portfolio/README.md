# Portofolio kreatif — menjalankan dan mengisi website

Sumber implementasi berada di folder ini, berdampingan dengan PRD dan aset asli. Tidak ada publikasi atau akun hosting yang dibuat. Nama tetap `[Nama Kamu]`; tidak ada identitas yang diambil dari komputer.

## Menjalankan lokal

Repositori ini monorepo. Website portofolio ada di `apps/portfolio`, website fotografi di `apps/photography`. Gunakan Node.js 22 LTS, lalu dari **folder utama repositori**:

```sh
npm ci
npm run dev
```

Buka **http://127.0.0.1:3000/id/** atau **http://127.0.0.1:3000/en/**. `/` dialihkan ke `/id/`. `npm ci` memasang dependensi kedua website sekaligus dari `package-lock.json` di folder utama. Perintah `npm run …` lain di panduan ini dijalankan dari folder `apps/portfolio`.

Mode development menampilkan tiga proyek dan empat ilustrasi galeri contoh yang berstatus **draft**. Banner lokal dan label pada setiap media membedakan contoh dari karya pribadi. Ilustrasi antarmuka dan lanskap contoh dibuat khusus untuk menguji tata letak; gambar referensi Potozon tidak digunakan sebagai konten website.

Untuk meninjau optimasi produksi sambil tetap melihat contoh:

```sh
npm run build:preview
npm run start:preview
```

Untuk menguji tampilan publik tanpa contoh:

```sh
npm run build
npm start
```

`CONTENT_PREVIEW=true` menampilkan draft. `CONTENT_PREVIEW=false` menyembunyikan draft, termasuk pada development. Jika diisi sebagai environment variable, restart server sesudah mengubahnya. Build dan start preview harus memakai mode yang sama. Jangan mengaktifkan `CONTENT_PREVIEW` pada deployment publik.

Port bisa diganti, misalnya `npm run dev -- --port 3003`. Server memakai loopback komputer ini. Jika port sudah digunakan, gunakan port lain atau hentikan server yang Anda jalankan sebelumnya.

## Mengganti identitas dan kontak

Edit `content/profile.json`:

- `name`: nama yang ingin ditampilkan; tidak harus nama legal.
- `bio.id` dan `bio.en`: bio dalam dua bahasa. Isi bagian dalam kurung siku, misalnya `[nama kampus]`. `npm run build:release` gagal selama masih ada kurung siku.
- `email`: alamat asli. Kosong berarti tautan email dan tombol salin publik disembunyikan.
- `cv`: misalnya `/files/cv.pdf` setelah menaruh berkas di `public/files/cv.pdf`, atau URL HTTPS.
- `socials`: misalnya `[{"label":"GitHub","url":"https://github.com/akun-anda"}]`.
- `skills`: daftar alat/kemampuan yang memang ingin Anda nyatakan. Tidak ada persentase atau klaim tingkat keahlian otomatis.
- `education` dan `experience`: daftar teks ID/EN, misalnya `[{"id":"Informasi yang benar","en":"Accurate information"}]`. Bagian disembunyikan ketika array kosong.
- `photo` opsional: `{ "src":"/images/profile/potret.webp", "alt":{"id":"Deskripsi potret","en":"Portrait description"}, "width":800, "height":1000 }`. Taruh berkas di `public/images/profile/`; hapus kolom `photo` jika belum ada foto.
- `siteUrl`: domain publik tanpa garis miring terakhir, misalnya `https://portfolio-anda.vercel.app`.

Kontak contoh `hello@example.com` hanya tersedia di panel uji yang tertutup secara default dalam pratinjau. Alamat itu bukan kontak pemilik. Panel dipakai untuk memeriksa clipboard dan pose sukses tanpa mengarang email pribadi.

## Menulis teks

Teks di `messages/` dan `content/` sudah ditulis ulang supaya tidak terdengar seperti hasil AI. Kalau menambah atau mengganti teks, pegangan ini membantu:

- Tulis seperti ngomong ke orang, pakai "saya". Kalau sebuah kalimat tidak akan kamu ucapkan ke teman, ganti.
- Fakta lebih kuat dari klaim. "Dibuat dengan Next.js" lebih jujur daripada "dibangun dengan rasa ingin tahu". Hindari kata seperti *passionate*, inovatif, solusi, pengalaman digital, dan "X bertemu Y".
- Jangan selalu mendaftar tiga hal ("kode, desain, dan sudut pandang"). Dua atau satu biasanya cukup.
- Jangan pakai tanda pisah panjang (—). Pakai titik atau koma.
- Ringkasan proyek cukup satu kalimat tentang apa yang dibuat dan untuk siapa. Cerita lengkapnya ada di halaman proyek.

## Menambahkan satu proyek

1. Taruh sampul Anda di `public/images/projects/proyek-baru.webp`. Nama berkas gunakan huruf/angka, tanda hubung, atau garis bawah.
2. Tambahkan satu objek ke array `content/projects.json`. Jangan menimpa seluruh array.

```json
{
  "slug": "proyek-baru",
  "status": "draft",
  "sample": false,
  "order": 4,
  "featured": true,
  "categories": ["web", "uiux"],
  "title": {"id": "Judul proyek", "en": "Project title"},
  "summary": {"id": "Ringkasan nyata proyek.", "en": "An accurate project summary."},
  "cover": "/images/projects/proyek-baru.webp",
  "alt": {"id": "Deskripsi tampilan sampul.", "en": "Description of the cover."},
  "tools": [],
  "links": {},
  "media": []
}
```

3. Buat `content/projects/proyek-baru/id.mdx` dan `en.mdx`. Gunakan judul bagian `##` untuk masalah, peran pribadi, proses, serta solusi/hasil. Jelaskan pekerjaan nyata. Hapus bagian yang tidak relevan; jangan mengarang hasil riset atau angka dampak.
4. Jalankan `npm run validate`, kemudian periksa detail di kedua bahasa.
5. Setelah siap, ubah `status` menjadi `published`. `sample` harus `false` untuk karya pribadi. Contoh bawaan jangan langsung dijadikan published.

Kategori yang sah: `web`, `uiux`, `data`, `mobile`. Satu proyek bisa memakai beberapa kategori. `order` menentukan urutan dan `featured` memilih karya beranda (maksimal empat).

Kolom opsional: `year` berupa angka, `role` berupa objek ID/EN, dan `links.demo`, `links.repository`, `links.prototype` berupa URL HTTPS yang nyata. `tools: []` menyembunyikan daftar alat. Tautan kosong tidak perlu dicantumkan; jangan menggunakan `"#"`.

Media tambahan dapat dimasukkan dalam `media` sebagai `{ "src": "/images/projects/detail.webp", "alt": {"id":"...","en":"..."}, "width":1200, "height":800 }`.

MDX merupakan file lokal. Markdown, gambar, dan komponen diagram tersedia:

```mdx
## Proses

Jelaskan keputusan dan proses Anda.

<ProcessDiagram steps="Pertanyaan|Eksplorasi|Prototipe|Evaluasi" />

<figure>
  <img src="/images/projects/proyek-baru.webp" alt="Deskripsi gambar" />
  <figcaption>Caption yang menjelaskan media.</figcaption>
</figure>
```

Gunakan atribut string pada komponen, bukan ekspresi JavaScript. `next-mdx-remote` 6 memblokir ekspresi JS; validasi juga memeriksa sintaks MDX sebelum build. Komponen gambar MDX memakai `next/image`; untuk media dengan rasio berbeda, gunakan array `media` agar dimensi asli tercatat.

## Menambahkan satu foto

1. Taruh foto milik Anda di `public/images/photography/nama-foto.webp`. Gunakan dimensi yang cukup untuk tampilan besar, tanpa mengunggah file kamera mentah.
2. Tambahkan objek berikut pada array `content/photography.json`:

```json
{
  "id": "nama-foto",
  "status": "draft",
  "sample": false,
  "order": 5,
  "featured": true,
  "src": "/images/photography/nama-foto.webp",
  "width": 1600,
  "height": 1200,
  "alt": {"id":"Deskripsi isi foto.","en":"Description of the photograph."},
  "caption": {"id":"Judul foto","en":"Photo title"}
}
```

3. `width` dan `height` harus sesuai rasio/dimensi file. `caption`, `album`, `location` (semuanya ID/EN), serta `year` opsional.
4. Uji di galeri, termasuk tampilan besar, lalu ubah status menjadi `published`.

Galeri memperlihatkan seluruh komposisi saat dialog terbuka. Tombol, panah keyboard, Escape, dan geser horizontal pada layar sentuh tersedia. Fokus kembali ke thumbnail asal setelah ditutup. Foto pribadi belum tersedia; empat ilustrasi draft tidak diklaim sebagai fotografi Anda.

## Bahasa, tema, dan animasi

- Pesan antarmuka: `messages/id.json` dan `messages/en.json`. Keduanya harus memiliki kunci yang sama dan nilai yang tidak kosong.
- Tema serta tata letak: `src/app/globals.css`, dengan variabel `--paper`, `--surface`, `--ink`, `--muted`, `--accent`, dan `--line`.
- Pengaturan gerak: `src/lib/motion/config.ts`.
- Koreografi bersama: `src/components/motion.tsx`.
- Efek tambahan (preloader, kursor, progress bar, marquee, badge berputar, tombol magnetik, kata berganti): `src/components/fx.tsx`.

GSAP menjadi mesin gerak tunggal. ScrollTrigger mengatur bagian halaman; SplitText membagi baris judul dan mengembalikan pembungkusnya saat cleanup; Flip menangani perubahan filter. Lenis hanya aktif pada pointer presisi dan tanpa preferensi gerak minimal, dengan satu ticker. Teks tetap berada dalam HTML awal. Browser tanpa JavaScript masih dapat membaca isi, mengikuti tautan, dan menggunakan URL filter; dialog serta clipboard memerlukan JavaScript.

Website tidak lagi memakai karakter/maskot. Kepribadian halaman dibawa oleh tipografi dan gerak:

- Preloader hitung 000→100 dengan tirai, hanya sekali per sesi. Script kecil di `src/app/layout.tsx` memutuskannya sebelum halaman tampil, jadi tidak ada kedipan.
- Hero: nama muncul huruf per huruf di setiap kunjungan, stiker dan pita melompat masuk, kata "Sedang menjelajah" berganti otomatis, tumpukan kartu mengikuti mouse dan bergerak parallax saat scroll, badge berputar, tombol magnetik.
- Dua pita marquee bersilang yang makin cepat dan berbalik arah mengikuti kecepatan scroll.
- Karya pilihan di-pin dan bergeser horizontal di layar ≥1024px, dengan progress bar; kartu proyek miring 3D mengikuti mouse.
- Judul section terbuka per huruf; judul "Tentang" menyala kata demi kata mengikuti scroll.
- Foto teaser menyebar dari tumpukan seperti kipas, dengan teks outline besar yang bergeser di belakang.
- Kontak: pita marquee, badge berputar, dan ledakan bintang saat email disalin.
- Kursor custom dengan label "Lihat/Buka" (hanya mouse) dan progress bar scroll di atas layar.

Preferensi gerak minimal sistem operasi/browser mematikan preloader, Lenis, kursor, marquee, scroll horizontal, parallax, split reveal, dan putaran badge; semua konten tetap tampil statis.

## Pemeriksaan

```sh
npm run validate
npm run test:content
npm run typecheck
npm run lint
npm run build:preview
npm run test:e2e
```

Playwright memakai Chrome yang terpasang, tanpa profil pribadi. Jalankan server terlebih dahulu. Base URL default `http://127.0.0.1:3000`; ubah `TEST_BASE_URL` jika perlu. Jika Chrome tidak ada, instal browser Playwright dengan `npx playwright install chromium` dan hapus `channel: 'chrome'` pada konfigurasi tes.

Skrip `scripts/screenshots.mjs` menyimpan screenshot desktop/HP ke `qa/`. `scripts/performance.mjs` menggunakan Chrome Windows, server produksi preview pada port 3001, serta profil sementara terpisah. Jalankan tanpa build atau tes lain yang sedang aktif untuk mengurangi gangguan pengukuran. Lihat `QA-REPORT.md` untuk hasil yang benar-benar diperiksa dan batasannya.

Pada development, `window.__portfolioMotion()` menyediakan jumlah trigger/tween untuk audit cleanup. API diagnostik ini tidak dipasang pada produksi.

## Deployment Vercel — dilakukan setelah diminta

1. Isi nama, bio dua bahasa, email, dan `siteUrl`. Pastikan semua proyek/foto yang ingin tampil berstatus `published`, `sample: false`, dan memiliki konten dua bahasa.
2. Jalankan `npm run build:release`. Perintah ini sengaja gagal selama identitas, email, atau domain belum diisi. Build lokal biasa tetap bisa dilakukan sebelum itu.
3. Simpan sumber ke repositori Git pilihan Anda; abaikan `node_modules`, `.next`, log, dan berkas environment lokal. Paket ini belum membuat repositori atau mendorong perubahan ke layanan luar.
4. Pada Vercel, impor repositori, isi **Root Directory** dengan `apps/portfolio`, dan pilih preset **Next.js**. Install command: `npm ci`. Build command: **`npm run build:release`**. Pilih Node 22 atau versi LTS kompatibel. Output directory biarkan default.
5. Hapus `CONTENT_PREVIEW` atau set `false` pada lingkungan publik. Isi `siteUrl` dengan domain deployment sebelum build final agar canonical, alternate language, dan sitemap benar.
6. Tinjau deployment preview, lalu promosikan ke produksi saat Anda siap. Perubahan JSON/MDX/aset memerlukan commit dan build/deployment baru; menyimpan file lokal tidak mengubah website publik.

Konfigurasi lokal memakai rilis stabil yang dikunci lockfile: Next.js 16.4.3, React 19.3.1, next-intl 4.14.9, GSAP 3.15.0, Lenis 1.3.27, Tailwind 4.3.3, Zod 4.6.7, next-mdx-remote 6.0.0. Font Manrope disajikan lokal melalui `next/font/local`, tanpa permintaan ke Google Fonts saat halaman dibuka.

Rujukan setup yang diperiksa: [Next.js](https://nextjs.org/docs/app/getting-started/installation), [next-intl](https://next-intl.dev/docs/routing/setup), [GSAP React](https://gsap.com/resources/React/), [SplitText](https://gsap.com/docs/v3/Plugins/SplitText/), [Lenis](https://github.com/darkroomengineering/lenis), [Tailwind PostCSS](https://tailwindcss.com/docs/installation/using-postcss). Panduan versi Next yang terpasang juga tersedia di `node_modules/next/dist/docs/`.
