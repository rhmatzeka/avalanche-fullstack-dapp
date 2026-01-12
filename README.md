# ❄️ Avalanche dApp Portal - Web3 Connection Task

Proyek ini adalah implementasi sistem autentikasi Web3 sederhana menggunakan Core Wallet untuk berinteraksi dengan jaringan **Avalanche Fuji Testnet**. Dokumentasi ini mencakup penyelesaian seluruh rangkaian tugas dari Task 1 hingga Task 4.

## 📝 Detail Tugas

### Task 1: Wallet Connection
- [x] Implementasi tombol "Connect Wallet".
- [x] Request izin akses wallet (`eth_requestAccounts`).
- [x] Pengambilan alamat wallet publik.
- [x] Penyimpanan data wallet ke dalam State JavaScript.

### Task 2: Network Validation
- [x] Deteksi Chain ID secara otomatis menggunakan provider.
- [x] Validasi status jaringan:
  - **Connected**: Jika terhubung ke Avalanche Fuji (`0xa869`).
  - **Wrong Network**: Jika terhubung ke jaringan selain Fuji.

### Task 3: UI Display
- [x] Menampilkan data dinamis di antarmuka pengguna:
  - Alamat Wallet.
  - Saldo (Balance) dalam unit AVAX.
  - Nama Jaringan.
  - Status Koneksi (Badge indikator).
- [x] Penambahan identitas peserta (Nama & NIM) di dalam kartu informasi.

### Task 4: Improvement (Optimasi)
- [x] **Disable Button**: Tombol otomatis terkunci setelah berhasil koneksi.
- [x] **Shorten Address**: Format alamat ringkas (contoh: `0x1234...abcd`).
- [x] **Event Listeners**:
  - `accountsChanged`: Update otomatis saat user mengganti akun di wallet.
  - `chainChanged`: Auto-refresh saat user berpindah jaringan.
- [x] **UI Error Handling**: Notifikasi error kustom yang menggantikan alert standar.

## 🎨 Desain Antarmuka
Aplikasi menggunakan tema **Modern Dark Glassmorphism** dengan fitur:
- Efek blur transparansi tinggi.
- Animasi latar belakang dinamis (Floating Blobs).
- Layout sepenuhnya responsif (bisa dibuka di HP maupun Desktop).

## 🛠️ Cara Menggunakan
1. Buka `index.html` menggunakan browser yang memiliki ekstensi **Core Wallet**.
2. Pastikan wallet sudah dalam mode jaringan **Avalanche Fuji Testnet**.
3. Klik tombol **Connect Core Wallet**.
4. Izinkan koneksi pada pop-up wallet yang muncul.

---

## 👤 Identitas Peserta
- **Nama Lengkap:** Rahmat Eka Satria
- **NIM:** 231011402890
