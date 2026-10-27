# Arsip Cahaya — website fotografi

Website fotografi terpisah dari portofolio. Konsepnya mengikuti proses memotret:

- **Jemuran foto 3D (beranda).** Tali dibentangkan di ruang 3D, dari belakang ruangan (kiri atas) ke arah pengunjung (kanan bawah), dan melengkung karena beban. Cetakan dijepit, meluncur pelan sambil berayun dan berputar sedikit tertiup angin. Yang jauh terlihat dari samping dan kecil, yang dekat membesar. Semua dengan CSS 3D (`perspective`, `preserve-3d`), tanpa WebGL. Sudut, kedalaman dan panjang tali diatur lewat variabel `--angle`, `--yaw`, `--depth`, `--x0` dan `--span` pada `.line` di `src/app/globals.css`. Foto yang muncul berikutnya dipilih acak. Cetakan masih pucat saat masuk ke tali, lalu "tercuci" sampai warnanya penuh. Hover atau fokus keyboard menahan jemuran, dan tombol **Jeda jemuran** menghentikannya.
- **Lembar kontak.** Setiap seri adalah satu rol film: lubang sprocket, kode tepi (`KODAK 400TX ▸ 1A`), nomor frame, lingkaran spidol merah untuk foto pilihan, dan coretan untuk foto yang gagal. Strip film "keluar dari sarungnya" saat discroll (Chrome dan Safari 26+; browser lain langsung tampil utuh).
- **Efek cuci foto.** Setiap foto di lembar kontak muncul dari kertas pucat ke warna penuh saat file-nya selesai dimuat.
- **Jendela bidik (halaman foto).** Siku bingkai, kotak fokus yang berkedip, efek rana, foto yang blur lalu fokus, dan data EXIF asli. Frame di lembar kontak membesar mulus ke halaman ini lewat View Transition. Tombol ← → pindah frame, Esc kembali.

Tidak memakai GSAP, Lenis, atau library animasi lain. Semua animasi CSS, ditambah sedikit JavaScript untuk mengganti foto di jemuran dan tombol keyboard. Pengaturan "kurangi gerakan" di OS/browser mematikan semua animasi; jemuran tampil diam dengan foto berjajar.

## Menjalankan

Dari folder utama repositori:

```sh
npm ci
npm run dev:photo
```

Buka **http://127.0.0.1:3002/**. Perintah lain dijalankan dari folder `apps/photography`:

```sh
npm run typecheck
npm run lint
npm run build
npm run start      # server produksi di port 3002
npm run test:e2e   # dengan server berjalan
```

## Menambah foto

1. Taruh file JPEG di `public/photos/<id-rol>/`, misalnya `public/photos/jogja-malam/01.jpg`. Ukuran sisi panjang sekitar 2000–2500 px sudah cukup; `next/image` membuat versi kecil otomatis.
2. Tambahkan rol di `content/rolls.json`:

```json
{
  "id": "jogja-malam",
  "title": "Jogja malam hari",
  "place": "Yogyakarta",
  "year": 2026,
  "stock": "CINESTILL 800T",
  "frames": [
    { "file": "jogja-malam/01.jpg", "caption": "Angkringan terakhir", "mark": "keep" },
    { "file": "jogja-malam/02.jpg", "caption": "Lampu becak" }
  ]
}
```

- `mark`: `"keep"` untuk foto pilihan (dilingkari), `"reject"` untuk dicoret, atau dihapus saja.
- `stock`: teks tepi film. Untuk foto digital boleh diisi nama kamera atau seri.
- Data kamera (kamera, lensa, ƒ, shutter, ISO, focal length, waktu) **dibaca otomatis dari EXIF file**. Blok `"exif"` di JSON hanya dipakai kalau datanya tidak ada di file, misalnya karena foto sudah diekspor tanpa metadata.
- Hapus rol contoh (`"sample": true`) dan foldernya di `public/photos/` setelah foto asli masuk. Foto contoh dibuat oleh `npm run samples` dan berlabel "Contoh".

`npm run dev` dan `npm run build` menjalankan `scripts/build-catalog.ts` lebih dulu: skrip ini memeriksa isi JSON, memastikan setiap file ada, membaca EXIF, dan membuat placeholder blur kecil ke `src/generated/catalog.json` (tidak di-commit).

Ubah nama, judul, kalimat pembuka, dan alamat portofolio di bagian `site` pada `content/rolls.json`.

## Deployment di Vercel

Buat project Vercel baru dari repositori yang sama, lalu isi **Root Directory** dengan `apps/photography`. Preset: Next.js. Install command: `npm ci`. Build command biarkan `npm run build`. Hubungkan ke domain atau subdomain sendiri, misalnya `foto.namakamu.com`, lalu isi `site.portfolioUrl` dengan alamat portofolio.

## Bobot

Diukur dari build produksi lokal di Chromium (gzip): beranda memuat ~150 KB JavaScript (hampir semuanya runtime React/Next.js), ~5 KB CSS, dan ~103 KB font (Archivo variabel + IBM Plex Mono). Sebagai perbandingan, beranda portofolio memuat ~228 KB JavaScript.
