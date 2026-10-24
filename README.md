# Portofolio Kreatif

Website portofolio mahasiswa Sistem Informasi dengan tampilan editorial, dua bahasa (ID/EN), animasi GSAP, dan galeri fotografi.

![Pratinjau desktop](qa/desktop-hero.png)

## Menjalankan lokal

Gunakan Node.js 22 LTS, lalu jalankan:

```sh
npm ci
npm run dev
```

Buka [http://127.0.0.1:3000/id/](http://127.0.0.1:3000/id/). Mode development menampilkan konten contoh berstatus draft. Identitas awal tetap `[Nama Kamu]`.

## Panduan

- [Menjalankan, mengisi konten, dan deployment Vercel](README-WEBSITE.md)
- [Hasil pengujian dan batasan](QA-REPORT.md)
- [PRD](PRD-Portofolio-Kreatif.md)
- [Screenshot HP](qa/mobile.png)

Konten dapat diedit melalui `content/` dan `messages/`. Mode publik menyembunyikan draft dan contoh. Build rilis memeriksa kelengkapan identitas, kontak, dan domain.

## Stack dan pemeriksaan

Next.js App Router, React, TypeScript, Tailwind CSS, next-intl, GSAP (ScrollTrigger, SplitText, Flip), Lenis, JSON/MDX lokal, Zod, dan Playwright.

```sh
npm run validate
npm run test:content
npm run typecheck
npm run lint
npm run build:preview
```

Dengan server lokal berjalan, jalankan `npm run test:e2e`. Lihat panduan untuk pengaturan Chrome, mode produksi, dan cara menambahkan proyek/foto.
