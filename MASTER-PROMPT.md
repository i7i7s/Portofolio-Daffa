# Master prompt — Bangun portofolio kreatif

Salin isi di bawah garis pemisah ke agen coding, lalu berikan akses ke seluruh folder paket yang sudah diekstrak. Lampirkan PRD dan gambar referensi bila agen tersebut tidak dapat membaca folder lokal.

---

Bangun website portofolio kreatif saya sampai dapat dijalankan dan ditinjau secara lokal. Gunakan PRD serta aset dalam paket ini sebagai acuan. Kerjakan implementasi, bukan hanya penjelasan, wireframe, atau rencana.

## 1. Baca bahan dan mulai bekerja

Bahan utama yang tersedia:

- `PRD-Portofolio-Kreatif.md`: PRD versi 1.1, termasuk halaman, tech stack, full animasi, dan 20 kriteria penerimaan.
- `karakter-it-fotografi/`: lima PNG karakter transparan, `manifest.json`, panduan pemakaian, dan prompt pembuatan aset.
- `referensi/desain-editorial-potozon.png`: gambar referensi visual dari saya.
- `README-MULAI-DI-SINI.md`: susunan dan cara menggunakan paket.

Baca PRD dan panduan aset. Lihat gambar referensi serta PNG karakter sebelum menentukan komposisi. Jika lokasi bahan berbeda, temukan berdasarkan nama file tersebut. Periksa struktur workspace dan instruksi proyek yang berlaku. Pertahankan pekerjaan yang sudah ada; integrasikan dengan proyek jika tersedia, atau buat proyek baru jika belum ada.

PRD menjadi acuan detail. Instruksi saya yang lebih baru menjadi acuan bila ada perubahan. Putuskan detail rutin secara mandiri, catat asumsi penting, dan lanjutkan tanpa meminta saya mengisi konten pribadi terlebih dahulu. Laporkan kendala yang benar-benar menghalangi pekerjaan; jangan menyatakan fitur selesai sebelum diperiksa.

## 2. Identitas dan sasaran

Saya mahasiswa Sistem Informasi dengan minat web development, UI/UX, analisis data, dan aplikasi mobile. Fotografi merupakan hobi pendamping. Isi website berfokus pada karya IT, sementara tampilan membawa karakter portofolio kreatif.

Pengunjung harus cepat memahami siapa saya, melihat karya dan prosesnya, menjelajahi fotografi, serta menemukan kontak. Karya fotografi memiliki galeri tersendiri dan cuplikan kecil di beranda.

Nama, bio, proyek, foto pribadi, pengalaman, kontak, CV, dan tautan sosial akan saya isi belakangan. Buat semuanya mudah diedit dari file. Gunakan `[Nama Kamu]` untuk identitas awal; jangan mengambil identitas pribadi dari nama akun sistem atau path folder.

## 3. Arah visual

Buat desain editorial modern dengan elemen playful. Gunakan struktur kolom, garis pemisah, hierarki judul, dan penomoran karya yang mengingatkan pada koran, lalu padukan dengan tipografi sans-serif besar, ruang kosong luas, kolase gambar agak miring, serta aksen label seperti pada referensi Potozon.

Palet:

- Latar utama `#F7F6F2` dan permukaan putih `#FFFFFF`.
- Teks utama `#171717`, teks sekunder `#57534E`.
- Aksen oranye `#F15A24`.
- Garis dekoratif `#D8D5CE`.

Gunakan oranye secara terarah. Warna tambahan boleh berasal dari media karya dan foto. Teks, fokus, dan kontrol harus mempunyai kontras yang cukup.

Pembuka menampilkan nama besar, identitas singkat, bidang minat, akses ke karya, dan komposisi maskot/visual proyek. Sesuaikan panjang judul agar tetap muat dalam ID/EN. Susunan tiap bagian mempunyai ritme berbeda, misalnya satu proyek besar diikuti dua proyek lebih kecil dan metadata di kolom samping. Teks panjang dan kontrol tetap tegak serta mudah dibaca.

Gunakan referensi untuk karakter komposisi; buat susunan asli yang cocok dengan isi website. Screenshot bukan aset fotografi saya. Jangan memasangnya sebagai sampul proyek atau mengklaim gambar di dalam screenshot sebagai karya saya.

## 4. Stack yang harus dipakai

- Next.js App Router + React + TypeScript.
- Tailwind CSS dan CSS variables untuk tema serta pengaturan visual.
- GSAP sebagai mesin animasi utama, dengan ScrollTrigger, SplitText, Flip, dan `@gsap/react`.
- Lenis untuk scroll halus pada desktop; scroll native pada perangkat sentuh dan gerak minimal.
- next-intl untuk ID/EN dengan alamat `/id/` dan `/en/`.
- JSON untuk profil, metadata proyek, galeri, dan pesan antarmuka.
- MDX lokal per proyek/per bahasa untuk cerita proyek.
- Zod untuk validasi konten sebelum build.
- `next/image` dan `next/font` untuk media serta font.
- Playwright untuk pemeriksaan alur penting.
- Vercel sebagai target hosting yang didokumentasikan.

Periksa dokumentasi resmi untuk setup dan kompatibilitas versi yang sedang digunakan. Gunakan rilis stabil yang kompatibel, simpan lockfile, dan hindari ketergantungan pada API eksperimental. GSAP mengelola koreografi; CSS cukup untuk perubahan warna dan keadaan fokus. Jangan menambah mesin animasi kedua tanpa kebutuhan khusus yang dijelaskan.

Tidak diperlukan admin panel, database, login, atau backend formulir kontak. Hasil pekerjaan adalah implementasi lokal yang siap ditinjau, beserta petunjuk deployment. Publikasi dilakukan bila saya memintanya.

## 5. Halaman dan isi

Implementasikan:

1. **Beranda:** navigasi, pembuka, karya pilihan, tentang, bidang/kemampuan, cuplikan fotografi, kontak, dan footer.
2. **Semua proyek:** filter Semua, Web, UI/UX, Data, Mobile; simpan filter di query alamat dan pulihkan ketika kembali dari detail.
3. **Detail proyek:** masalah, peran saya, proses, solusi/hasil, media, dan tautan yang tersedia. Satu proyek boleh mempunyai beberapa kategori.
4. **Fotografi:** galeri asimetris dan tampilan foto besar dengan kontrol berikutnya/sebelumnya, tutup, keyboard, serta pengelolaan fokus.
5. **404 dan keadaan kosong:** sesuai bahasa aktif, dengan jalur navigasi yang jelas.

Kontak menggunakan email langsung dan Salin email dengan konfirmasi. Sembunyikan tombol CV, demo, repositori, sosial, dan kontak yang belum mempunyai tujuan valid. Semua tindakan yang terlihat harus berfungsi.

Semua halaman, metadata, alt, label aksesibilitas, pesan kosong, dan pesan kesalahan mempunyai ID/EN. Pergantian bahasa mempertahankan proyek/kategori/bagian yang relevan dan tidak mengulang animasi pembuka. `/` mengarah ke `/id/`.

## 6. Full animasi adalah syarat utama

Rancang koreografi untuk keseluruhan perjalanan pengunjung:

- **Pembuka:** judul muncul per baris, kolase masuk bergantian, aksen label muncul, maskot menyapa. Total gerak awal sekitar 900 ms dan CTA tetap bisa diakses.
- **Bidang minat:** satu bingkai berubah menjadi ilustrasi jendela web, wireframe, grafik data, atau layar ponsel saat bidang dipilih.
- **Scroll:** judul, garis editorial, dan media terungkap sesuai isi bagiannya. Gunakan parallax tipis pada beberapa media desktop dan gerak lebih pendek di HP.
- **Kartu proyek:** kemiringan melurus, gambar sedikit membesar, dan judul/penanda merespons hover maupun fokus.
- **Filter:** GSAP Flip menggerakkan perubahan susunan entri.
- **Antarhalaman:** lapisan oranye/ivory menyapu singkat, lalu isi tujuan masuk. Total gerak sekitar 400–650 ms di luar waktu muat sebenarnya.
- **Cerita proyek:** judul bagian, gambar, diagram, dan caption terungkap mengikuti posisi baca.
- **Galeri:** foto terbuka dari thumbnail, pergantian foto mendapat transisi singkat, dan fokus tetap benar.
- **Menu:** panel dan tautan masuk berurutan; penanda navigasi mengikuti bagian aktif.
- **Bahasa dan kontak:** transisi singkat, respons tombol, serta konfirmasi salin email.
- **Maskot:** ganti lima pose sesuai bagian dan aksi, ditambah gerakan wadah yang halus.

Pakai rincian durasi dan perilaku dari bagian 8 PRD. Tiap bagian utama perlu mempunyai gerakan yang sengaja dirancang; jangan menyelesaikan kebutuhan ini hanya dengan satu efek muncul yang diulang ke semua elemen. Teks berhenti bergerak ketika dibaca. Scroll tetap berada dalam kendali pengunjung, dan setiap input baru dapat membatalkan atau mengarahkan ulang gerakan yang sedang berjalan.

Implementasikan preferensi gerak minimal sejak awal. Mode tersebut memakai keadaan akhir yang sama dengan navigasi serta isi lengkap, tanpa Lenis, parallax, dan perpindahan dekoratif.

## 7. Pakai lima aset karakter yang tersedia

Salin aset ke `public/images/character/` dan gunakan metadata pada manifest:

- `01-hello.png`: pembuka/profil.
- `02-coding.png`: karya IT atau kemampuan aktif.
- `03-shooting.png`: fotografi aktif.
- `04-reviewing.png`: foto terbuka pada tampilan besar.
- `05-success.png`: aksi salin email berhasil; kemudian kembali ke pose sebelumnya.

Gunakan wadah persegi tetap, `object-fit: contain`, dan titik transformasi tengah bawah. Muat pose berikutnya sebelum transisi; pertahankan pose lama sampai siap. Pakai crossfade sekitar 180–220 ms dan hindari lompatan tata letak. Pada HP, maskot berada dalam alur halaman dan tidak menutupi isi. Jika dekoratif, gunakan alt kosong; bila informatif, gunakan deskripsi bahasa aktif.

Kelima aset adalah gambar statis. Gerakkan seluruh gambar serta pergantian pose yang tersedia. Jangan mengklaim adanya animasi sendi, tangan melambai terpisah, kedipan mata, atau karakter berjalan tanpa membuat aset tambahan. Pertahankan wajah, pakaian, warna, dan transparansi yang sudah dibuat.

## 8. Aturan integrasi dan ketahanan

- Pisahkan komponen konten server dan komponen interaktif client sejauh sesuai kebutuhan.
- Letakkan pengaturan durasi, easing, jarak, dan intensitas dalam satu konfigurasi gerak bersama.
- Satu elemen/properti hanya dikendalikan satu sistem animasi. Pisahkan wadah gerak scroll dari isi yang bereaksi terhadap pointer.
- Gunakan scope dan cleanup GSAP; catat animasi yang dibuat di event handler. Bersihkan listener, trigger, dan ticker saat navigasi, pergantian bahasa, serta perubahan susunan.
- Buat satu integrasi Lenis/ScrollTrigger dan satu jalur pembaruan. Perbarui pengukuran setelah font, gambar, filter, atau bahasa mengubah tata letak.
- Pastikan SplitText mengikuti perubahan baris dan tidak menggandakan pembungkus teks.
- Lapisan transisi halaman harus pulih ketika navigasi gagal, dibatalkan, atau target tidak tersedia. Back/forward, tautan jangkar, tautan eksternal, serta buka tab baru bekerja wajar.
- Dialog galeri/menu mengelola fokus dan scroll latar, lalu memulihkannya ketika ditutup.
- Hentikan kerja dekoratif ketika elemen di luar layar atau tab tidak aktif. Jangan memuat kelima gambar karakter resolusi penuh sekaligus bila tidak dibutuhkan.
- Isi utama tetap tersedia pada HTML awal; jangan menggantungkan keterbacaan pada keberhasilan animasi.

## 9. Konten dan pengalaman mengedit

Gunakan struktur konten dari bagian 16 PRD: `content/profile.json`, `content/projects.json`, `content/projects/[slug]/id.mdx`, `en.mdx`, `content/photography.json`, serta `messages/id.json` dan `en.json`.

Sediakan mode pratinjau lokal dengan entri contoh yang jelas berlabel contoh. Simpan contoh sebagai draft dan pisahkan dari keluaran publik. Jangan mengarang klien, pengalaman, testimoni, penghargaan, angka dampak, atau kemampuan saya. Pratinjau tetap bisa dijalankan sebelum identitas dan kontak asli diisi; kelengkapan publik diperiksa secara terpisah sebelum rilis.

Validasi slug unik, kategori, aset, status, kolom wajib, dan kelengkapan dua bahasa. Jelaskan cara menambah satu proyek dan satu foto, mengganti identitas, memperbarui tautan, serta membangun dan menerbitkan ulang website.

## 10. Pemeriksaan dan hasil akhir

Jalankan pemeriksaan tipe, lint, dan build. Periksa alur utama menggunakan Playwright serta tinjauan visual hasil berjalan:

- ID/EN pada beranda, proyek, detail, dan fotografi.
- Filter, URL, kembali dari detail, back/forward, dan perpindahan halaman.
- Galeri melalui sentuhan, keyboard, Escape, dan pemulihan fokus.
- Lima keadaan maskot dan keberhasilan penyalinan email.
- Desktop, HP, mode gerak minimal, dan navigasi berulang tanpa trigger ganda.
- Tidak ada gambar hilang, teks terpotong, tautan buntu, scroll horizontal tak disengaja, atau dekorasi yang menutupi kontrol.
- Keterbacaan, kontras, fokus, dan pembesaran 200% pada ukuran layar representatif di PRD.

Ukur performa awal pada kondisi lab mobile dan catat hasil serta batasannya. Ikuti target Core Web Vitals di PRD tanpa mengklaim metrik lapangan sebelum tersedia data lapangan.

Perbaiki masalah yang ditemukan, lalu serahkan:

1. Sumber website yang dapat dijalankan beserta dependensi dan lockfile.
2. Seluruh aset karakter yang telah diintegrasikan.
3. Panduan menjalankan, mengisi konten, dan deployment.
4. Ringkasan fitur selesai, pemeriksaan yang benar-benar dijalankan, hasilnya, dan pekerjaan yang masih membutuhkan konten saya.
5. Pratinjau atau tangkapan layar yang memperlihatkan hasil desktop dan HP, bila lingkungan mendukung.

Mulai dari pembuka dan satu transisi halaman untuk memastikan karakter visual serta fondasi animasi bekerja, lalu selesaikan seluruh cakupan wajib. Jangan berhenti setelah membuat landing page awal atau hanya menyiapkan kerangka.
