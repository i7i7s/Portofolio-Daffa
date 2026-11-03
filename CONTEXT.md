# Konteks proyek: Portofolio + Arsip Cahaya

Dokumen serah terima. Isinya apa saja yang sudah dibangun, kenapa begitu, cara menjalankan, apa yang belum selesai, dan langkah berikutnya. Cukup tempelkan file ini ke AI atau developer lain supaya mereka bisa langsung melanjutkan.

Terakhir diperbarui: 3 November 2026 · branch `claude/animation-character-improvements-hyq6p3` (belum di-merge ke `main`).

---

## 1. Gambaran singkat

Satu repo GitHub (`i7i7s/Portofolio-Daffa`) berisi **satu website Next.js** (`apps/portfolio`) dengan dua dunia visual:

| | Portofolio | Arsip Cahaya (fotografi) |
|---|---|---|
| Alamat | `/id/`, `/en/` | `/foto/`, `/foto/<rol>/<frame>/` |
| Isi | Proyek web, UI/UX, data, mobile + bio + kontak | Orbit foto 3D, lembar kontak per "rol", jendela bidik |
| Bahasa | Indonesia + Inggris | Indonesia saja |
| Animasi | GSAP, Lenis, SplitText, kursor custom, preloader | GSAP (tanpa Lenis), intro rana, kursor reticle, orbit rAF |
| Root layout | `src/app/(site)/layout.tsx` | `src/app/(foto)/layout.tsx` |

Menu "Fotografi" di portofolio membuka `/foto/`; tautan "Portofolio" di Arsip Cahaya kembali ke `/id/`. Karena dua root layout, pindah di antara keduanya adalah navigasi dokumen penuh (disengaja: CSS kedua dunia tidak boleh saling bocor).

Pemilik: mahasiswa Sistem Informasi, hobi fotografi. Nama asli belum diisi, masih placeholder `[Nama Kamu]` (satu sumber: `content/profile.json`, dipakai juga oleh Arsip Cahaya).

## 2. Riwayat keputusan

1. Versi awal dibuat dengan GPT, lalu dinilai kurang "wah", dan ada karakter/maskot orang. **Maskot dihapus total** (masih ada di riwayat git).
2. Portofolio dirombak dengan animasi yang lebih berani (bagian 4).
3. Situs fotografi sempat dibuat terpisah (monorepo dua app), dengan konsep "proses memotret": Lembar Kontak + Kamar Gelap + Jendela Bidik. Halaman risetnya: https://claude.ai/artifact/Ts5hvpMvAPfkYo3tLdCXt5
4. Animasi jemuran foto dibuat, lalu **diganti Orbit** (cincin foto 3D, terinspirasi gambar referensi "Halden / Archive").
5. Copy kedua sisi **ditulis ulang supaya tidak terdengar seperti AI**: orang pertama, fakta daripada slogan, tanpa em dash, tanpa daftar tiga hal.
6. **3 Nov 2026: dua app digabung jadi satu website.** Pemilik ingin satu portofolio dengan Arsip Cahaya sebagai landing page terpisah di dalamnya. `apps/photography` dihapus; isinya dipindah ke `apps/portfolio` (route group `(foto)`). Halaman fotografi internal portofolio (4 ilustrasi SVG) dihapus; `/id/photography/` mengalihkan ke `/foto/`; teaser fotografi di beranda memakai foto asli dari katalog Arsip Cahaya.
7. **Orbit diubah:** kursor di atas foto tidak lagi meluruskan seluruh cincin. Foto itu tetap di cincin dan ikut berputar (melambat), tapi menghadap lurus, membesar, dan maju.
8. **Arsip Cahaya diberi lapisan GSAP** atas permintaan pemilik ("lebih banyak animasi"). Remotion tidak dipakai (itu untuk render video, bukan animasi halaman).
9. **Transisi halaman portofolio diganti.** Wipe lama (0,45 dtk per arah) terasa kecepatan dan ternyata bug: CSS `translateY(100%)` dijumlahkan dengan `yPercent` GSAP sehingga overlay hanya berkedip lalu hilang sebelum rute berganti. Gantinya tirai dua panel (menutup 0,75 dtk, bertahan selama rute dimuat, membuka 0,85 dtk) dengan ✳ dan nama tujuan. Animasi masuk hero menunggu tirai terbuka.
10. Audit `/impeccable critique` dijalankan 3 Nov 2026; temuan yang belum dikerjakan ada di bagian 8.

## 3. Struktur repo

```
Portofolio-Daffa/
  package.json            ← workspaces + skrip (dev, build, build:release, lint, typecheck)
  package-lock.json
  README.md  CONTEXT.md
  PRD-Portofolio-Kreatif.md, MASTER-PROMPT.md, README-MULAI-DI-SINI.md  ← brief awal (historis)
  referensi/              ← gambar referensi desain awal
  apps/portfolio/         ← satu-satunya app. Next.js 16, next-intl, GSAP
    src/app/
      globals.css         ← CSS portofolio (hanya diimpor (site)/layout)
      (site)/layout.tsx   ← root layout portofolio: font Manrope, MotionRoot
      (site)/[locale]/    ← beranda, projects, projects/[slug], photography (redirect ke /foto/), 404
      (foto)/layout.tsx   ← root layout Arsip Cahaya: font Archivo, boot script, FotoShell
      (foto)/foto.css     ← CSS Arsip Cahaya (hanya diimpor (foto)/layout)
      (foto)/foto/        ← page.tsx (beranda foto), [roll]/[frame]/page.tsx, not-found, [...rest]
      sitemap.ts, robots.ts
    src/components/       ← portofolio: motion.tsx, fx.tsx, projects, gallery, interests, contact, header
    src/components/foto/  ← Arsip Cahaya (lihat bagian 5)
    src/lib/foto/catalog.ts ← tipe dan helper katalog; nama pemilik dari profile.json
    src/generated/foto-catalog.json ← hasil build (di-.gitignore)
    src/proxy.ts          ← middleware next-intl; matcher mengecualikan /foto
    content/              ← profile.json, projects.json, projects/<slug>/{id,en}.mdx
    content/foto/rolls.json ← rol, foto, caption, tanda keep/reject, judul situs
    public/photos/        ← foto Arsip Cahaya (sekarang 18 foto contoh hasil generate)
    messages/             ← id.json, en.json (kunci harus sama)
    scripts/              ← validate-content.ts, build-foto-catalog.ts, create-foto-samples.mjs, dll.
    tests/                ← Playwright: portfolio.spec.ts (portofolio), foto.spec.ts (Arsip Cahaya)
```

## 4. Portofolio (`/id/`, `/en/`)

**Stack:** Next.js 16 App Router, React 19.3, TypeScript, Tailwind 4 (hanya PostCSS; styling di `globals.css`), next-intl, GSAP (ScrollTrigger, SplitText, Flip), Lenis, MDX lokal, Zod. Font Manrope + IBM Plex Mono di `src/fonts`.

**Animasi:** preloader 000→100 sekali per sesi; hero per huruf, stiker, kata berganti, tumpukan kartu mengikuti mouse; dua pita marquee yang mengikuti kecepatan scroll; "Karya pilihan" di-pin dan bergeser horizontal di ≥1024px; judul per huruf; kursor custom; progress scroll; **tirai halaman** (bagian 2 no. 9). `prefers-reduced-motion` mematikan semua animasi berat dan tirai.

**Konten:** `content/` dan `messages/`. Data bertanda `sample: true` atau `status: draft` hanya muncul di mode preview. `npm run build:release` **sengaja gagal** selama masih ada `[`, email kosong, `siteUrl` kosong, atau nama `[Nama Kamu]`. Bagian "Fotografi" di beranda memakai tiga foto pilihan dari katalog Arsip Cahaya (`teaserFrames` di `lib/foto/catalog.ts`).

## 5. Arsip Cahaya (`/foto/`)

**Konsep:** proses memotret. Palet kertas abu dingin / hitam film / amber kode tepi / merah spidol (mengikuti tema gelap OS; halaman bidik selalu gelap). Font Archivo variabel + IBM Plex Mono, grain halus.

File di `src/components/foto/`:

| File | Peran |
|---|---|
| `gsap.ts` | Registrasi plugin (ScrollTrigger, SplitText, ScrambleText), query `MOTION_OK`, event `foto:intro-done` |
| `shell.tsx` | Intro rana (lubang membesar, sekali per sesi lewat `sessionStorage`) + kursor reticle |
| `orbit.tsx` | Cincin 3D (rAF). Hover: foto menghadap lurus, membesar, maju, tetap mengorbit. Dorongan dari scroll. Menunggu intro selesai |
| `home-fx.tsx` | Judul "dicuci" per huruf, hitungan angka, parallax cincin, pita film, strip keluar dari sarungnya, frame jatuh, spidol digambar, penghitung frame di pojok |
| `roll-index.tsx` | Daftar rol; di-hover menampilkan foto sampul di samping kursor |
| `contact-sheet.tsx` | Strip film per rol (server component) |
| `frame-fx.tsx` | Jendela bidik: rana, kotak fokus berburu lalu mengunci, tarik fokus, EXIF berputar, foto masuk dari sisi arah panah |
| `frame-keys.tsx` | ← → Esc, menyimpan arah ke `sessionStorage` |
| `develop-image.tsx` | Efek cuci foto saat gambar selesai dimuat |

**Pola animasi (penting):**
- `<html>` dapat class `js`, `motion-ok`, dan `is-intro` dari boot script di `(foto)/layout.tsx` sebelum paint. `foto.css` menyembunyikan state awal hanya di bawah `.motion-ok`, **dan tiap state awal punya keyframe cadangan** (`fx-show`, `fx-vis`, …) supaya halaman tidak pernah kosong kalau JS gagal.
- Semua animasi di bawah `gsap.matchMedia(MOTION_OK)`. Reduced motion = halaman jadi, tidak ada yang tersembunyi, orbit diam.
- Jangan beri transform lewat CSS pada elemen yang dianimasikan GSAP dengan `xPercent`/`yPercent` (GSAP menjumlahkannya dengan transform CSS; itulah bug tirai lama).
- Frame di lembar kontak `visibility:hidden` sampai strip-nya di-scroll ke layar. Di tes Playwright, scroll dulu ke rolnya sebelum mengklik.
- `<ViewTransition>` React (frame lembar kontak → jendela bidik) tetap dipakai; jangan sembunyikan `opacity` foto di halaman bidik (snapshot transisi akan kosong). Hanya `filter`/`scale` yang dianimasikan.
- Orbit: posisi kartu ditulis ke `style.transform` lewat JS, jadi jangan beri prop `style` pada kartu. Hover dihitung ulang tiap frame dari posisi pointer terakhir (`elementFromPoint`) karena cincin terus bergerak.

## 6. Cara menjalankan

Node.js 22. Dari folder utama repo:

```sh
git fetch origin
git checkout claude/animation-character-improvements-hyq6p3
npm ci
npm run dev    # http://127.0.0.1:3000/id/  dan  http://127.0.0.1:3000/foto/
```

Pemeriksaan (jalankan `npm run typecheck`/`lint`/`build` dari root, sisanya dari `apps/portfolio`):

```sh
npm run typecheck && npm run lint && npm run build
cd apps/portfolio && npm run validate && npm run test:content
# e2e: server berjalan di :3000 (dev atau build:preview + start:preview), lalu
npm run test:e2e        # portfolio.spec.ts + foto.spec.ts, 3 project (desktop, mobile, reduced)
```

`playwright.config.ts` memakai `channel: "chrome"`, jadi Google Chrome harus terpasang.

## 7. Menambah konten

- **Proyek:** entri di `apps/portfolio/content/projects.json`, cerita di `content/projects/<slug>/{id,en}.mdx`, gambar di `public/images/projects/`.
- **Foto:** JPG di `apps/portfolio/public/photos/<id-rol>/`, lalu rol/frame di `content/foto/rolls.json` (`mark`: `"keep"`/`"reject"`). EXIF dibaca otomatis dari JPG. Hapus rol `"sample": true` beserta foldernya saat foto asli masuk.
- **Teks:** ikuti "Menulis teks" di `apps/portfolio/README.md`.

## 8. Yang belum selesai

**Dari `/impeccable critique` (3 Nov 2026), diurutkan menurut dampak:**

1. **P1, serah-terima dua sisi.** `/foto/` Indonesia saja (`lang="id"` tetap), tautan baliknya selalu ke `/id/` (pengunjung English dikembalikan ke versi Indonesia), tanpa pengalih bahasa, dan tanpa tanda pengenal bersama (✳ / lockup nama) antar kedua sisi.
2. **P1, hero portofolio dibangun untuk nama 11 huruf.** Stiker `.hero-pill` dan pita `.hero-ribbon` menutupi huruf nama (`[Nama Kamu]`) di 1440px, dan nama asli 20+ huruf akan membungkus. Ekor huruf "g" pada "kadang" terpotong mask SplitText. Dua kartu hero memakai gambar yang sama. Badge berputar terpotong di bawah.
3. **P2, copy dan label tidak konsisten.** Panah ↗ dipakai di tautan internal; "Karya pilihan · 3 dari 3 proyek" padahal tidak dikurasi; tab bidang masih `01 Web ↗`; "dipilih" / "favorit" / "keep" dipakai bergantian; teks interest generik. Catatan lama: tab bidang di `interests.tsx`.
4. **P2, aksesibilitas.** Judul proyek di `/projects/` loncat h1→h3 (ganti h2). Landmark `<nav aria-label>` desktop berlabel "Buka menu". Nama tautan bahasa terlalu berisik. Tidak ada tombol jeda animasi otomatis (WCAG 2.2.2). Dua tautan bernama "Lembar kontak" di halaman bidik menuju tempat berbeda.
5. **P2, mobile Arsip Cahaya.** Nomor tepi film tidak sejajar dengan frame saat grid jadi 2 kolom; petunjuk "← → Esc" tampil di HP; tidak ada geser antar-frame; teks 9–10px (`small.mono`, `.frame-no`).
6. **P3.** Peringatan LCP Next untuk cover proyek (`priority`); tipografi portofolio ±28 ukuran font; disclaimer "contoh" berulang di tiap kartu/rol; orbit memotong foto lanskap jadi potret.

**Sebelum deploy:** isi `profile.json` (nama, email, `siteUrl`, bio tanpa kurung siku), ganti foto contoh dengan foto asli, jangan set `CONTENT_PREVIEW=true` di production. Pertimbangkan cek rilis di `build-foto-catalog.ts` yang menolak rol `sample: true` (belum ada).

## 9. Deploy (belum dilakukan)

- **Rekomendasi: Vercel** (Hobby gratis untuk non-komersial). **Satu project**, Root Directory `apps/portfolio`, build command `npm run build:release`.
- **Domain:** satu domain cukup (`namakamu.com`); Arsip Cahaya ada di `namakamu.com/foto/`, tidak perlu subdomain. `.my.id` paling murah; `.com` sekitar Rp150–250 ribu per tahun (cek harga perpanjangan).
- Sebelum deploy: merge branch ke `main` lewat pull request.

## 10. Hal teknis yang perlu diingat

- **Next.js 16 berbeda dari versi lama.** Baca `node_modules/next/dist/docs/` sebelum mengubah API Next. Contoh: middleware bernama `proxy.ts`, `<ViewTransition>` diimpor dari `react`.
- **Dua root layout:** tidak ada `src/app/layout.tsx`. Route yang tidak cocok di `/foto/*` ditangani `(foto)/foto/[...rest]` + `(foto)/foto/not-found.tsx`; selain itu `(site)/[locale]/[...rest]`. Matcher `proxy.ts` mengecualikan `foto(?:/|$)`.
- **`AGENTS.md`** dibuat ulang otomatis oleh `next dev`. Biarkan, boleh di-commit.
- **Monorepo:** `node_modules` di-hoist ke root; font disalin ke `src/fonts`.
- **Test e2e:** test portofolio menunggu intro selesai sebelum axe; test foto menunggu `is-intro` hilang dan `opacity` hero 1; test orbit menunggu `data-settled` di `.orbit-stage`. Pada project `reduced`, cincin tidak berputar sendiri (cek gerak dilewati).
- **Jangan menaruh GSAP di route `(site)` baru lewat `components/foto/gsap.ts`** (itu khusus `/foto/`); portofolio punya registrasinya sendiri di `components/motion.tsx`.
