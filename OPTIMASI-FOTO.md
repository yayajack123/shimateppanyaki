# Optimasi foto Teppanyaki

Website tetap berupa HTML statis. File WebP sudah dibuat dan siap disertakan dalam deployment; Vercel tidak perlu menjalankan konversi saat menerima request.

## Hasil pengujian lokal

HTML terbaru saat implementasi memiliki **37 foto menu unik**, termasuk ilustrasi set menu baru dan pengganti dua placeholder lama. Semua ikut diproses.

| Ukuran | Sebelum | Sesudah |
| --- | ---: | ---: |
| Master foto menu / varian default 800 piksel | 60.120.269 byte | 1.961.748 byte |
| Semua foto menu memakai varian terbesar | 60.120.269 byte | 3.470.820 byte |
| Transfer foto menu, scroll penuh, 390 piksel DPR 2 | 60.131.369 byte | 1.972.848 byte |
| Transfer foto menu, scroll penuh, 1440 piksel DPR 2 | 60.131.369 byte | 1.972.848 byte |
| Transfer resource awal, 390 piksel DPR 2 | 18.008.758 byte | 2.427.222 byte |
| Transfer resource awal, 1440 piksel DPR 2 | 33.211.330 byte | 3.006.488 byte |
| Hero desktop | 408.380 byte | 198.224 byte |
| Hero mobile | 408.380 byte | 88.768 byte |

Transfer foto menu turun **96,7%** pada kedua skenario DPR 2. Semua varian memakai kualitas 80; tidak diperlukan penurunan ke 76 atau 72. Total 113 file WebP, termasuk seluruh ukuran alternatif dan hero, adalah 6.364.846 byte. Pengunjung hanya mengambil varian yang dipilih browser.

Pengukuran memakai Chromium, server Python lokal tanpa kompresi HTTP, viewport setinggi 850 piksel, serta browser context baru per skenario. Transfer resource berasal dari Resource Timing, termasuk overhead transfer yang dilaporkan browser dan tidak termasuk dokumen HTML. Ini bukan simulasi bandwidth atau waktu muat Vercel.

Ukuran layar yang diperiksa: 390 (DPR 1 dan 2), 600, 601, 768, 991, 992, 1200, dan 1440 (DPR 1 dan 2). Tidak ada request lokal gagal atau overflow. Seluruh foto selesai dimuat setelah scroll penuh. Sebelum scroll, hanya 4–18 dari 37 foto yang sudah dimuat, bergantung viewport. Browser memilih varian 400 piksel pada DPR 1 untuk kartu kecil dan 800 piksel pada kedua skenario DPR 2.

Lebar kartu terukur: 360 piksel pada viewport 390, 570 pada 600, 271,5 pada 601, 283,5 pada 768–991, sekitar 240,78 pada 992, serta 296,34 pada 1200 ke atas. Atribut `sizes` mengikuti rentang ini, dibulatkan ke atas untuk nilai tetap.

Perbandingan visual seluruh foto dan hero sudah diperiksa; warna, komposisi, detail makanan pada ukuran kartu, dan crop tetap sesuai. Pengujian navigasi Home/Restaurant serta buka/tutup WhatsApp lolos pada ketiga halaman di mobile dan desktop. Konten teks, harga, link, dan alt foto Teppanyaki sama dengan backup.

CLS tetap sama dengan baseline pada seluruh skenario, sekitar 0,0009–0,0014. Angka LCP lokal tersedia di laporan mentah, tetapi pengukuran scroll bukan dasar klaim LCP production. Tidak ada preload hero yang ditambahkan karena manfaatnya belum dibuktikan dengan median pengujian jaringan. Target LCP dan pengujian Slow 4G di preview masih perlu diverifikasi setelah URL tersedia.

Laporan tersimpan di `scripts/photo-report.json`, `scripts/browser-baseline.json`, `scripts/browser-optimized.json`, dan `scripts/browser-regression.json`.

## Menjalankan ulang konversi

Prasyarat: Python 3.9+ dan `cwebp` dari libwebp. Tidak membutuhkan Pillow, Node, npm, atau framework untuk konversi dan pemeriksaan statis.

Jalankan dari folder proyek:

```sh
python3 scripts/optimize_photos.py
python3 scripts/verify_photos.py
```

Pipeline membaca elemen gambar menu dari HTML, menggabungkan sumber yang sama, dan mengenali hasil WebP sebelumnya melalui laporan. Master asli harus tetap tersedia. Varian menu berlebar 400, 800, dan 1200 piksel dibatasi lebar asli. Hero memakai 960 dan maksimal 1920 piksel; sumber hero saat ini 1600 piksel sehingga desktop tetap 1600.

Konversi menggunakan `cwebp -m 6 -metadata none`. Mulai kualitas 80; jika ukuran melampaui 180.000 byte untuk lebar sampai 800, atau 250.000 byte untuk ukuran lebih besar, coba 76 lalu 72. Jika seluruh pilihan gagal, atau jumlah varian menu terbesar mencapai 7 MB, script berhenti sebelum mengubah referensi halaman. Pemeriksaan visual tetap diperlukan untuk foto baru.

Nama file mencakup 16 karakter SHA-256 dari hasil WebP dan lebar aktual. Konversi yang diulang tanpa perubahan menghasilkan HTML, manifest, dan pengecualian deployment yang sama; hal ini sudah diuji. Kegagalan encoder yang disimulasikan juga sudah diuji: HTML, laporan, dan pengecualian deployment tidak berubah.

Jangan menghapus `scripts/photo-report.json`: file tersebut menyimpan pemetaan WebP kembali ke master. Jangan menyunting atau mengganti isi WebP secara manual karena nama file mengikuti hash kontennya.

## Menambah atau mengganti foto

1. Simpan master PNG/JPG di `assets/` dengan nama `generated-<nama-menu>`. Hindari spasi dan gunakan huruf kecil, angka, serta tanda hubung.
2. Untuk foto baru, tambahkan elemen `img` pada kartu menu dengan `src` menuju master. Untuk mengganti foto yang sudah ada, ubah `src` kartu tersebut ke master baru. Pertahankan alt yang sesuai isi foto.
3. Jalankan konversi dan verifikasi statis. Pipeline memperbarui `src`, `srcset`, `sizes`, dimensi, lazy loading, serta decoding tanpa mengubah teks menu.
4. Bandingkan visual dan ulangi uji browser. Ilustrasi khusus yang memiliki `max-width: 360px` tetap memakai aturan `sizes` tersendiri.

Jika ingin mengubah hero, ubah sumber hero dalam `scripts/photo-report.json` lalu jalankan pipeline; CSS hero yang dikelola script akan diperbarui. Bila layout kartu atau breakpoint berubah, ukur ulang lebar kartu dan sesuaikan konstanta `SIZES` sebelum regenerasi.

File varian lama sengaja tidak dihapus otomatis. Setelah penggantian foto berulang kali, file lama yang tidak dirujuk HTML, CSS, atau manifest aktif boleh dibersihkan untuk mengurangi paket deployment; jangan menghapus master.

## Mengulang pengujian browser

Playwright hanya merupakan alat pengujian lokal, bukan dependency website. Jika belum tersedia, pasang pada folder sementara:

```sh
npm install --prefix /tmp/shima-photo-check playwright
/tmp/shima-photo-check/node_modules/.bin/playwright install chromium
python3 -m http.server 8765 --bind 127.0.0.1
```

Di terminal lain, dari folder proyek:

```sh
NODE_PATH=/tmp/shima-photo-check/node_modules node scripts/measure_photos.cjs after scripts/browser-optimized.json
NODE_PATH=/tmp/shima-photo-check/node_modules node scripts/regression_photos.cjs
```

Untuk baseline dengan aset asli, gunakan HTML backup yang dilayani melalui route browser pada URL yang sama:

```sh
BASELINE_HTML=.optimization-backup/teppanyaki.html NODE_PATH=/tmp/shima-photo-check/node_modules node scripts/measure_photos.cjs baseline scripts/browser-baseline.json
```

`BASE_URL` dapat diganti untuk pengukuran preview. `PLAYWRIGHT_MODULE` dapat menunjuk instalasi Playwright yang sudah tersedia, dan `CHROMIUM_EXECUTABLE` dapat menunjuk executable Chromium yang sesuai. Screenshot viewport disimpan di direktori sementara OS.

## Deployment dan pemulihan

Alur yang disiapkan adalah deployment folder proyek melalui Vercel CLI, dengan preset **Other**, tanpa Build Command dan tanpa Output Directory override. Hasil WebP harus ikut diunggah. Konversi dan pemeriksaan statis dijalankan sebelum deployment.

`vercel.json` menetapkan `Cache-Control: public, max-age=31536000, immutable` hanya pada URL WebP teroptimasi yang sesuai pola nama berhash. HTML dan aset sumber tidak mendapat aturan cache panjang ini. Acuan konfigurasi: https://vercel.com/docs/project-configuration/vercel-json#headers

`.vercelignore` mengecualikan backup, script/laporan pengujian, panduan ini, dan master yang sudah digantikan serta tidak dirujuk kode web. Pipeline memeriksa kembali HTML, CSS, serta JavaScript sebelum mengecualikan sumber; aset halaman lain tetap tersedia. Untuk metode upload lain atau integrasi Git, pastikan daftar pengecualian yang sama benar-benar diterapkan pada output deployment; jangan mengandalkan pengecualian upload CLI. Acuan: https://vercel.com/docs/deployments/vercel-ignore

Setelah URL preview tersedia:

1. Periksa satu URL WebP dan header cache-nya; pastikan file master yang dikecualikan tidak ikut deployment.
2. Ulangi pengujian scroll dengan cache kosong pada 390/DPR 2 dan 1440/DPR 2; transfer foto menu harus maksimal 7 MB.
3. Jalankan tiga pengukuran mobile tanpa scroll, cache kosong dan profil Slow 4G yang sama; laporkan median LCP dan CLS. Target LCP ≤2,5 detik dan CLS ≤0,1.
4. Jika LCP belum memenuhi target karena CSS/JS lama, catat temuan untuk tahap optimasi berikutnya. Jangan menghapus dependency dalam tahap foto ini. Uji preload hero hanya bila hero terbukti menjadi LCP dan median membaik tanpa request ganda.

Untuk pemulihan awal, kembalikan `teppanyaki.html` dari `.optimization-backup/teppanyaki.html`, hapus blok `optimized-photos` dari `.vercelignore`, dan hapus aturan cache WebP yang ditambahkan dalam `vercel.json`. Master asli tetap tersedia. `typography.css`, Home, dan Restaurant tidak diubah oleh implementasi ini.
