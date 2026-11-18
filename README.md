# Shima Teppanyaki: handoff WordPress

Repositori ini berisi referensi desain dan implementasi statis untuk pengembangan website Shima Teppanyaki di WordPress. Gunakan halaman dan aset di sini sebagai acuan saat mengintegrasikan perubahan ke website WordPress yang ada.

> **Status desain mobile menu:** gunakan tampilan mobile menu pada website yang saat ini berjalan sebagai acuan implementasi. Desain mobile menu dalam versi GitHub ini masih berstatus **proposed** dan belum menjadi acuan final.

## Cakupan

| Halaman | File referensi | Tujuan |
| --- | --- | --- |
| Home | `index.html` | Halaman utama |
| Restaurant | `restaurant.html` | Informasi restoran |
| Teppanyaki | `teppanyaki.html` | Informasi dan daftar menu Teppanyaki |

Ketiga halaman saling terhubung secara lokal. Beberapa tautan lain masih mengarah ke website asli. Periksa tujuan setiap tautan saat integrasi.

## Menjalankan referensi secara lokal

Tidak diperlukan instalasi WordPress atau proses build untuk melihat referensi statis. Dari direktori proyek, jalankan:

```sh
python3 -m http.server 8000
```

Buka `http://localhost:8000/` di browser. Gunakan viewport desktop dan mobile untuk membandingkan halaman. Beberapa layanan atau skrip pihak ketiga mungkin memerlukan koneksi internet.

## Struktur proyek

```text
├── index.html              # Referensi Home
├── restaurant.html         # Referensi Restaurant
├── teppanyaki.html         # Referensi Teppanyaki dan menu
├── typography.css          # Penyesuaian tipografi dan layout
├── local-fixes.css         # Penyesuaian lokal dan fallback ikon slider
├── assets/                 # Gambar, font, CSS, dan JavaScript
│   └── optimized/          # Varian gambar WebP yang telah dioptimasi
├── scripts/                # Skrip dan laporan optimasi foto
├── DESIGN.md               # Preferensi dan referensi desain proyek
├── OPTIMASI-FOTO.md        # Panduan pipeline dan pengujian foto
├── PANDUAN-GENERATE-FOTO-MENU.md
└── vercel.json             # Konfigurasi cache untuk preview Vercel
```

HTML juga memuat CSS dan JavaScript inline serta referensi ke aset hasil ekspor WordPress dengan nama file berbasis hash. Periksa urutan stylesheet dan dependensinya sebelum memindahkan bagian yang diperlukan.

## Panduan integrasi WordPress

1. **Audit website yang ada.** Identifikasi theme, template, page builder, plugin, dan pengaturan yang digunakan sebelum menentukan lokasi perubahan. Repositori ini adalah salinan statis, bukan theme atau plugin WordPress yang siap dipasang.
2. **Implementasikan halaman.** Gunakan tiga file HTML sebagai referensi konten, struktur, dan tampilan. Sesuaikan dengan template dan komponen WordPress yang ada; pertahankan pengelolaan konten yang diperlukan oleh editor.
3. **Gunakan mobile menu website saat ini.** Pertahankan tampilan dan perilaku mobile menu yang berjalan saat ini. Menu pada versi GitHub hanya proposed. Untuk perubahan UI lain, lihat juga `DESIGN.md`.
4. **Integrasikan aset.** Pindahkan aset yang benar-benar digunakan ke theme atau Media Library sesuai kebutuhan. Daftarkan stylesheet dan skrip melalui mekanisme WordPress, dan periksa dependensi serta urutan pemuatannya.
5. **Hubungkan fungsi WordPress.** Formulir, reservasi, navigasi, WhatsApp, slider, dan integrasi pihak ketiga perlu dihubungkan serta diuji pada lingkungan WordPress. Markup dan referensi plugin dalam HTML statis tidak menyediakan backend atau menjamin fungsi aktif.
6. **Sesuaikan URL dan SEO.** Periksa tautan internal dan eksternal, canonical, metadata, structured data, serta referensi API yang masih berasal dari website asli. Gunakan URL dan konfigurasi yang sesuai dengan lingkungan target.

## Gambar dan konten

Foto menu tersedia dalam `assets/`, dengan varian responsif di `assets/optimized/`. Pertahankan gambar responsif, dimensi, lazy loading, dan teks alternatif yang sesuai saat integrasi. `OPTIMASI-FOTO.md` menjelaskan cara memperbarui foto, menjalankan verifikasi, dan menjaga pemetaan sumber melalui `scripts/photo-report.json`.

Tinjau kembali nama menu, deskripsi, harga, detail kontak, dan hak penggunaan aset bersama pemilik konten sebelum publikasi. `PHOTO-SOURCES.txt` dan `PANDUAN-GENERATE-FOTO-MENU.md` menyediakan informasi tambahan mengenai sumber dan pembuatan foto.

## Checklist sebelum serah terima

- [ ] Bandingkan Home, Restaurant, dan Teppanyaki dengan referensi pada desktop dan mobile.
- [ ] Pastikan mobile menu mengikuti website yang saat ini berjalan, bukan desain proposed di GitHub.
- [ ] Uji navigasi, slider, tautan kontak, WhatsApp, peta, dan seluruh CTA.
- [ ] Uji formulir atau alur reservasi sampai penerimaan data pada lingkungan WordPress.
- [ ] Periksa gambar, crop, `srcset`, alt text, dan waktu muat pada perangkat mobile.
- [ ] Periksa keyboard, fokus, label kontrol, dan tampilan pada ukuran layar kecil.
- [ ] Verifikasi URL, metadata SEO, structured data, serta pengaturan pihak ketiga untuk domain target.
- [ ] Uji perubahan di staging dan dapatkan persetujuan konten serta desain sebelum publikasi.

## Batasan referensi

Repositori ini tidak menyertakan database, konfigurasi server, akun, atau backend WordPress. Keberadaan markup Contact Form 7 dan skrip plugin lain di HTML tidak memastikan plugin atau integrasinya tersedia di lingkungan target. Hasil akhir perlu diuji kembali pada instalasi WordPress yang digunakan.
