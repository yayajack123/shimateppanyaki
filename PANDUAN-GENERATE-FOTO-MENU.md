# Panduan Generate Foto Menu Shima Teppanyaki

## Tujuan

Buat gambar konsep untuk 30 menu yang belum memiliki gambar generatif, dalam lima batch berisi enam gambar. Gunakan enam gambar generatif yang sudah ada sebagai acuan visual dan pasang hasil setiap batch pada kartu yang sesuai di `teppanyaki.html`.

Enam gambar acuan berada di folder `assets/`: `generated-vegetables.png`, `generated-asparagus.png`, `generated-tofu.png`, `generated-calamari.png`, `generated-tuna.png`, dan `generated-fish.png`.

## Panduan visual

- **Format:** persegi 1:1, untuk grid menu tiga kolom.
- **Sudut kamera:** tampak tepat dari atas, piring di tengah dan ukuran piring relatif konsisten.
- **Latar:** abu-abu muda hangat dengan tekstur halus.
- **Piring:** keramik krem bernuansa netral, sederhana, dengan ruang di sekeliling makanan.
- **Pencahayaan:** lembut dan hangat dari satu arah, dengan bayangan alami.
- **Makanan:** fotorealistis, menggugah selera, dan bahan utama mudah dikenali. Tampilkan porsi yang masuk akal.
- **Set menu:** gunakan deskripsi di kartu menu sebagai sumber komponen. Tampilkan perbedaan utama antarset tanpa mengarang bahan spesifik.
- **Hindari:** teks, logo, watermark, tangan, alat makan, properti dekoratif, kolase, dan bahan tambahan yang tidak jelas kaitannya dengan hidangan.
- **Status:** gambar adalah ilustrasi konsep, bukan foto hidangan asli. Bentuk penyajian dan bahan tambahan perlu dicocokkan dengan Shima.

### Prompt dasar

> Create a photorealistic square commercial food photograph for a Japanese restaurant menu. Match the supplied reference images: directly overhead camera, centered neutral cream ceramic plate, light warm gray subtly textured surface, soft directional studio light, natural shadows, and clean restrained composition. Subject: **[NAMA HIDANGAN DAN BAHAN UTAMA]**. Use plausible portions and realistic food textures. Keep camera distance and plate scale consistent with the references. No text, logos, watermarks, hands, cutlery, decorative props, collage, or unrelated sides. This is a conceptual illustration, not a claim of the restaurant's exact plating.

Gunakan gambar acuan sebagai **referensi gaya**, bukan sebagai referensi bahan hidangan. Untuk setiap menu, baca nama dan deskripsinya di `teppanyaki.html` dan tambahkan detail yang tersedia pada bagian subjek prompt.

## Pembagian batch

### Batch 1 — Seafood dan ayam

1. Atlantic or Tasmanian Salmon
2. US Scallops
3. King Prawn
4. Giant Prawn
5. Lobster (Rock)
6. Probiotic Chicken

### Batch 2 — Potongan steak

1. Prime Australian Ribeye Mb 6–7
2. Premium Australian Wagyu Tenderloin Mb6
3. Premium Australian Wagyu Sirloin Mb 7–8
4. Premium Australian Black Angus Tenderloin
5. Miyazaki Wagyu Sirloin A5
6. Tomahawk Premium Wagyu Steak

### Batch 3 — Steak dan pendamping

1. Dry Aged Wagyu Tomahawk Steak
2. Dry Aged Wagyu T-Bone Steak
3. Prime Australian Ribeye Mb6–7
4. Fried Rice
5. Steamed Rice
6. Potato Wedges

### Batch 4 — Set menu

1. Omoshiroi
2. Gyokai
3. Oishi
4. Kobe
5. Kairiku
6. Zeitaku

### Batch 5 — Menu anak, vegetarian, dan Meat Lover

1. Suku Suku
2. Mori Mori
3. Vegetarian Set 1
4. Vegetarian Set 2
5. Set Menu POW (Price on Weight)
6. Niku Dake

## Langkah pelaksanaan untuk setiap batch

1. Baca kartu dan deskripsi masing-masing hidangan di `teppanyaki.html`. Pastikan nama dan komponen sesuai; beberapa menu memakai nama yang mirip.
2. Gunakan gambar acuan yang sudah tersedia dan prompt dasar di atas. Buat **satu gambar terpisah untuk setiap kartu**, kecuali pengguna menyetujui penggunaan gambar bersama.
3. Periksa setiap hasil: bahan utama dapat dikenali, sudut dan latar konsisten, proporsi masuk akal, dan gambar tidak memiliki teks atau watermark. Ulangi gambar yang jelas tidak sesuai.
4. Simpan gambar terpilih di `assets/` dengan nama yang jelas dan unik, misalnya `generated-salmon.png`. Jangan menimpa gambar yang dipakai kartu lain.
5. Ganti atribut `src` pada kartu yang sesuai di `teppanyaki.html`. Perbarui teks `alt` agar menjelaskan gambar sebagai ilustrasi. Jangan mengubah nama, deskripsi, harga, urutan, atau kartu lain.
6. Pastikan semua file baru ada dan setiap kartu mengarah ke gambar yang benar. Periksa tampilan grid desktop, tablet, dan ponsel jika browser tersedia.
7. Laporkan enam menu yang selesai, gambar yang memerlukan perhatian, dan batasan pemeriksaan. Tunggu arahan pengguna sebelum melanjutkan batch berikutnya.

## Catatan

- Struktur awal: 36 kartu; enam menu pertama sudah memiliki gambar generatif. Jumlah ini dapat berubah jika proyek diedit setelah panduan dibuat.
- Foto Unsplash lama digunakan juga oleh beberapa kartu lain. Buat file generatif baru dan ubah referensi pada kartu yang dituju saja.
- Catat bahwa setiap gambar merupakan visual konsep sampai penyajian aslinya dikonfirmasi.
