# PRD — Website portofolio kreatif

Versi: 1.1  
Tanggal: 19 Oktober 2026  
Status: Siap menjadi acuan desain dan pengembangan; konten pribadi menyusul  
Bahasa produk: Indonesia dan Inggris

## 1. Ringkasan produk

Website portofolio pribadi mahasiswa Sistem Informasi dengan tampilan editorial modern, tipografi besar, kolase visual, dan animasi di seluruh pengalaman website. Karya web, UI/UX, analisis data, dan aplikasi mobile menjadi isi utama. Fotografi hadir sebagai hobi dan bagian personal yang melengkapi profil.

Pengunjung harus bisa mengenali pemilik, memahami bidang minatnya, menilai karya, dan menemukan kontak dengan mudah. Karakter kreatif terlihat dari komposisi dan interaksi di seluruh website.

Konten akan diisi sendiri oleh pemilik melalui file terstruktur. Rilis awal tidak memerlukan admin panel, akun pengguna, atau database.

Fondasi implementasi ditetapkan: Next.js App Router, React, TypeScript, dan Tailwind CSS. GSAP beserta ScrollTrigger, SplitText, dan Flip mengatur animasi; Lenis menangani scroll halus pada desktop. Bahasa menggunakan next-intl. Detail pembagian tanggung jawab dan konten berada pada bagian 16.

## 2. Keputusan dan asumsi

| Aspek | Keputusan |
|---|---|
| Identitas utama | Mahasiswa Sistem Informasi dengan minat web, UI/UX, analisis data, dan aplikasi mobile |
| Fotografi | Hobi pendamping; cuplikan di beranda dan galeri terpisah |
| Gaya | Editorial modern dengan elemen playful, terinspirasi struktur koran dan referensi gambar pengguna |
| Tema | Terang, putih hangat, teks hitam, aksen oranye |
| Animasi | Full animasi: pembuka, pergantian bagian dan halaman, navigasi, proyek, galeri, kontak, serta maskot; disesuaikan untuk desktop dan HP |
| Tech stack | Next.js App Router + React + TypeScript + Tailwind CSS |
| Mesin gerak | GSAP + ScrollTrigger + SplitText + Flip; integrasi React melalui `@gsap/react` |
| Scroll | Lenis pada desktop; scroll native pada perangkat sentuh dan mode gerak minimal |
| Maskot | Lima PNG transparan dengan pergantian pose dan gerakan wadah gambar |
| Bahasa | ID dan EN; bahasa awal ID |
| Infrastruktur | Vercel sebagai target hosting; Git sebagai pengelolaan sumber |
| Pengelolaan | Edit file konten, tambah aset gambar, lalu bangun dan terbitkan ulang website |
| Nama dan identitas | Placeholder `[Nama Kamu]` sampai pemilik mengisinya |
| Pembuka | Nama besar dan komposisi karya; foto diri bersifat opsional |

Warna oranye, bentuk pembuka, dan bahasa awal merupakan keputusan desain yang diambil berdasarkan izin pengguna untuk menentukan sisanya. Semua dapat diganti melalui pengaturan konten atau tema. Nama, pengalaman, kemampuan, jumlah karya, dan pencapaian tidak boleh dikarang.

## 3. Tujuan dan sasaran pengguna

### Tujuan

1. Membentuk identitas pribadi yang kreatif dengan fokus IT yang jelas.
2. Mempermudah penilaian karya lintas bidang melalui contoh dan penjelasan proses.
3. Menampilkan fotografi tanpa menggeser karya IT dari posisi utama.
4. Menyediakan pengalaman yang lengkap dalam dua bahasa.
5. Memungkinkan pemilik memperbarui isi tanpa mengubah komponen tampilan.

### Sasaran pengguna

Asumsi perencanaan: recruiter, calon kolaborator, calon klien, serta orang yang ingin melihat karya pemilik. Pengalaman browsing harus tetap mudah bagi pengunjung yang hanya ingin melihat proyek atau mencari kontak dengan cepat.

### Ukuran keberhasilan

- Dalam sesi uji singkat, pengunjung dapat menyebutkan identitas utama dan menemukan proyek serta kontak tanpa penjelasan tambahan.
- Semua fungsi utama tersedia pada HP, mouse, dan keyboard.
- Tidak ada teks antarmuka yang tertinggal dalam bahasa lain setelah pergantian bahasa.
- Pemilik dapat menambah satu proyek dan satu foto melalui file konten dengan mengikuti panduan.
- Identitas, tautan, dan aset yang belum lengkap tidak menghasilkan klaim palsu, tombol kosong, atau halaman rusak.

Ukuran ini adalah target pengujian, bukan hasil yang sudah dicapai. Statistik kunjungan dan konversi kontak dapat ditambahkan kemudian; pelacakan pengunjung bukan syarat rilis awal.

## 4. Ruang lingkup

### P0 — Wajib untuk rilis awal

- Beranda dengan perkenalan, karya pilihan, tentang, bidang minat, cuplikan fotografi, dan kontak.
- Halaman indeks proyek dengan filter kategori.
- Halaman detail proyek dengan cerita proses dan hasil.
- Halaman galeri fotografi dengan pembuka foto ukuran besar.
- Seluruh halaman dan navigasi dalam ID/EN.
- Desain responsif, navigasi keyboard, dan dukungan preferensi gerak minimal.
- Sistem visual editorial dan seluruh cakupan animasi wajib pada bagian 8, termasuk transisi halaman dan maskot.
- Integrasi lima aset karakter IT dan fotografi yang sudah dibuat.
- Implementasi stack dan aturan integrasi pada bagian 16.
- File konten terstruktur, validasi konten, dan panduan pengisian.
- Metadata dasar, halaman 404, serta optimasi gambar.

### P1 — Setelah rilis awal stabil

- Filter album atau tema fotografi ketika jumlah foto membutuhkannya.
- Video demonstrasi proyek dengan kontrol pemutaran.
- Pilihan intensitas animasi melalui pengaturan di website.
- Statistik kunjungan bila pemilik membutuhkannya.
- Transisi sampul yang menyambung langsung dari kartu ke halaman detail jika prototipe lintas halaman sudah stabil.

### Di luar ruang lingkup rilis awal

Admin panel, CMS, login, database, blog, toko atau pemesanan jasa foto, formulir kontak dengan backend, tema gelap, pengalaman 3D penuh, serta animasi karakter dengan tulang/sendi terpisah. Stack pada bagian 16 merupakan acuan pembangunan rilis awal.

## 5. Struktur informasi dan navigasi

| Halaman | Contoh alamat | Tujuan |
|---|---|---|
| Beranda | `/id/`, `/en/` | Mengenalkan pemilik dan menampilkan karya pilihan |
| Semua proyek | `/id/projects/`, `/en/projects/` | Menjelajahi seluruh karya IT |
| Detail proyek | `/id/projects/[slug]/`, `/en/projects/[slug]/` | Menjelaskan peran, proses, dan hasil |
| Fotografi | `/id/photography/`, `/en/photography/` | Menjelajahi koleksi foto |
| Halaman tidak ditemukan | Sesuai bahasa aktif | Memberi jalur kembali ke beranda |

Alamat menggunakan slug yang konsisten pada kedua bahasa. Akses `/` mengarah ke beranda ID. Profil dan kontak menjadi bagian beranda sehingga tidak memerlukan halaman tambahan pada rilis awal.

Navigasi desktop: **Karya / Work**, **Tentang / About**, **Fotografi / Photography**, **Kontak / Contact**, dan **ID / EN**. Pada HP, gunakan tombol menu dengan label yang jelas. Navigasi tetap terbaca ketika melewati bagian halaman yang ramai.

Tautan Tentang dan Kontak dari halaman lain mengarah ke bagian yang sesuai di beranda dengan bahasa aktif. Tombol kembali menggunakan perilaku browser yang wajar.

## 6. Kebutuhan setiap halaman

### 6.1 Beranda

Urutan konten:

1. **Navigasi.** Nama atau wordmark sederhana, menu, dan pengalih bahasa.
2. **Pembuka.** Nama berukuran besar, deskripsi singkat sebagai mahasiswa Sistem Informasi, empat bidang minat, tombol Lihat karya, dan komposisi visual proyek.
3. **Karya pilihan.** Maksimal empat proyek yang dipilih pemilik, disusun dengan variasi skala dan posisi. Tidak wajib mengisi satu proyek untuk setiap bidang.
4. **Tentang.** Profil singkat, foto opsional, minat, dan informasi pendidikan yang benar-benar diberikan pemilik.
5. **Bidang dan kemampuan.** Web, UI/UX, Data, Mobile, beserta alat atau kemampuan yang diisi pemilik. Tidak memakai persentase kemampuan atau label ahli yang tidak didukung bukti.
6. **Fotografi.** Maksimal empat foto pilihan dengan pengantar singkat dan tautan ke galeri.
7. **Kontak dan footer.** Ajakan menghubungi, email, tautan profesional atau sosial yang tersedia, dan CV opsional.

Identitas dan tombol Lihat karya harus tersedia tanpa menunggu animasi selesai. Fotografi menjadi bagian pendamping setelah karya IT dan profil.

### 6.2 Indeks proyek

- Filter: Semua, Web, UI/UX, Data, dan Mobile. Nama antarmuka diterjemahkan pada EN.
- Satu proyek boleh memiliki beberapa kategori.
- Setiap entri berisi sampul, judul, ringkasan singkat, kategori, dan tahun bila tersedia.
- Filter tidak memuat ulang seluruh halaman; keadaan aktif terlihat dan dapat dibaca teknologi bantu.
- Filter disimpan dalam alamat, misalnya `?category=data`, agar dapat dibagikan dan dipulihkan ketika kembali dari detail proyek.
- Kategori tanpa karya tetap dapat dipilih dan menampilkan pesan kosong yang sesuai bahasa aktif.
- Semua gambar sampul dan judul mengarah ke halaman detail yang sama.

### 6.3 Detail proyek

Susunan dasar: judul dan ringkasan → sampul → konteks masalah → peran dan kontribusi → proses → solusi atau hasil → media pendukung → tautan terkait → kembali ke semua proyek.

Informasi proyek mencakup kategori, tahun opsional, alat, jenis proyek pribadi/kuliah/tim bila diisi, serta kontribusi pemilik. Pada proyek tim, peran pemilik harus jelas.

Penekanan isi dapat berbeda:

| Kategori | Isi yang perlu didukung |
|---|---|
| Web | Masalah pengguna, fitur, keputusan implementasi, tangkapan layar, tautan demo atau kode |
| UI/UX | Masalah, riset bila dilakukan, alur pengguna, wireframe, keputusan desain, prototipe |
| Data | Pertanyaan analisis, sumber dan batasan data, proses, temuan, visualisasi |
| Mobile | Kebutuhan pengguna, alur layar, fitur, platform, demonstrasi atau tangkapan layar |

Hasil boleh bersifat kualitatif. Angka dampak hanya ditampilkan ketika diberikan pemilik dan memiliki dasar. Bagian tanpa isi disembunyikan secara rapi. Demo, repositori, prototipe, dan unduhan hanya tampil jika tautannya tersedia.

### 6.4 Fotografi

- Pembuka singkat yang menempatkan fotografi sebagai minat personal.
- Galeri asimetris dengan proporsi gambar yang menghormati orientasi foto.
- Thumbnail dapat dipotong secukupnya; tampilan besar harus menampilkan komposisi foto secara utuh.
- Setiap foto mendukung judul/caption, deskripsi alternatif, album, lokasi umum, dan tahun; hanya deskripsi alternatif serta aset gambar yang wajib untuk foto publik.
- Tampilan besar mendukung foto sebelumnya/berikutnya, tombol tutup, Escape, dan panah keyboard. Kontrol sentuh tersedia tanpa mengandalkan hover.
- Fokus berada di dalam dialog ketika terbuka dan kembali ke thumbnail asal setelah ditutup.
- Gambar resolusi besar dimuat saat diperlukan. Ukuran thumbnail sudah diketahui agar susunan halaman tidak melompat.

### 6.5 Kontak

Gunakan tautan email langsung dan tombol Salin email. Penyalinan menampilkan konfirmasi singkat dalam bahasa aktif, diumumkan kepada teknologi bantu. Jika penyalinan gagal, alamat tetap bisa dipilih atau dibuka melalui tautan email.

Tidak ada formulir yang tampak mengirim pesan tetapi sebenarnya tidak berfungsi. Tautan media sosial dan CV yang belum tersedia disembunyikan.

## 7. Arah desain visual

### Karakter

Editorial modern, ekspresif, rapi, dan personal. Adaptasi dari gambar pengguna: judul sans-serif tebal, ruang putih luas, kolase miring, aksen berbentuk label, dan beberapa elemen yang bertumpuk. Inspirasi koran diterapkan melalui kolom, garis pembatas, penomoran karya, dan susunan informasi.

Komposisi harus dibuat khusus untuk identitas dan karya pemilik. Referensi menjadi panduan karakter, bukan salinan tata letak atau aset.

### Palet awal

| Peran | Warna |
|---|---|
| Latar utama | Putih hangat `#F7F6F2` |
| Permukaan gambar atau panel | Putih `#FFFFFF` |
| Teks utama | Hitam arang `#171717` |
| Teks sekunder | Abu gelap `#57534E` |
| Aksen | Oranye `#F15A24` |
| Garis dekoratif | Abu terang `#D8D5CE` |

Oranye digunakan untuk penanda, label, dan area dekoratif terbatas. Teks di atas oranye memakai warna gelap setelah pemeriksaan kontras. Tautan dalam paragraf tetap jelas melalui garis bawah atau bentuk lain, tidak bergantung pada warna. Garis dekoratif bukan satu-satunya penanda kontrol.

### Tipografi dan komposisi

- Judul memakai sans-serif display tebal; isi memakai sans-serif yang nyaman dibaca. Maksimal dua keluarga font dengan fallback sistem.
- Metadata kecil dapat memakai gaya monospaced dari sistem jika sesuai.
- Judul pembuka desktop sekitar 88–160 px; HP sekitar 44–72 px, disesuaikan panjang nama serta bahasa tanpa terpotong.
- Teks isi umumnya minimal 16 px; label ringkas minimal 14 px.
- Grid desktop 12 kolom, tablet 6, HP 4 sebagai panduan internal tata letak.
- Ruang tepi HP minimal 20 px; jarak antarbagiannya cukup untuk membedakan cerita.
- Gambar dapat dimiringkan sekitar 2–5 derajat. Teks isi dan kontrol tetap tegak.
- Setiap bagian mempunyai satu fokus visual utama. Tumpang tindih dekoratif tidak menutupi teks, tombol, atau bagian penting gambar.

### Identitas visual yang menghubungkan bidang

Gunakan motif bingkai: bentuk awal menyerupai jendela web, lalu dapat berubah menjadi wireframe, grafik data, dan layar ponsel ketika bidang dipilih. Pada cuplikan fotografi, motif menjadi bingkai foto.

Motif ini merupakan ilustrasi dekoratif. Ia tidak menyiratkan bahwa gambar contoh adalah karya asli pemilik. Versi awal dapat memakai gambar abstrak berlabel contoh sampai aset pribadi tersedia.

### Maskot IT dan fotografi

Gunakan karakter yang sudah dibuat: overshirt oranye, kacamata bulat, laptop, dan kamera. Aset sumber terdapat dalam folder `karakter-it-fotografi/` bersama PRD ini. Kelimanya PNG transparan berukuran 1254 × 1254 px; daftar keadaan dan deskripsi ID/EN tersedia pada `manifest.json`.

| Pose | Pemicu utama |
|---|---|
| `01-hello.png` | Pembuka dan profil |
| `02-coding.png` | Bagian karya IT atau kemampuan aktif |
| `03-shooting.png` | Pengantar atau halaman fotografi aktif |
| `04-reviewing.png` | Foto terbuka pada tampilan besar |
| `05-success.png` | Aksi salin email berhasil; tampil singkat lalu kembali |

Maskot mendukung cerita halaman dan tidak menutupi karya atau kontrol. Pada HP, tempatkan dalam alur halaman. Bila gambar berikutnya belum siap, pertahankan pose lama sampai aset siap. Semua keadaan ditempatkan dalam wadah dengan dimensi tetap agar pergantian tidak menggeser isi.

## 8. Sistem animasi

### Arti full animasi untuk produk ini

Setiap bagian utama mempunyai gerakan yang dirancang khusus, dan setiap tindakan utama mendapat umpan balik yang sesuai. Pengalaman mencakup animasi pembuka, gerak mengikuti scroll, transisi halaman, interaksi proyek, galeri, navigasi, serta maskot. Penerimaan animasi mencakup keseluruhan alur ini.

Gerakan dikoordinasikan per bagian agar perhatian mengikuti isi. Teks panjang berhenti bergerak ketika dibaca. Konten penting tetap dapat diakses ketika animasi dilewati atau JavaScript gagal.

### Cakupan wajib rilis awal

| Area | Perilaku | Penggerak | Durasi awal / penyesuaian |
|---|---|---|---|
| Pembuka | Judul terbuka per baris, kolase masuk bergantian, stiker muncul, maskot menyapa | GSAP timeline + SplitText | Total maksimal 900 ms; langsung terlihat pada gerak minimal |
| Bidang minat | Bingkai berubah menjadi ilustrasi web, UI, grafik data, atau ponsel saat dipilih | GSAP + SVG inline | 350–550 ms; ketuk di HP |
| Antarbagian | Judul, garis editorial, dan media terungkap dengan urutan berbeda sesuai bagian | ScrollTrigger | 350–500 ms atau mengikuti rentang scroll |
| Karya pilihan | Kolase bergeser tipis saat scroll; kemiringan kartu melurus ketika disorot atau difokuskan | ScrollTrigger + GSAP | Hover/fokus 180–250 ms; HP memakai susunan dan gerak masuk tersendiri |
| Daftar proyek | Susunan entri bertransisi ketika filter berubah | GSAP Flip | 180–300 ms; keadaan filter segera diperbarui |
| Antarhalaman | Lapisan oranye/ivory menyapu singkat, lalu judul dan sampul halaman tujuan masuk | GSAP pada lapisan transisi persisten | Total gerak 400–650 ms, di luar waktu muat sebenarnya |
| Cerita proyek | Judul bagian, diagram/gambar, dan caption terungkap mengikuti posisi baca | ScrollTrigger | 300–500 ms; tidak terus bergerak saat dibaca |
| Galeri | Susunan foto terungkap bertahap, gambar membesar saat dibuka, dan berganti singkat ketika dinavigasi | GSAP | Buka/tutup 200–300 ms; foto berikutnya 120–200 ms |
| Menu dan navigasi | Panel menu membuka, tautan masuk bergantian, garis penanda mengikuti bagian aktif | GSAP + CSS | 150–350 ms; fokus dijaga |
| Bahasa | Isi tujuan muncul dengan transisi singkat; pembuka tidak diputar ulang | GSAP | 120–200 ms |
| Kontak | Ajakan kontak dan garis editorial masuk; tombol memberi respons tekan dan konfirmasi salin | GSAP + CSS | 120–250 ms |
| Maskot | Berganti di antara lima pose sesuai bagian/aksi; wadah bergerak masuk, sedikit miring, atau naik pendek | GSAP + keadaan React | Pergantian pose 180–220 ms; tidak menggeser tata letak |
| Scroll desktop | Scroll halus tersinkronisasi dengan adegan scroll | Lenis + ScrollTrigger | Tetap mengikuti input; HP memakai scroll native |

Durasi merupakan titik awal desain yang disesuaikan setelah melihat hasil berjalan. Gerakan masuk dibuat berbeda sesuai isi bagian; tidak cukup menerapkan satu efek generik ke seluruh halaman.

### Perilaku lintas perangkat dan navigasi

- Animasi pembuka dijalankan sekali per sesi kunjungan; kembali dari detail proyek tidak memutarnya lagi.
- Pergantian bahasa, filter, dan navigasi merespons input terbaru. Animasi sebelumnya dibatalkan atau diarahkan menuju keadaan baru, tanpa menumpuk antrean.
- Scroll tetap mengikuti kendali pengunjung. Tidak ada scroll yang dipaksa berhenti untuk menyelesaikan adegan. Adegan desktop boleh menggunakan sticky media, sementara isi tetap dapat dijelajahi.
- Animasi desktop disesuaikan untuk HP: rentang gerak lebih pendek, kolase dalam alur halaman, dan kontrol ketuk yang eksplisit. Cakupan setiap bagian tetap ada pada mode gerak normal.
- Transisi halaman mengikuti navigasi Next.js dan kesiapan halaman tujuan. Back/forward browser, tautan jangkar, tautan eksternal, dan buka tab baru tetap bekerja wajar. Status memuat dan kesalahan tidak ditutupi lapisan animasi yang macet.
- `prefers-reduced-motion` meniadakan Lenis, parallax, split reveal bergerak, pembesaran dekoratif, dan perubahan bentuk. Konten langsung terlihat dengan keadaan akhir yang sama.
- Tidak ada loader dekoratif dengan penundaan buatan. Isi utama dan CTA tersedia ketika pembuka berjalan.
- Efek dekoratif saat idle berhenti ketika elemen di luar layar atau tab tidak aktif. Jika gerak otomatis berlangsung lebih dari lima detik, sediakan mekanisme jeda/henti sesuai kebutuhan aksesibilitas.

### Batas aset karakter

Lima PNG yang sudah dibuat mendukung pergantian pose, crossfade, kemiringan, serta gerak seluruh gambar. Aset ini belum memiliki lapisan tangan, kepala, mata, dan kaki terpisah. Gerakan seperti melambaikan tangan secara anatomis, berkedip, berjalan, atau menekan shutter secara frame-by-frame membutuhkan pembuatan aset atau rig tambahan dan merupakan pekerjaan lanjutan. Penerimaan rilis awal menguji interaksi lima pose yang tersedia.

## 9. Dua bahasa

- Semua navigasi, tombol, filter, deskripsi, caption, pesan kosong, pesan kesalahan, label aksesibilitas, dan metadata memiliki ID/EN.
- Pengalih bahasa membuka halaman padanan dan mempertahankan proyek, kategori aktif, serta bagian halaman yang relevan.
- Bahasa mengikuti alamat halaman. Tautan yang dibagikan selalu membuka bahasa yang sama dengan alamatnya.
- Teks terjemahan disiapkan melalui file; tidak mengandalkan layanan terjemahan otomatis saat halaman dibuka.
- Nama orang, merek, alat, dan judul resmi karya boleh tetap sama.
- Nama atau judul yang lebih panjang harus tetap masuk dalam susunan halaman.
- Konten berstatus publik wajib memiliki kedua versi. Terjemahan yang belum lengkap memicu validasi dan tidak boleh diam-diam menjadi campuran bahasa pada rilis publik.
- Setiap halaman menetapkan bahasa dokumen, judul, deskripsi, dan tautan bahasa padanan dengan benar.

## 10. Pengelolaan konten

### Struktur yang dibutuhkan

| Kelompok | Data utama |
|---|---|
| Profil | Nama, bio ID/EN, bidang minat, foto opsional, pendidikan opsional, email, sosial, CV opsional |
| Proyek | ID, slug, status draft/published, kategori, urutan, featured, sampul, alt ID/EN, isi ID/EN, media, tautan opsional |
| Foto | ID, status, urutan, featured, aset, alt ID/EN, caption ID/EN opsional, album/tahun/lokasi umum opsional |
| Teks antarmuka | Seluruh label dan pesan dalam ID/EN |
| Tema | Warna aksen dan pengaturan dasar identitas visual |

File profil dan daftar karya disimpan sebagai JSON terpisah dari komponen tampilan. Cerita proyek menggunakan MDX lokal per bahasa dan proyek. Zod memvalidasi data sebelum build. Struktur folder ditetapkan pada bagian 16 dan dijelaskan kembali dalam panduan pengisian.

### Alur pemilik

1. Menambahkan gambar ke folder aset yang ditentukan.
2. Menyalin contoh entri proyek atau foto.
3. Mengisi isi ID/EN, gambar, kategori, dan tautan.
4. Meninjau tampilan lokal.
5. Mengubah status menjadi published dan menerbitkan ulang.

Panduan harus menjelaskan bahwa perubahan file lokal belum mengubah website publik sampai diterbitkan ulang.

### Konten awal dan kondisi kosong

- Template menyediakan placeholder yang jelas dan berstatus draft. Tidak boleh mencantumkan klien, penghargaan, testimoni, atau angka dampak rekaan.
- Mode pratinjau boleh menampilkan contoh untuk menilai desain. Contoh tidak tampil sebagai proyek pribadi pada versi publik.
- Galeri kosong menampilkan pesan singkat, bukan gambar stok yang dianggap karya pemilik.
- Bagian opsional tanpa isi disembunyikan. Daftar proyek dan fotografi mempunyai keadaan kosong yang disengaja.
- Publikasi final memerlukan nama, bio, dan setidaknya satu jalur kontak yang valid. Proyek dan foto dapat ditambahkan bertahap.
- Validasi memeriksa slug unik, kategori sah, aset tersedia, kolom wajib, dan kelengkapan dua bahasa untuk konten publik.

## 11. Kualitas, aksesibilitas, dan performa

### Aksesibilitas

Target dasar [WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/), ditambah dukungan gerak minimal. Semua kontrol memiliki label yang jelas, fokus terlihat, struktur heading berurutan, dan target sentuh yang dirancang sekitar 44 × 44 px atau lebih. Teks biasa memiliki rasio kontras minimal 4,5:1; teks besar minimal 3:1.

Semua tindakan utama dapat dilakukan dengan keyboard. Tampilan besar foto memiliki pengelolaan fokus yang benar. Gambar informatif mempunyai alt yang sesuai bahasa; dekorasi tidak dibacakan sebagai konten. Tidak ada fungsi yang hanya tersedia lewat hover, warna, atau drag.

### Responsif

Pengujian representatif pada lebar 320, 360, 390, 768, 1024, dan 1440 px, ditambah pembesaran teks dan browser. Tidak ada scroll horizontal yang tidak disengaja. Kolase beradaptasi menjadi susunan vertikal di HP tanpa mengubah urutan baca. Menu dan judul tetap muat dalam kedua bahasa.

### Performa

Target setelah website diterbitkan dan data lapangan memadai: LCP ≤ 2,5 detik, INP ≤ 200 ms, dan CLS ≤ 0,1 pada persentil ke-75, dinilai terpisah untuk mobile dan desktop, mengikuti ambang baik [Core Web Vitals](https://web.dev/articles/vitals). Sebelum rilis, gunakan pengujian lab mobile untuk mendeteksi masalah; hasil lab tidak dinyatakan sebagai bukti pencapaian metrik lapangan.

Gambar memiliki ukuran responsif, dimensi yang diketahui, dan format modern dengan fallback yang sesuai. Media di bawah layar dimuat bertahap. Sampul pembuka diprioritaskan. Font dibatasi dan dipersiapkan agar perpindahan tata letak kecil. Rilis awal tidak memuat video otomatis atau aset 3D berat.

### Penemuan dan ketahanan

Setiap halaman publik mempunyai judul, deskripsi, URL kanonis, metadata berbagi, dan padanan bahasa. Sitemap berisi halaman publik; draft dikecualikan. Halaman tidak ditemukan memberi jalur kembali yang sesuai bahasa. Isi utama dan tautan tetap tersedia dalam HTML awal; filter memakai tautan kategori sebagai fallback jika diperlukan.

## 12. Kriteria penerimaan

| ID | Dinyatakan selesai ketika |
|---|---|
| AC-01 | Pembuka memperlihatkan nama, identitas Sistem Informasi, dan akses karya tanpa menunggu animasi |
| AC-02 | Empat kategori IT tersedia; fotografi tampil sebagai bagian terpisah dan tidak memenuhi bagian karya IT |
| AC-03 | Filter menampilkan hasil yang benar, menyimpan keadaan pada alamat, dan dapat dipakai dengan keyboard |
| AC-04 | Setiap proyek publik mempunyai detail yang benar; bagian dan tautan opsional yang kosong tidak ditampilkan |
| AC-05 | Pergantian ID/EN bekerja di seluruh halaman dan mempertahankan konteks yang relevan |
| AC-06 | Tidak ada teks antarmuka, metadata, atau label aksesibilitas publik yang tertinggal dalam bahasa yang salah |
| AC-07 | Galeri dapat dibuka, dinavigasi, dan ditutup dengan sentuhan serta keyboard; fokus kembali ke pemicu |
| AC-08 | Animasi inti pada tabel tersedia dalam mode normal dan beradaptasi terhadap preferensi gerak minimal |
| AC-09 | Tidak ada teks atau kontrol yang tertutup kolase pada ukuran layar uji dan pembesaran 200% |
| AC-10 | Semua jalur kontak yang terlihat valid; salin email memiliki konfirmasi dan fallback |
| AC-11 | Menambah proyek dan foto cukup dengan mengubah file konten/aset mengikuti panduan |
| AC-12 | Draft, placeholder, dan contoh tidak muncul sebagai karya asli pada versi publik |
| AC-13 | Validasi mendeteksi slug ganda, aset hilang, dan terjemahan wajib yang belum lengkap |
| AC-14 | Pemeriksaan manual keyboard, kontras, responsif, dan gerak minimal selesai tanpa penghalang utama |
| AC-15 | Pemeriksaan performa lab, tautan, 404, dan metadata selesai; temuan serta batasan dicatat |
| AC-16 | Aplikasi memakai stack bagian 16; versi stabil yang kompatibel dicatat dalam dependensi dan lockfile |
| AC-17 | Seluruh baris cakupan animasi bagian 8 bekerja pada desktop dan mempunyai adaptasi HP; peninjauan dilakukan pada hasil berjalan |
| AC-18 | Lima pose maskot berganti sesuai bagian/aksi, tanpa gambar kosong, pergeseran isi, atau klaim adanya rig anggota tubuh |
| AC-19 | Navigasi berulang, filter, resize, dan pergantian bahasa tidak menggandakan trigger, listener, ticker, atau animasi |
| AC-20 | Scroll, back/forward, fokus, dan tautan berfungsi saat Lenis aktif maupun nonaktif; lapisan transisi tidak macet saat halaman gagal dimuat |

## 13. Tahapan pembangunan dan hasil kerja

| Tahap | Pekerjaan | Hasil yang ditinjau |
|---|---|---|
| 1. Fondasi visual dan teknis | Setup stack, komposisi pembuka, grid, tipografi, dan prototipe gerak pembuka serta transisi satu halaman | Rancangan desktop/HP dan bukti integrasi animasi |
| 2. Struktur dan konten | Semua halaman, JSON/MDX, validasi, draft, dua bahasa, filter, kondisi kosong | Website dapat dijelajahi tanpa bergantung pada animasi |
| 3. Koreografi menyeluruh | Seluruh cakupan bagian 8, sinkronisasi scroll, transisi halaman, dan lima pose maskot | Website dengan animasi lengkap, adaptasi HP, dan mode gerak minimal |
| 4. Pemeriksaan | Responsif, keyboard, fokus, bahasa, validasi konten, gambar, performa | Catatan hasil pemeriksaan dan perbaikan |
| 5. Serah terima | Panduan edit, contoh konten, petunjuk pratinjau serta publikasi | Sumber website dan panduan yang dapat dipakai pemilik |

Perkiraan waktu ditetapkan setelah jumlah halaman detail, aset awal, dan prototipe koreografi ditinjau. Stack sudah ditetapkan pada bagian 16. PRD ini tidak menyatakan website sudah dibangun atau diterbitkan.

## 14. Ketergantungan dan risiko

| Hal | Dampak | Penanganan |
|---|---|---|
| Konten pribadi belum ada | Belum bisa menilai keterbacaan nama asli dan variasi media | Gunakan placeholder berlabel; periksa ulang ketika konten asli masuk |
| Empat bidang minat | Identitas berpotensi terasa terlalu tersebar | Satu pengantar Sistem Informasi; karya pilihan menjadi bukti minat |
| Banyak animasi | Respons dapat melambat atau cerita sulit diikuti | Satu fokus gerak per bagian, respons input segera, dan gerak minimal |
| Gambar fotografi besar | Waktu muat meningkat | Thumbnail responsif; resolusi besar hanya saat dibuka |
| Panjang terjemahan berbeda | Judul atau label dapat keluar dari ruangnya | Susunan fleksibel; uji ID/EN sejak tahap awal |
| Konten diperbarui melalui file | Kesalahan format dapat menghambat publikasi | Template entri, validasi, dan petunjuk dengan contoh |

Yang dapat diisi pemilik kemudian: nama, bio, kontak, CV, karya, foto, dan akun sosial. Ketiadaan bahan tersebut tidak menghalangi pembangunan kerangka dan interaksi; pemeriksaan sebelum publikasi memastikan identitas serta kontak sudah benar.

## 15. Referensi desain dan interaksi

1. **Gambar referensi pengguna, bertuliskan Potozon.** Acuan untuk tipografi besar, kolase miring, ruang putih, dan elemen label. Gambar statis ini tidak menjadi bukti animasi atau kepemilikan aset.
2. [Niccolò Miranda — Paper Portfolio](https://www.niccolomiranda.com/): acuan untuk struktur editorial, kolom, dan hierarki judul.
3. [Rauno Freiberg](https://rauno.me/): acuan untuk penyajian identitas dengan tipografi, geometri, dan karakter interaktif.
4. [Dennis Snellenberg](https://dennissnellenberg.com/): acuan untuk skala pembuka dan hierarki karya.
5. [Emil Kowalski — Good vs Great Animations](https://emilkowal.ski/ui/good-vs-great-animations): acuan untuk gerak dengan asal yang jelas dan pengaturan percepatan.
6. [W3C — Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions): acuan untuk dukungan preferensi gerak minimal.

Palet, motif bingkai, durasi animasi, struktur konten, dan prioritas fitur dalam PRD ini merupakan usulan khusus untuk kebutuhan pengguna.

## 16. Tech stack dan arsitektur implementasi

### Keputusan stack

Stack ini dipilih untuk rilis awal. Pertimbangannya: banyak interaksi dan koreografi scroll, halaman proyek yang perlu mudah ditemukan, dua bahasa, serta konten yang diedit melalui file. Versi stabil yang saling kompatibel dipilih saat setup, lalu dikunci dalam manifest dependensi dan lockfile. Tidak menggunakan API eksperimental sebagai ketergantungan wajib.

| Kebutuhan | Teknologi | Tugas dalam website |
|---|---|---|
| Framework dan halaman | [Next.js App Router](https://nextjs.org/docs/app/getting-started) + React | Routing, HTML awal, halaman proyek, metadata, dan pemisahan komponen server/client |
| Bahasa pemrograman | TypeScript | Menjaga struktur komponen, kategori, bahasa, dan keadaan maskot konsisten |
| Styling | [Tailwind CSS](https://tailwindcss.com/docs/installation/using-postcss) + CSS variables | Grid editorial, responsif, tipografi, warna, dan keadaan fokus |
| Koreografi | [GSAP](https://gsap.com/docs/v3/GSAP/) | Timeline pembuka, gerak kartu, bingkai, galeri, maskot, dan lapisan transisi |
| Integrasi React | [`@gsap/react`](https://gsap.com/resources/React/) | Membatasi animasi per komponen dan mengelola siklus hidupnya |
| Gerak mengikuti scroll | [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) | Pemicu, progres scroll, dan koreografi antarbagian |
| Animasi judul | [GSAP SplitText](https://gsap.com/docs/v3/Plugins/SplitText/) | Membagi judul menjadi baris/kata untuk reveal; susunan disesuaikan saat font atau lebar berubah |
| Perubahan susunan | [GSAP Flip](https://gsap.com/docs/v3/Plugins/Flip/) | Transisi posisi kartu saat filter mengubah grid |
| Scroll halus | [Lenis](https://github.com/darkroomengineering/lenis) | Menghaluskan input scroll desktop dan menyelaraskannya dengan ScrollTrigger |
| Bahasa | [next-intl](https://next-intl.dev/docs/getting-started/app-router) | Pesan ID/EN dan routing locale |
| Isi proyek | JSON + [MDX lokal](https://nextjs.org/docs/app/guides/mdx) | Data profil/daftar karya serta cerita proyek yang bisa diedit dari file |
| Validasi isi | [Zod](https://zod.dev/) | Memeriksa kolom wajib, kategori, slug, dan struktur terjemahan sebelum build |
| Media dan font | `next/image` + `next/font` | Pengaturan gambar responsif dan pemuatan font; alpha maskot dipertahankan |
| Pemeriksaan alur | [Playwright](https://playwright.dev/docs/intro) | Navigasi, bahasa, filter, galeri, dan mode gerak minimal pada viewport representatif |
| Hosting | [Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs) | Target pratinjau dan publikasi Next.js; domain dipilih kemudian |

Tabel ini menetapkan teknologi, bukan membuat akun, membeli layanan, atau menerbitkan website. Kebutuhan biaya hosting dievaluasi saat rilis berdasarkan pemakaian yang sebenarnya.

### Pembagian animasi

GSAP menjadi satu mesin koreografi untuk rilis awal. Transisi CSS dipakai untuk keadaan sederhana seperti warna tautan dan fokus. Motion/Framer Motion, ScrollSmoother, Rive, Lottie, dan Three.js tidak termasuk dependensi awal. Jika kebutuhan baru memerlukan salah satunya, perubahan dicatat beserta tugas khususnya.

Satu properti pada satu elemen hanya dikendalikan oleh satu sistem animasi. Bila kartu perlu bergerak mengikuti scroll sekaligus bereaksi terhadap pointer, pisahkan wadah scroll dan isi kartu agar transformasinya tidak saling menimpa.

### Komponen dan siklus hidup

- Halaman serta pembacaan konten memakai komponen server sejauh memungkinkan. Bagian yang menangani input, maskot, galeri, dan GSAP memakai komponen client yang terlokalisasi.
- Buat komponen bersama untuk animasi judul, kartu proyek, dialog foto, maskot, menu, dan lapisan transisi. Durasi, easing, jarak, dan intensitas didefinisikan dalam pengaturan gerak bersama.
- Buat satu integrasi scroll pada layout utama. Sinkronkan Lenis dan ScrollTrigger melalui satu jalur ticker; hindari dua loop pembaruan yang menjalankan instance sama.
- Gunakan scope lokal dan cleanup pada `useGSAP`. Animasi dari event handler harus dicatat untuk dibersihkan, dan listener/ticker manual dilepas ketika tidak digunakan.
- Segarkan pengukuran scroll setelah font, gambar, filter, atau konten bahasa mengubah tata letak. Split judul harus diperbarui ketika baris berubah tanpa menggandakan pembungkus teks.
- Lapisan transisi tetap berada pada layout persisten dan dikoordinasikan dengan routing serta kesiapan tujuan. Tidak mengandalkan shared-element transition lintas halaman yang eksperimental.
- Saat dialog galeri/menu terbuka, kelola fokus dan kunci scroll latar. Pastikan scroll dipulihkan ketika ditutup, termasuk pada jalur kesalahan.
- Jalankan gerak hanya pada elemen yang relevan atau terlihat. Utamakan transform dan opacity; ukur efek seperti mask dan blur sebelum menerapkannya luas.

Aturan integrasi Lenis/ScrollTrigger dan cleanup React mengacu pada dokumentasi [Lenis](https://github.com/darkroomengineering/lenis) dan [GSAP React](https://gsap.com/resources/React/). Susunan komponen di atas merupakan keputusan implementasi untuk proyek ini.

### Struktur konten yang direncanakan

| Lokasi di sumber website | Isi |
|---|---|
| `content/profile.json` | Identitas, bio ID/EN, kontak, dan tautan |
| `content/projects.json` | Metadata, kategori, sampul, urutan, dan status proyek |
| `content/projects/[slug]/id.mdx` | Cerita proyek Bahasa Indonesia |
| `content/projects/[slug]/en.mdx` | Cerita proyek Bahasa Inggris |
| `content/photography.json` | Daftar foto, alt, caption, album, dan status |
| `messages/id.json`, `messages/en.json` | Label serta pesan antarmuka |
| `public/images/projects/` | Media karya IT |
| `public/images/photography/` | Foto milik pemilik |
| `public/images/character/` | Lima pose karakter beserta metadata |
| `src/lib/motion/` | Pengaturan gerak, pemicu, dan utilitas cleanup |
| `src/lib/content/` | Pembacaan konten serta validasi |
| `src/app/[locale]/` | Halaman dan layout sesuai bahasa |

Ini adalah struktur untuk sumber website yang akan dibangun; folder implementasi belum dibuat oleh revisi PRD. MDX hanya berasal dari file lokal yang dikelola pemilik. Backend tidak diperlukan untuk isi portofolio dan kontak email pada rilis awal.

## 17. Riwayat revisi

| Versi | Perubahan |
|---|---|
| 1.0 | Arah visual, halaman, dua bahasa, pengelolaan isi, dan persyaratan kualitas |
| 1.1 | Menetapkan stack, memperjelas full animasi sebagai cakupan wajib, memasukkan lima pose maskot, serta menambah aturan integrasi dan kriteria penerimaan |
