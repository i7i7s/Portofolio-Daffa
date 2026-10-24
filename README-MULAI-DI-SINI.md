# Mulai di sini — Paket portofolio kreatif

Paket ini berisi bahan pembangunan website: PRD versi 1.1, master prompt, lima pose karakter transparan, panduan aset, metadata, dan gambar referensi desain. Sumber website belum dibangun dalam paket ini.

## Cara menggunakan

1. Ekstrak ZIP terlebih dahulu.
2. Buka folder hasil ekstraksi di alat coding yang akan dipakai.
3. Buka `MASTER-PROMPT.md`, lalu salin instruksi setelah garis pemisah ke chat agen coding.
4. Pastikan agen dapat membaca PRD, folder karakter, dan gambar referensi. Jika memakai chat dengan lampiran, lampirkan bahan yang diperlukan bersama prompt.
5. Tinjau pratinjau website yang dihasilkan, lalu isi identitas, karya, foto, dan kontak lewat file konten.

## Susunan paket

```text
paket-portofolio-kreatif/
  README-MULAI-DI-SINI.md
  MASTER-PROMPT.md
  PRD-Portofolio-Kreatif.md
  referensi/
    desain-editorial-potozon.png
  karakter-it-fotografi/
    01-hello.png
    02-coding.png
    03-shooting.png
    04-reviewing.png
    05-success.png
    manifest.json
    README.md
    prompts.txt
```

`MASTER-PROMPT.md` berisi instruksi pembangunan website. `karakter-it-fotografi/prompts.txt` berisi prompt pembuatan gambar karakter; keduanya mempunyai fungsi berbeda.

## Arah yang sudah diputuskan

- Editorial modern, tema terang, judul besar, kolase, dan aksen oranye.
- Karya IT sebagai isi utama; fotografi sebagai hobi pendamping.
- Bahasa Indonesia dan Inggris.
- Next.js, React, TypeScript, Tailwind CSS, GSAP, Lenis, next-intl, JSON/MDX, dan Zod.
- Full animasi pada pembuka, scroll, perpindahan halaman, proyek, galeri, menu, kontak, dan maskot.
- Lima pose karakter statis dengan alpha transparan, masing-masing 1254 × 1254 px. Gerak anggota tubuh terpisah memerlukan aset tambahan.
- Konten pribadi diisi kemudian melalui file; tidak membutuhkan admin panel atau database untuk rilis awal.

Gambar Potozon adalah referensi visual yang diberikan pengguna. Foto dan identitas pada gambar tersebut bukan konten portofolio pemilik. Gunakan komposisinya sebagai inspirasi dan isi website dengan karya pemilik atau contoh pratinjau yang diberi label.
