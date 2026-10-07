# 🔐 KELOMPOK 5 - TUGAS UK1

### Implementasi 7 Algoritma Kriptografi Klasik Berbasis Web (SANDI KLASIK-BENGKEL CIPHER)

**Sandi Klasik - Bengkel Cipher** merupakan aplikasi berbasis web yang dibuat untuk memenuhi tugas mata kuliah **Kriptografi**.

Aplikasi ini digunakan untuk melakukan proses **enkripsi dan dekripsi teks maupun file** menggunakan tujuh algoritma kriptografi klasik.

Project ini dikembangkan menggunakan **Python dan Flask** sebagai backend serta **HTML, CSS, dan JavaScript** sebagai frontend.

---

# 👥 Anggota Kelompok

| No | Nama | NIM |
|:--:|:---|:---:|
| 1 | **Azfa Rahma Putra Susanto** | **L0324008** |
| 2 | **Hammam Ibnu Adi'abdillah** | **L0324015** |
| 3 | **Indra Fata Azhari** | **L0324017** |

**Kelompok 5**  
**Program Studi Informatika**  
**Universitas Sebelas Maret (UNS)**

---

# ✨ Fitur

Aplikasi **Sandi Klasik - Bengkel Cipher** menyediakan beberapa fitur utama:

- 🔐 Enkripsi teks
- 🔓 Dekripsi teks
- 📁 Enkripsi file
- 📂 Dekripsi file
- 🔑 Penggunaan key sesuai algoritma
- 🎲 Generate key untuk algoritma tertentu
- 📋 Copy hasil enkripsi/dekripsi
- 💾 Simpan hasil ke file
- 🔄 Menggunakan hasil sebagai input kembali
- 🖱️ Upload file dengan drag & drop
- 📊 Tampilan pemetaan alfabet
- 📱 Tampilan responsif
- 🔢 Dukungan pemrosesan karakter dan byte

---

# 🔢 Algoritma Kriptografi

Aplikasi mengimplementasikan **7 algoritma kriptografi klasik**, yaitu:

1. Shift Cipher
2. Substitution Cipher
3. Affine Cipher
4. Vigenere Cipher
5. Hill Cipher
6. Permutation Cipher
7. One-Time Pad (OTP)

---

## 1. Shift Cipher

Shift Cipher melakukan pergeseran setiap karakter berdasarkan nilai key tertentu.

Rumus enkripsi:

```text
C = (P + k) mod 26
```

Rumus dekripsi:

```text
P = (C - k) mod 26
```

Contoh:

```text
Plaintext  : HELLO
Key        : 3
Ciphertext : KHOOR
```

---

## 2. Substitution Cipher

Substitution Cipher mengganti setiap huruf dengan huruf lain berdasarkan pemetaan alfabet.

Contoh format key:

```text
XYWIGCTSZFPQBDKNHAMUJORVEL
```

Pemetaan alfabet:

```text
ABCDEFGHIJKLMNOPQRSTUVWXYZ
XYWIGCTSZFPQBDKNHAMUJORVEL
```

Setiap huruf pada baris pertama dipetakan ke huruf yang berada pada posisi yang sama pada baris kedua.

---

## 3. Affine Cipher

Affine Cipher menggunakan operasi matematika modulo 26 dalam proses enkripsi dan dekripsi.

Rumus enkripsi:

```text
C = (aP + b) mod 26
```

Rumus dekripsi:

```text
P = a⁻¹(C - b) mod 26
```

Nilai `a` harus memiliki invers modulo 26 agar proses dekripsi dapat dilakukan.

---

## 4. Vigenere Cipher

Vigenere Cipher merupakan cipher polialfabetik yang menggunakan kata atau karakter sebagai key.

Key akan digunakan berulang sesuai dengan panjang pesan.

Contoh:

```text
Plaintext : HELLOWORLD
Key       : KEY
```

Key akan diterapkan secara berulang terhadap plaintext.

---

## 5. Hill Cipher

Hill Cipher menggunakan operasi matriks dalam proses enkripsi dan dekripsi.

Algoritma ini menggunakan matriks sebagai key dan melakukan operasi matematika modulo 26 terhadap blok karakter.

---

## 6. Permutation Cipher

Permutation Cipher merupakan metode transposisi yang mengubah posisi karakter berdasarkan urutan permutasi tertentu.

Contoh key:

```text
3 1 4 2
```

Urutan karakter dalam setiap blok akan diubah berdasarkan permutasi tersebut.

---

## 7. One-Time Pad (OTP)

One-Time Pad atau OTP menggunakan key dalam proses enkripsi dan dekripsi.

OTP dapat digunakan untuk pemrosesan data teks maupun data berbasis byte.

Untuk keamanan OTP secara teori, key harus memiliki panjang yang sesuai dengan pesan, bersifat acak, dan tidak digunakan kembali.

---

# 📝 Mode Teks

Mode **Teks** digunakan untuk melakukan proses enkripsi dan dekripsi terhadap teks secara langsung.

Alur penggunaan:

```text
Input Teks
    ↓
Pilih Algoritma
    ↓
Pilih Enkripsi / Dekripsi
    ↓
Masukkan Key
    ↓
Proses
    ↓
Hasil
```

Hasil proses akan ditampilkan pada bagian output aplikasi.

---

# 📂 Mode File

Mode **File** digunakan untuk melakukan proses enkripsi dan dekripsi terhadap file.

Pengguna dapat memasukkan file melalui:

- Pemilihan file
- Drag & drop

Alur penggunaan:

```text
Upload File
    ↓
Pilih Algoritma
    ↓
Pilih Enkripsi / Dekripsi
    ↓
Masukkan Key
    ↓
Proses
    ↓
Simpan File
```

Setelah proses selesai, hasil file dapat disimpan menggunakan tombol **Simpan File**.

---

# 🛠️ Teknologi yang Digunakan

| Teknologi | Kegunaan |
|---|---|
| **Python** | Bahasa pemrograman utama |
| **Flask** | Backend dan web server |
| **HTML5** | Struktur halaman web |
| **CSS3** | Styling dan layout |
| **JavaScript** | Interaksi dan proses frontend |
| **Visual Studio Code** | Code editor |

---

# 📋 Persyaratan Sistem

Sebelum menjalankan project, pastikan perangkat sudah memiliki:

- **Python 3.10 atau lebih baru**
- **pip**
- **Web browser**
- **Git** (opsional)
- **Visual Studio Code** (opsional)

Browser yang dapat digunakan:

- Google Chrome
- Microsoft Edge
- Mozilla Firefox

---

# ⚙️ Instalasi

## 1. Clone Repository

Jika project tersedia di GitHub, clone repository dengan perintah:

```bash
git clone https://github.com/USERNAME/NAMA-REPOSITORY.git
```

Masuk ke folder project:

```bash
cd NAMA-REPOSITORY
```

> Jika project didownload dalam bentuk ZIP, ekstrak ZIP kemudian buka folder project menggunakan Visual Studio Code.

---

## 2. Buka Terminal

Pada Visual Studio Code, buka terminal melalui:

```text
Terminal → New Terminal
```

Pastikan terminal berada di folder utama project yang berisi:

```text
app.py
static/
templates/
requirements.txt
```

---

## 3. Mengecek Instalasi Python

Cek versi Python:

```bash
python --version
```

Contoh:

```text
Python 3.13.3
```

Kemudian cek pip:

```bash
pip --version
```

Jika kedua perintah tersebut berhasil, Python dan pip sudah siap digunakan.

---

# 🐍 Membuat Virtual Environment

Untuk membuat lingkungan Python terpisah, jalankan:

```bash
python -m venv .venv
```

Perintah tersebut akan membuat folder:

```text
.venv/
```

Virtual environment digunakan agar dependency project tidak bercampur dengan instalasi Python utama.

---

# ▶️ Mengaktifkan Virtual Environment

## Windows PowerShell

Jalankan:

```powershell
.venv\Scripts\Activate.ps1
```

Jika berhasil, terminal akan menampilkan:

```text
(.venv)
```

Contoh:

```text
(.venv) PS C:\...\UK 1>
```

---

## Windows Command Prompt

Jika menggunakan Command Prompt:

```cmd
.venv\Scripts\activate
```

---

# 📦 Install Dependency

Setelah virtual environment aktif, install seluruh dependency yang dibutuhkan menggunakan:

```bash
pip install -r requirements.txt
```

File `requirements.txt` berisi library yang dibutuhkan oleh project.

Untuk memastikan Flask sudah terinstall, dapat digunakan:

```bash
pip show flask
```

---

# ▶️ Menjalankan Program

Setelah seluruh dependency terinstall, jalankan:

```bash
python app.py
```

Jika berhasil, terminal akan menampilkan alamat server Flask, misalnya:

```text
* Running on http://127.0.0.1:5000
```

Kemudian buka browser dan akses:

```text
http://127.0.0.1:5000
```

atau:

```text
http://localhost:5000
```

Aplikasi **Sandi Klasik - Bengkel Cipher** kemudian akan tampil pada browser.

---

# 🛑 Menghentikan Program

Untuk menghentikan server Flask, kembali ke terminal kemudian tekan:

```text
CTRL + C
```

Server Flask akan berhenti.

---

# 🖥️ Cara Menggunakan Aplikasi

## 🔐 Enkripsi Teks

Langkah-langkah:

1. Buka aplikasi melalui browser.
2. Pilih algoritma yang ingin digunakan.
3. Pilih mode **Enkripsi**.
4. Pilih tipe **Teks**.
5. Masukkan key sesuai algoritma.
6. Masukkan plaintext pada kolom input.
7. Klik tombol proses.
8. Hasil ciphertext akan ditampilkan pada bagian output.

---

## 🔓 Dekripsi Teks

Langkah-langkah:

1. Pilih algoritma yang sama dengan saat proses enkripsi.
2. Pilih mode **Dekripsi**.
3. Pilih tipe **Teks**.
4. Masukkan key yang sesuai.
5. Masukkan ciphertext.
6. Klik tombol proses.
7. Hasil plaintext akan ditampilkan pada bagian output.

> **Penting:** Key yang digunakan pada proses dekripsi harus sesuai dengan key yang digunakan saat proses enkripsi.

---

# 📁 Enkripsi File

Langkah-langkah untuk melakukan enkripsi file:

1. Pilih algoritma.
2. Pilih mode **Enkripsi**.
3. Pilih tipe **File**.
4. Upload file melalui area upload atau drag & drop.
5. Masukkan key.
6. Jalankan proses.
7. Tunggu hingga proses selesai.
8. Klik **Simpan File** untuk menyimpan hasil enkripsi.

---

# 📂 Dekripsi File

Langkah-langkah untuk melakukan dekripsi file:

1. Pilih algoritma yang sama.
2. Pilih mode **Dekripsi**.
3. Pilih tipe **File**.
4. Upload file hasil enkripsi.
5. Masukkan key yang sama.
6. Jalankan proses.
7. Tunggu hingga proses selesai.
8. Klik **Simpan File** untuk menyimpan hasil dekripsi.

Jika algoritma dan key yang digunakan sesuai, hasil dekripsi dapat dikembalikan menjadi data asli.

---

# 🔑 Contoh Pengujian Substitution Cipher

Salah satu pengujian dilakukan menggunakan **Substitution Cipher**.

Key yang digunakan:

```text
XYWIGCTSZFPQBDKNHAMUJORVEL
```

Pemetaan alfabet:

```text
ABCDEFGHIJKLMNOPQRSTUVWXYZ
XYWIGCTSZFPQBDKNHAMUJORVEL
```

Plaintext:

```text
SUBSTITUTION CIPHERS
```

Hasil enkripsi:

```text
MJYMUZUJUZKD WZNSGAM
```

Untuk mengembalikan ciphertext tersebut, digunakan konfigurasi:

```text
Cipher : Substitution
Mode   : Dekripsi
Type   : Teks
Key    : XYWIGCTSZFPQBDKNHAMUJORVEL
```

Hasil dekripsi:

```text
SUBSTITUTION CIPHERS
```

Pengujian tersebut menunjukkan bahwa ciphertext dapat dikembalikan menjadi plaintext dengan menggunakan key yang sesuai.

---

# 🧪 Pengujian Sistem

Pengujian aplikasi dilakukan melalui beberapa skenario.

## 1. Pengujian Enkripsi

Memastikan plaintext dapat diubah menjadi ciphertext.

```text
Plaintext
    ↓
Enkripsi
    ↓
Ciphertext
```

---

## 2. Pengujian Dekripsi

Memastikan ciphertext dapat dikembalikan menjadi plaintext.

```text
Ciphertext
    ↓
Dekripsi
    ↓
Plaintext
```

---

## 3. Pengujian Key

Memastikan setiap algoritma dapat menerima key sesuai dengan ketentuan masing-masing.

---

## 4. Pengujian File

Memastikan file dapat:

```text
File Asli
    ↓
Enkripsi
    ↓
File Terenkripsi
    ↓
Dekripsi
    ↓
File Asli Kembali
```

---

## 5. Pengujian Reversibilitas

Pengujian dilakukan dengan membandingkan data sebelum enkripsi dengan data setelah proses dekripsi.

```text
Data Asli
    ↓
Enkripsi
    ↓
Ciphertext
    ↓
Dekripsi
    ↓
Data Hasil
```

Hasil dekripsi diharapkan sama dengan data asli.

---

# 📂 Struktur Project

Struktur project terbaru:

```text
UK 1/
│
├── .venv/
│   ├── Include/
│   ├── Lib/
│   ├── Scripts/
│   └── pyvenv.cfg
│
├── static/
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       └── app.js
│
├── templates/
│   └── index.html
│
├── .gitignore
├── app.py
├── requirements.txt
└── README.md
```

## Keterangan Struktur Project

| File / Folder | Fungsi |
|---|---|
| `.venv/` | Virtual environment Python |
| `static/` | Menyimpan file statis aplikasi |
| `static/css/style.css` | Mengatur tampilan dan layout aplikasi |
| `static/js/app.js` | Mengatur interaksi dan proses frontend |
| `templates/index.html` | Halaman utama aplikasi |
| `.gitignore` | Menentukan file/folder yang tidak diunggah ke Git |
| `app.py` | Backend Flask dan proses kriptografi |
| `requirements.txt` | Daftar dependency Python |
| `README.md` | Dokumentasi project |

> **Catatan:** Folder `.venv/` hanya digunakan untuk environment Python lokal. Folder tersebut tidak perlu diunggah ke GitHub karena sudah dikecualikan melalui `.gitignore`.

---

# 🔄 Alur Sistem

Secara umum, alur aplikasi adalah:

```text
                 ┌─────────────────┐
                 │     Pengguna    │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Pilih Algoritma │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Pilih Mode      │
                 │ Enkripsi/Dekripsi│
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │  Teks / File    │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │      Key        │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │  Proses Cipher  │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │      Hasil      │
                 └─────────────────┘
```

---

# 🔐 Konsep Dasar

Project ini digunakan untuk mempelajari beberapa konsep dasar dalam kriptografi, antara lain:

- Plaintext
- Ciphertext
- Key
- Enkripsi
- Dekripsi
- Substitusi
- Transposisi
- Operasi modulo
- Kriptografi monoalfabetik
- Kriptografi polialfabetik

Proses dasar kriptografi dapat digambarkan sebagai:

```text
             KEY
              │
              ▼
Plaintext ──► ENKRIPSI ──► Ciphertext
                               │
                               │
                              KEY
                               │
                               ▼
                         DEKRIPSI
                               │
                               ▼
                           Plaintext
```

---

# ⚠️ Catatan

Project ini dibuat untuk **keperluan pembelajaran mata kuliah Kriptografi**.

Algoritma kriptografi klasik yang digunakan pada project ini bertujuan untuk membantu memahami konsep dasar enkripsi, dekripsi, algoritma, dan penggunaan key.

Implementasi kriptografi klasik pada project ini **tidak ditujukan sebagai pengganti algoritma kriptografi modern untuk mengamankan data sensitif pada sistem nyata**.

---

# 👨‍💻 Kelompok 5

### Sandi Klasik — Bengkel Cipher

**Mata Kuliah:** Kriptografi  
**Program Studi:** Informatika  
**Universitas Sebelas Maret (UNS)**  
**Kelompok:** 5  
**Tahun:** 2026

### Anggota

- **Azfa Rahma Putra Susanto** — L0324008
- **Hammam Ibnu Adi'abdillah** — L0324015
- **Indra Fata Azhari** — L0324017

---

# 📌 Kesimpulan

**Sandi Klasik - Bengkel Cipher** merupakan aplikasi kriptografi berbasis web yang mengimplementasikan tujuh algoritma kriptografi klasik:

1. **Shift Cipher**
2. **Substitution Cipher**
3. **Affine Cipher**
4. **Vigenere Cipher**
5. **Hill Cipher**
6. **Permutation Cipher**
7. **One-Time Pad (OTP)**

Aplikasi mendukung proses **enkripsi dan dekripsi teks maupun file**, serta menyediakan fitur pengelolaan key, upload file, penyimpanan hasil, dan antarmuka interaktif.

Project ini diharapkan dapat membantu pengguna memahami konsep dasar kriptografi klasik melalui implementasi secara langsung menggunakan aplikasi berbasis web.
