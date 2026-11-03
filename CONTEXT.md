# Konteks proyek: Portofolio + Arsip Cahaya

Dokumen serah terima. Isinya apa saja yang sudah dibangun, kenapa begitu, cara menjalankan, apa yang belum selesai, dan langkah berikutnya. Cukup tempelkan file ini ke AI atau developer lain supaya mereka bisa langsung melanjutkan.

Terakhir diperbarui: 3 November 2026 · branch `claude/animation-character-improvements-hyq6p3` (belum di-merge ke `main`).

---

## 1. Gambaran singkat

Satu repo GitHub (`i7i7s/Portofolio-Daffa`) berisi **dua website Next.js** yang dideploy terpisah:

| | Portofolio | Arsip Cahaya (situs foto) |
|---|---|---|
| Folder | `apps/portfolio` | `apps/photography` |
| Isi | Proyek web, UI/UX, data, mobile + bio + kontak | Galeri foto per "rol" (seri) |
| Bahasa | Indonesia + Inggris (`/id/`, `/en/`) | Indonesia saja |
| Animasi | GSAP, Lenis, SplitText (berat, "wah") | CSS + sedikit JS, tanpa library (ringan) |
| Port lokal | 3000 | 3002 |

Pemilik: mahasiswa Sistem Informasi, hobi fotografi. Nama asli belum diisi, masih placeholder `[Nama Kamu]`.

## 2. Riwayat keputusan

1. Versi awal dibuat dengan GPT, lalu dinilai kurang "wah", animasinya sedikit, dan ada karakter/maskot orang. **Maskot dihapus total**, termasuk gambar, komponen, dan folder sumbernya. Kalau perlu, semuanya masih bisa diambil dari riwayat git.
2. Portofolio dirombak dengan animasi yang lebih berani (lihat bagian 4).
3. Pemilik ingin situs fotografi terpisah dalam satu repo, jadi struktur diubah menjadi **monorepo npm workspaces**.
4. Riset tema foto menghasilkan konsep "proses memotret": **Lembar Kontak + efek Kamar Gelap + Jendela Bidik**. Halaman risetnya (artifact): https://claude.ai/artifact/Ts5hvpMvAPfkYo3tLdCXt5
5. Pemilik minta animasi jemuran foto. Sempat dibuat, termasuk versi 3D, lalu **diganti dengan Orbit** atas permintaan pemilik (cincin foto 3D yang lurus saat di-hover, terinspirasi gambar referensi "Halden / Archive").
6. Copy kedua situs **ditulis ulang supaya tidak terdengar seperti AI**: orang pertama, fakta daripada slogan, tanpa em dash, tanpa daftar tiga hal, tanpa nomor dekoratif.
7. Audit UX/UI sudah dijalankan. Temuan yang belum dikerjakan ada di bagian 8.

## 3. Struktur repo

```
Portofolio-Daffa/
  package.json            ← workspaces + skrip gabungan (dev, dev:photo, build, lint, typecheck)
  package-lock.json       ← satu lockfile untuk dua app
  README.md               ← ringkasan + tabel dua website
  CONTEXT.md              ← file ini
  PRD-Portofolio-Kreatif.md, MASTER-PROMPT.md, README-MULAI-DI-SINI.md  ← dokumen brief awal (historis)
  referensi/              ← gambar referensi desain awal (Potozon)
  apps/
    portfolio/            ← Next.js 16, next-intl, GSAP
      src/app/[locale]/   ← halaman: beranda, projects, projects/[slug], photography, 404
      src/components/
        motion.tsx        ← MotionRoot (Lenis, page wipe) + Choreography (semua animasi scroll)
        fx.tsx            ← Preloader, Cursor, ScrollProgress, Marquee, RotatingBadge, Magnetic, WordRotator
        projects.tsx, gallery.tsx, interests.tsx, contact.tsx, header.tsx
      content/            ← profile.json, projects.json, projects/<slug>/{id,en}.mdx, photography.json
      messages/           ← id.json, en.json (semua teks antarmuka; kuncinya harus sama)
      scripts/            ← validate-content.ts, validate-fixtures.mjs, screenshots.mjs, dll.
      tests/              ← Playwright (27 test: desktop, mobile, reduced motion)
      README.md           ← panduan lengkap portofolio (isi konten, deploy, panduan menulis teks)
    photography/          ← Next.js 16, tanpa library animasi
      src/app/            ← page.tsx (beranda), foto/[roll]/[frame]/page.tsx (jendela bidik), not-found
      src/components/
        orbit.tsx         ← cincin 3D (hero)
        contact-sheet.tsx ← strip film per rol
        develop-image.tsx ← efek "cuci foto" saat gambar dimuat
        frame-keys.tsx    ← tombol ← → Esc di halaman foto
      src/lib/catalog.ts  ← tipe dan helper katalog
      src/generated/      ← catalog.json hasil build (di-.gitignore)
      content/rolls.json  ← data rol, foto, caption, tanda keep/reject, info situs
      public/photos/      ← file foto (sekarang 18 foto contoh hasil generate)
      scripts/build-catalog.ts   ← baca EXIF + ukuran + placeholder blur → catalog.json
      scripts/create-samples.mjs ← membuat foto contoh
      tests/              ← Playwright (11 test)
      README.md           ← panduan situs foto (cara menambah foto, deploy)
```

## 4. Portofolio (`apps/portfolio`)

**Stack:** Next.js 16 App Router, React 19.3, TypeScript, Tailwind 4 (hanya sebagai PostCSS; styling utamanya ada di `src/app/globals.css`), next-intl (ID/EN), GSAP (ScrollTrigger, SplitText, Flip), Lenis (smooth scroll), MDX lokal, Zod (validasi konten). Font: Manrope + IBM Plex Mono, di-vendor di `src/fonts`.

**Animasi:**
- **Preloader:** hitungan 000→100, hanya sekali per sesi. Diputuskan oleh inline script di `src/app/layout.tsx` sebelum paint.
- **Hero:**
  - nama muncul per huruf;
  - stiker "Kode × Kamera" dan pita "Sistem Informasi";
  - kata yang berganti ("Lagi belajar: Web/UI/UX/Data/Mobile");
  - tumpukan kartu yang bergerak mengikuti mouse dan parallax;
  - badge berputar dan tombol magnetik.
- **Pita marquee:** dua pita bersilang yang kecepatannya mengikuti kecepatan scroll.
- **Karya pilihan:** di-pin dan bergeser horizontal di layar ≥1024px. Kartu miring 3D mengikuti mouse.
- **Judul dan galeri:** judul section terbuka per huruf, judul "Tentang" menyala kata demi kata, dan foto teaser menyebar seperti kipas.
- **Kontak:** ledakan bintang saat email disalin.
- **Global:** kursor custom dengan label, progress bar scroll, dan page wipe.
- **Reduced motion:** `prefers-reduced-motion` mematikan semua animasi berat.

**Konten:** semua di `content/` dan `messages/`. Data yang ditandai `sample: true` atau `status: draft` hanya muncul di mode preview. Bio punya placeholder `[nama kampus]`, dan `npm run build:release` **sengaja gagal** selama masih ada kurung siku, email kosong, `siteUrl` kosong, atau nama masih `[Nama Kamu]`.

## 5. Arsip Cahaya (`apps/photography`)

**Konsep:** proses memotret. Palet: kertas abu dingin, strip film hitam, kode tepi amber, spidol merah. Font: Archivo variabel (lebar 125% untuk judul) + IBM Plex Mono. Ada tekstur grain halus.

- **Orbit (hero, `orbit.tsx`):**
  - Bentuk: foto tersusun melingkar di ruang 3D, miring ke belakang. Judul situs (h1) berada di tengah cincin.
  - Gerak: cincin berputar sendiri dan bisa diseret dengan inertia.
  - Hover: saat kursor kena satu foto, cincin terurai jadi barisan lurus di sekitar foto itu, foto itu membesar 1,38× dan maju sedikit, tetangganya bergeser, dan judul memudar.
  - Teknik: semua dihitung per frame dengan rAF, bukan transisi CSS. Konstanta yang bisa diatur ada di atas file: `TILT`, `AUTO`, `GROW`, `LIFT`, `GRACE`, `MAX_CARDS`.
  - Batas: maksimal 24 foto, 10 di HP. Loop berhenti saat tidak terlihat.
  - Aksesibilitas: orbit `aria-hidden` dan tidak masuk urutan Tab, karena foto yang sama sudah ada di lembar kontak.
- **Lembar kontak:** satu strip film per rol, lengkap dengan lubang sprocket, kode tepi, dan nomor frame. Foto `keep` dilingkari spidol merah, foto `reject` dicoret. Strip "keluar dari sarungnya" saat discroll (CSS `animation-timeline`, hanya Chrome/Safari 26+).
- **Efek cuci:** foto muncul dari kertas pucat ke warna penuh saat selesai dimuat.
- **Jendela bidik (`/foto/<rol>/<frame>/`):**
  - Tampilan: halaman gelap dengan siku bingkai, kotak AF, efek rana, foto yang fokus dari blur, dan HUD EXIF.
  - Transisi: frame di lembar kontak membesar ke halaman ini lewat React `<ViewTransition>`.
  - Keyboard: ← → pindah frame, Esc kembali.
- **Data:** `content/rolls.json`. EXIF (kamera, lensa, ƒ, shutter, ISO, focal, waktu) **dibaca otomatis dari file JPG** saat dev/build. Blok `exif` di JSON hanya cadangan.
- **Bobot (diukur lokal):** sekitar 152 KB JS gzip (hampir semuanya runtime React/Next) dan 103 KB font. Portofolio sekitar 228 KB JS.

## 6. Cara menjalankan

Butuh Node.js 22. Semua perintah dijalankan dari **folder utama repo**:

```sh
git fetch origin
git checkout claude/animation-character-improvements-hyq6p3
npm ci              # pasang dependensi dua app sekaligus
npm run dev         # portofolio  → http://127.0.0.1:3000/id/
npm run dev:photo   # situs foto  → http://127.0.0.1:3002/
```

Kalau sebelumnya pernah install versi lama (sebelum monorepo), hapus dulu `node_modules` dan `.next` di root.

Pemeriksaan:

```sh
npm run typecheck && npm run lint && npm run build
cd apps/portfolio && npm run validate && npm run test:content
# e2e portofolio: npm run build:preview && npm run start:preview, lalu npm run test:e2e
# e2e foto:      cd apps/photography && npm run build && npm start, lalu npm run test:e2e
```

Catatan: `playwright.config.ts` portofolio memakai `channel: "chrome"`, jadi perlu Google Chrome terpasang. Status terakhir: portofolio 27/27 lolos, situs foto 11/11 lolos.

## 7. Menambah konten

- **Proyek portofolio:** tambahkan entri di `apps/portfolio/content/projects.json`, lalu cerita di `content/projects/<slug>/id.mdx` dan `en.mdx`, dan gambar di `public/images/projects/`. Detail lengkap ada di `apps/portfolio/README.md`.
- **Foto:** taruh JPG di `apps/photography/public/photos/<id-rol>/`, lalu tambahkan rol atau frame di `content/rolls.json` (`mark`: `"keep"` / `"reject"`). Hapus rol contoh yang bertanda `"sample": true` beserta foldernya.
- **Teks:** ikuti panduan "Menulis teks" di `apps/portfolio/README.md`, supaya hasilnya tidak terdengar seperti AI.

## 8. Yang belum selesai (dari audit UX/UI, 2 Nov 2026)

Diurutkan dari dampak terbesar per usaha:

1. **Cincin fokus situs foto hampir tak terlihat** (WCAG 1.4.11). Kontras amber `#f0b429` di atas kertas hanya 1.56:1. Ganti `:focus-visible` di tema terang ke `--ink` atau amber gelap `#8a5a00`.
2. **`portfolioUrl` masih localhost** (`apps/photography/content/rolls.json`, `"http://127.0.0.1:3000/id/"`). Isi dengan domain asli, dan tambahkan cek rilis di `build-catalog.ts` yang menolak localhost, `[Nama Kamu]`, dan rol sample.
3. **Tab bidang di portofolio masih bertuliskan `01 Web ↗`.** Hapus nomor dan panah ↗ (`interests.tsx`).
4. **Portofolio tidak menautkan Arsip Cahaya.** Menu "Fotografi" masih membuka galeri internal berisi 4 ilustrasi SVG. Tambahkan `photoSiteUrl` di `profile.json` dan arahkan "Lihat galeri" ke sana, atau hapus halaman fotografi internal.
5. **Halaman proyek: judul lompat dari h1 ke h3.** Ganti judul kartu jadi h2.
6. **Dua link bernama "Lembar kontak"** di halaman foto menuju tempat berbeda. Ganti label tombol bawahnya.
7. **Animasi otomatis tanpa tombol jeda** (WCAG 2.2.2): marquee, badge, word rotator, dan orbit. Tambahkan tombol "Jeda animasi" global.
8. **Tipografi portofolio:** ada 28 ukuran font berbeda dan 62% teks tebal. Rapikan ke sekitar 8 token, dan label minimal 12px.
9. **Caption kartu hero terpotong di HP** (dekoratif).

Yang sudah bagus: kontras teks 0 gagal, cincin fokus portofolio 5.72:1, tidak ada tap target di bawah 24px, satu h1 per halaman, paritas ID/EN identik, semua link 200, console bersih.

## 9. Deploy (belum dilakukan)

- **Rekomendasi: Vercel** (paket Hobby gratis, untuk penggunaan non-komersial). Buat **dua project** dari repo yang sama:
  - Root Directory `apps/portfolio`, build command `npm run build:release`
  - Root Directory `apps/photography`, build command bawaan (`npm run build`)
- **Domain:**
  - `.my.id` paling murah (registrar lokal);
  - `.com` sekitar Rp150–250 ribu per tahun (Cloudflare Registrar menjual sesuai harga modal);
  - cek harga perpanjangan, bukan hanya promo tahun pertama;
  - cukup satu domain + subdomain, misalnya `namakamu.com` dan `foto.namakamu.com`.
- **Sebelum deploy:**
  - merge branch ke `main` lewat pull request;
  - isi `profile.json` (nama, email, `siteUrl`, bio tanpa kurung siku);
  - isi `portfolioUrl`;
  - ganti foto contoh dengan foto asli;
  - jangan set `CONTENT_PREVIEW=true` di production.

## 10. Hal teknis yang perlu diingat

- **Next.js 16 berbeda dari versi lama.** Baca panduan di `node_modules/next/dist/docs/` sebelum mengubah API Next. Contohnya: middleware sekarang bernama `proxy.ts`, dan `<ViewTransition>` diimpor dari `react`.
- **`AGENTS.md`** di tiap app dibuat ulang otomatis oleh `next dev`. Biarkan saja, boleh di-commit.
- **Monorepo:** root Turbopack terdeteksi otomatis dari `package-lock.json` di root. Font sengaja disalin ke `src/fonts` karena `node_modules` di-hoist ke root.
- **Situs foto:** jangan menambah GSAP. Ringan adalah keputusan desain. Animasi baru sebaiknya CSS atau rAF kecil.
- **Orbit:** posisi kartu ditulis langsung ke `style.transform` lewat JS, jadi jangan beri prop `style` di elemen kartu dari React. Hover hanya dihitung dari `pointermove` sungguhan supaya cincin tidak bolak-balik.
- **Portofolio:** inline script di `layout.tsx` memasang class `motion-ok`, `is-preloading`, dan `hero-ready` sebelum paint. Hero disembunyikan lewat CSS sampai intro GSAP mulai, dengan cadangan 4 detik.
- **Test e2e:**
  - Test portofolio menunggu animasi intro selesai sebelum axe.
  - Test orbit menunggu atribut `data-settled` di `.orbit-stage`.
  - Tombol keyboard halaman foto dipasang lewat `useLayoutEffect`, karena `useEffect` bisa kehilangan tombol yang ditekan tepat saat halaman tampil.
