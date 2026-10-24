# Karakter IT dan fotografi

Lima pose dari satu karakter fiktif untuk portofolio kreatif. Gaya ilustrasi editorial dengan garis gelap, tekstur cetak ringan, overshirt oranye, kacamata bulat, laptop, dan kamera. Karakter bukan representasi wajah pemilik website.

## Aset

Seluruh gambar berupa PNG RGBA berukuran **1254 × 1254 piksel** dengan latar transparan. Transparansi telah diperiksa pada berkas hasil. Gambar disimpan terpisah agar dapat dipakai sebagai keadaan karakter di berbagai bagian website.

| File | Pose | Penggunaan yang disarankan |
|---|---|---|
| `01-hello.png` | Menyapa | Pembuka, profil, sapaan |
| `02-coding.png` | Menggunakan laptop | Proyek web/mobile, skill, proses IT |
| `03-shooting.png` | Memotret | Pengantar dan galeri fotografi |
| `04-reviewing.png` | Mengecek kamera | Detail foto, cerita di balik karya |
| `05-success.png` | Merayakan hasil | Proyek selesai, konfirmasi salin email |

## Pemakaian interaktif

- Tampilkan pose menyapa ketika membuka beranda, lalu ganti ke pose ngoding ketika bagian proyek IT aktif.
- Ketika membuka fotografi, ganti ke pose memotret. Gunakan pose mengecek kamera untuk bagian cerita atau detail foto.
- Pose merayakan dapat muncul sebentar setelah aksi yang berhasil, misalnya menyalin email. Jangan menggunakannya untuk mengklaim pesan terkirim bila tidak ada proses pengiriman.
- Pakai wadah dengan rasio 1:1 dan ukuran tetap, `object-fit: contain`, serta titik transformasi tengah bawah. Ini menjaga tata letak tetap stabil saat pose diganti.
- Muat pose berikutnya sebelum transisi untuk menghindari gambar kosong. Muat bertahap sesuai bagian halaman agar tidak mengunduh semua aset di awal.
- Ukuran tampilan awal yang disarankan: sekitar 180 px di HP atau 300 px di desktop, lalu sesuaikan dengan komposisi halaman.
- Untuk pergantian, gunakan crossfade singkat sekitar 180–220 ms. Gerak naik/turun ringan pada wadah dapat digunakan seperlunya. Pada mode gerak minimal, ganti pose langsung.
- Aset ini merupakan **pose statis**, bukan GIF, animasi frame-by-frame, atau karakter dengan sendi terpisah. Animasi melambaikan tangan secara terpisah memerlukan aset tambahan. Pergantian pose paling cocok memakai crossfade, bukan morph antaranggota tubuh.
- Pose memiliki komposisi yang serupa tetapi bukan registrasi animasi dengan posisi anggota tubuh yang persis sama.

## Aksesibilitas

Jika karakter hanya dekorasi, gunakan alt kosong dan jangan jadikan gambar fokus keyboard. Jika gambar menyampaikan informasi, gunakan deskripsi dari `manifest.json` yang tersedia dalam Bahasa Indonesia dan Inggris. Setiap aksi harus tetap memiliki label teks serta bisa dijalankan dengan keyboard dan sentuhan.

## Berkas pendukung

- `manifest.json`: daftar keadaan, nama file, ukuran, dan deskripsi ID/EN.
- `prompts.txt`: prompt lengkap kelima pose serta metode pembuatan.

Dibuat memakai alat bawaan **image_gen**. Pose menyapa menjadi acuan visual untuk empat pose lain agar identitas dan gaya konsisten. Aset tidak diubah melalui penghapusan latar manual; alpha keluaran dipertahankan.
