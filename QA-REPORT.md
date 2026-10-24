# Catatan pemeriksaan portofolio

Tanggal pemeriksaan: 24 Oktober 2026 (Asia/Jakarta). Lingkungan: Windows, Node 22.20.0, Chrome 155 melalui Playwright. Website belum dipublikasikan.

## Hasil implementasi

- Next.js App Router, React, TypeScript, Tailwind, next-intl, GSAP/ScrollTrigger/SplitText/Flip, @gsap/react, Lenis, JSON/MDX lokal, Zod, next/image, dan next/font terpasang dengan lockfile.
- Beranda, semua proyek, detail, fotografi, 404, kondisi kosong, dan penanganan error tersedia dalam ID/EN.
- Filter multi-kategori memakai query URL. Kembali dari detail dan back/forward mempertahankan kategori. Pengalih bahasa mempertahankan slug, query, serta anchor.
- Galeri menggunakan dialog modal, kontrol sentuh, panah keyboard, Escape, penguncian scroll, trap fokus, dan pemulihan fokus.
- Email asli, CV, demo, repositori, prototipe, dan sosial hanya tampil jika tersedia. Panel salin email contoh hanya tampil di mode preview dan menjelaskan bahwa alamatnya bukan kontak pemilik.
- Lima PNG karakter dan manifest disalin ke public. SHA-256 kelima salinan identik dengan sumber; wajah, warna, pakaian, dan transparansi tidak diubah.
- Semua contoh berstatus draft. Gambar referensi tidak dipakai sebagai sampul atau foto galeri. Galeri contoh memakai ilustrasi geometris berlabel.

## Pemeriksaan yang dijalankan

| Pemeriksaan | Hasil |
| --- | --- |
| `npm run typecheck` | Lulus, tidak ada error TypeScript |
| `npm run lint` | Lulus, tidak ada error atau warning pada putaran akhir |
| `npm run validate` | Lulus; JSON, ID/EN, aset, status, kategori, slug, dan sintaks enam MDX diperiksa |
| `npm run test:content` | 7 fixture lulus: konten valid, slug duplikat, aset hilang, terjemahan hilang, kategori tidak sah, contoh published, MDX rusak |
| `npm run build:preview` | Lulus; build produksi Next.js selesai |
| `npm run test:e2e` | **27/27 lulus**, 9 skenario × desktop, HP sentuh, dan gerak minimal |
| Uji ulang setelah penyesuaian akhir | 1 smoke test ID/EN HP serta 9/9 skenario HP lulus; build, lint, dan tipe diperiksa lagi |
| `npm run build:release` | Ditolak sesuai desain: nama placeholder, email kosong, dan siteUrl kosong |
| Pemeriksaan publik terpisah | Draft tidak tampil, detail draft 404, proyek/galeri menampilkan keadaan kosong |
| Browser tanpa JavaScript | Identitas, isi utama, tautan karya, dan filter query server tetap tersedia |
| Aset karakter | 5 dari 5 hash sumber/salinan cocok |
| Screenshot akhir | Tidak ada page error atau overflow horizontal pada pengambilan desktop/HP |

Playwright memeriksa:

1. Halaman ID/EN, atribut `lang`, canonical, deskripsi, gambar, dan status HTTP 404 yang benar.
2. Filter, URL, multi-kategori, detail, back/forward, dan pengalih bahasa.
3. Dialog galeri, tombol sebelumnya/berikutnya, panah keyboard, Tab berulang, Escape, serta fokus kembali ke thumbnail.
4. Tap dan swipe melalui event sentuh Chrome pada emulasi HP.
5. Empat ilustrasi bidang minat; pose hello/coding/shooting/reviewing/success; isi clipboard nyata dan kembalinya pose sukses ke hello.
6. Kegagalan clipboard yang disimulasikan dan pesan fallback; alamat tetap dapat dipilih.
7. Pengalih bahasa dengan anchor, menu HP, fokus menu, dan tidak aktifnya Lenis/transisi dekoratif pada gerak minimal.
8. Lebar 320, 360, 390, 768, 1024, dan 1440 px; reflow viewport 720 px sebagai padanan ruang 1440 px pada 200%, serta perubahan ukuran font root. Tidak ditemukan overflow horizontal. Ini emulasi reflow, bukan pengujian tombol zoom Chrome pada perangkat fisik.
9. Audit axe untuk WCAG A/AA terkait; tidak ditemukan pelanggaran dalam cakupan audit beranda yang diuji. Audit otomatis tidak membuktikan seluruh WCAG terpenuhi.
10. Navigasi berulang dan pemulihan lapisan transisi ketika respons tujuan ditunda 3,3 detik.

Audit diagnostik tambahan pada empat perjalanan beranda → proyek → beranda menghasilkan jumlah identik pada setiap pengambilan: **24 ScrollTrigger, 25 tween/timeline aktif, Lenis aktif**. Tidak ada pertumbuhan jumlah pada alur tersebut. Tidak ada animasi idle berulang tanpa akhir. Listener/ticker manual memiliki cleanup; handler GSAP memakai contextSafe. Dua aturan lint React Compiler (`refs`, `immutability`) dinonaktifkan khusus komponen interaktif karena analisis statis salah menganggap registrasi callback `contextSafe` sebagai eksekusi saat render; pengecualian dijelaskan di konfigurasi ESLint.

## Bukti visual

- `qa/desktop-hero.png` dan `qa/desktop.png`: beranda desktop 1440 px.
- `qa/mobile-hero.png` dan `qa/mobile.png`: beranda HP 390 px.
- `qa/projects-desktop.png`: indeks proyek berbahasa Inggris.
- `qa/detail-desktop.png`: cerita MDX beserta diagram dan media.
- `qa/gallery-desktop.png` dan `qa/gallery-dialog.png`: galeri asimetris serta dialog foto besar.

Screenshot desktop, HP, detail, dan dialog ditinjau secara visual. Perbaikan hasil tinjauan: jarak kolase pembuka, ukuran teks/kontrol, kontras penuh pada teks yang belum masuk viewport, dan tidak terlihatnya lapisan transisi saat idle.

## Animasi yang tersedia

Pembuka memakai SplitText per baris, kolase stagger, stiker, dan masuknya wadah maskot; dijalankan sekali per sessionStorage. Identitas/CTA tersedia pada HTML awal. Bagian proyek memakai reveal media dan parallax desktop; kartu mempunyai respons hover/fokus pada wadah terpisah. Filter memakai Flip. Garis editorial, judul, caption, diagram, dan media cerita mempunyai koreografi berbeda. Bingkai minat berubah ukuran/bentuk melalui atribut SVG. Menu masuk berurutan. Transisi halaman memakai lapisan oranye dengan batas ivory, timeout pemulihan, pembatalan Escape, serta pengecualian untuk modifier klik/tautan eksternal. Galeri membuka gambar dari arah thumbnail dan memberi transisi pendek ketika berpindah. Salin email memberi konfirmasi dan pose sukses.

Gerak minimal memakai isi dan keadaan akhir yang sama, tanpa Lenis, parallax, atau perpindahan dekoratif. HP memakai scroll native. Tidak ada klaim bahwa PNG statis mempunyai animasi sendi atau tangan terpisah.

## Performa lab

Laporan JSON/HTML tersedia di `qa/lighthouse-mobile.json` dan `qa/lighthouse-mobile.html`. Putaran awal disimpan terpisah sebagai `lighthouse-mobile-initial.*`.

Pengukuran memakai build produksi lokal, viewport 390 × 844, throttling mobile simulasi Lighthouse (RTT 150 ms, throughput 1.638,4 Kbps, CPU slowdown 4×), Chrome 155, serta profil browser baru. Hasil merupakan pengukuran lab pada komputer ini; jaringan localhost, cold start server, proses lain, dan media contoh memengaruhi hasil. INP p75 membutuhkan interaksi/data lapangan dan tidak digantikan oleh TBT.

| Metrik | Putaran awal | Build akhir |
| --- | --- | --- |
| Skor Performance | 74 | **95** |
| Accessibility | 100 | **100** |
| Best Practices | 100 | **100** |
| First Contentful Paint | 1,4 detik | **0,9 detik** |
| Largest Contentful Paint | 2,9 detik | **2,8 detik** (2.839 ms) |
| Total Blocking Time | 750 ms | **70 ms** (71 ms) |
| Cumulative Layout Shift | 0 | **0** |
| Speed Index | 4,0 detik | **1,4 detik** |

**LCP lab masih di atas target 2,5 detik.** CLS memenuhi ambang 0,1 pada pengukuran ini. TBT 70 ms merupakan indikator lab, bukan INP. Tidak ada data lapangan p75, sehingga pencapaian Core Web Vitals lapangan belum dinyatakan.

Skor SEO 61 pada pratinjau disebabkan antara lain oleh `noindex/nofollow`, robots yang memblokir crawling, dan canonical domain lokal. Ini sengaja dipertahankan sampai domain serta konten publik diisi. Build rilis memakai metadata/domain yang diberikan pemilik.

Pembaruan pengukuran ScrollTrigger digabung dengan debounce dan sampul tidak lagi dibuat transparan saat hidrasi; koreografi translasi/stagger tetap ada. Putaran akhir juga berjalan tanpa pengujian browser lain bersamaan. Benchmark CPU Lighthouse berbeda antarputaran, sehingga peningkatan skor tidak boleh seluruhnya diatribusikan pada perubahan kode. Smoke test produksi tanpa throttling mengukur LCP 660 ms dan CLS 0; angka tersebut bukan pengganti hasil simulasi mobile di atas.

## Yang masih membutuhkan konten pemilik

Nama tampilan, bio final, proyek dan cerita proses yang nyata, foto pribadi, alat/kemampuan yang ingin dicantumkan, email, CV opsional, sosial opsional, serta domain publik. Tidak ada klien, pengalaman, testimoni, penghargaan, atau angka dampak rekaan.

Foto profil, pendidikan, dan pengalaman mempunyai kolom opsional pada `content/profile.json` dan disembunyikan selama kosong. Cabang berisi konten pribadi perlu ditinjau lagi sesudah data tersebut diisi.

Setelah konten asli masuk, ulangi pemeriksaan panjang nama/judul ID/EN, rasio foto, alt, tautan eksternal, dan performa media sebenarnya. Pengujian saat ini memakai Chrome; Safari/Firefox dan perangkat fisik belum diuji. Publikasi Vercel belum dilakukan. Panduan pengisian dan deployment ada di `README-WEBSITE.md`.
