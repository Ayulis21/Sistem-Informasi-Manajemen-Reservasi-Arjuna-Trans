# 🚌 Sistem Informasi Manajemen Reservasi - PO Arjuna Trans

Selamat datang di repositori resmi **Sistem Informasi Manajemen Reservasi PO Arjuna Trans**. Aplikasi ini dirancang khusus untuk mengotomatisasi seluruh alur operasional internal agen otobus, mulai dari manajemen master data aset, pemrosesan transaksi reservasi pelanggan, hingga plotting jadwal kru lapangan secara real-time.

Aplikasi ini dibangun menggunakan arsitektur modern perpaduan **Laravel (Back-End)** dan **React TypeScript dengan Inertia.js (Front-End)** serta didukung database **MySQL**.

---

## 🖥️ Fitur Utama Aplikasi

### 1. Manajemen Master Data (Aset & Kru)

- **Modul Kelola Armada (100% DONE)**: Fitur CRUD lengkap (Tambah unit, Tampil kartu grid dinamis, Validasi cerdas, Edit data via modal, dan Hapus permanen) terintegrasi lurus ke database MySQL.
- **Modul Kelola Kru Lapangan (100% DONE)**: Registrasi lengkap Driver (Sopir) & Helper (Kernet) dengan Sistem Jam Terbang (KM) Otomatis dan Reset Bulanan setiap tanggal 1 awal bulan.

### 2. Modul Operasional & Plotting (100% DONE)

- **Manajemen Antrean Cerdas**: Sistem otomatis menyaring pesanan yang belum di-plot dan mengurutkan jadwal berdasarkan waktu keberangkatan terdekat.
- **Validasi Jeda Istirahat (8 Jam Rule)**: Fitur keamanan yang otomatis mendeteksi bentrok jadwal dan mewajibkan jeda istirahat minimal 8 jam antar perjalanan bagi kru.
- **Integrasi Armada Rekanan (Sub-Contractor)**: Mendukung pengisian data bus luar (PO Mitra, Plat, Seat, dan Biaya Modal) tanpa memotong jatah kapasitas garasi internal.

### 3. Modul Kelola Pesanan & Keuangan (100% DONE)

- **Otomasi Visual Real-Time**: Status pesanan berubah otomatis di dashboard (🚀 Sedang Jalan atau ⏳ Menunggu Selesai) berdasarkan jam berangkat dan pulang secara otomatis.
- **Validasi Keuangan Ketat**: Penguncian nominal (Locked) untuk data yang disetujui, wajib upload bukti transfer, dan pemisahan status pembayaran per baris.
- **Instant Search**: Fitur pencarian cepat berdasarkan nama pelanggan, ID Pesanan, atau Kota Tujuan yang langsung menyaring data saat diketik.

### 4. Pusat Laporan & Analitik (100% DONE)

- **Laporan Pembayaran**: Monitoring piutang pelanggan, status pelunasan, dan riwayat cicilan secara detail dan transparan.
- **Laporan Kinerja Kru**: Analisis produktivitas tim berdasarkan akumulasi Jarak Tempuh (KM) dan jumlah perjalanan (Total Trips) yang telah diselesaikan.

---

## 🛠️ Spesifikasi Teknologi Proyek (Project Specifications)

Berdasarkan audit sistem internal aplikasi, berikut adalah spesifikasi jeroan yang digunakan oleh proyek ini:

- **Framework Back-End**: Laravel v12.62.0 (Latest Stable)
- **Runtime Environment**: PHP v8.2.12
- **Package Manager**: Composer v2.8.6 & NPM
- **Framework Front-End**: React.js dengan TypeScript (Vite Compiler)
- **Jembatan Komunikasi**: Inertia.js (Inertia Shared Props Engine)
- **Database Driver Engine**: MySQL Core Connection
- **Session Handler Driver**: File-Based Storage System (Anti-Crash Session)
- **Visual Styling Package**: Tailwind CSS & Lucide React Icon Components

---

## ⚙️ Panduan Cara Menjalankan Aplikasi di Lokal (Step-by-Step Setup Guide)

Jika Anda ingin mengunduh, memindahkan, atau menjalankan kembali proyek Arjuna Trans ini di komputer baru, silakan ikuti instruksi langkah demi langkah di bawah ini:

### Langkah 1: Kloning Repositori dari GitHub

Buka terminal komputer Anda, lalu unduh berkas proyek menggunakan Git:

```bash
git clone https://github.com
cd Sistem-Informasi-Manajemen-Reservasi-Arjuna-Trans
```

### Langkah 2: Instalasi Seluruh Dependensi Framework

Pasang semua pustaka komponen penunjang website, baik di sisi server (Laravel) maupun client (React):

```bash
# Instal dependensi Back-End Laravel via Composer
composer install

# Instal dependensi Front-End React via NPM
npm install
```

### Langkah 3: Konfigurasi File Environment (.env)

Salin file template `.env.example` menjadi `.env` di dalam folder utama proyek Anda:

```bash
cp .env.example .env
```

Buka file `.env` yang baru dibuat menggunakan VS Code, lalu sesuaikan baris konfigurasi koneksi database MySQL dan session driver Anda seperti berikut:

```text
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=arjuna-trans
DB_USERNAME=root
DB_PASSWORD=

SESSION_DRIVER=file
```

_(Pastikan Anda sudah membuat database kosong bernama `arjuna-trans` di dalam phpMyAdmin Anda)._

### Langkah 4: Pembuatan Kunci Aplikasi & Hubungkan Folder Penyimpanan Gambar

Jalankan perintah ini untuk membuat kunci keamanan aplikasi sekaligus menghubungkan folder penyimpanan aset gambar agar foto nopol atau nota bisa muncul di browser:

```bash
# Generate security key aplikasi
php artisan key:generate

# Bersihkan sisa memori cache konfigurasi lama
php artisan config:clear

# Hubungkan folder storage internal ke folder public (Storage Link)
php artisan storage:link
```

### Langkah 5: Pembangunan Struktur Tabel Database (Migrasi)

Tembak seluruh skema tabel ERD final operasional Arjuna Trans ke dalam server database MySQL Anda:

```bash
php artisan migrate
```

### Langkah 6: Menyalankan Mesin Server Aplikasi

Buka dua tab terminal VS Code Anda, lalu jalankan dua perintah utama ini secara bersamaan untuk menyalakan website:

```bash
# Pada Terminal Tab 1: Nyalakan Server Back-End Laravel
php artisan serve

# Pada Terminal Tab 2: Nyalakan Compiler Front-End React Vite
npm run dev
```

Buka web browser Anda, lalu masuk ke alamat **`http://127.0.0.1:8000`**. Aplikasi resmi aktif dan siap digunakan murni 0 Problems!
