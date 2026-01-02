# 🌐 Aziz Alhadiid - Personal Portfolio Website

![Next.js](https://img.shields.io/badge/Next.js-14+-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

Website portofolio pribadi modern yang dibangun dengan **Next.js 16 (App Router)**, didukung oleh **Supabase** sebagai database backend, dan **Tailwind CSS** untuk styling yang responsif dan estetis.

## ✨ Fitur Unggulan (Gacor Features)

### 🎨 Frontend & UI/UX
- **Desain Modern & Responsif:** Menggunakan konsep Glassmorphism, animasi halus, dan layout grid yang rapi di semua perangkat (Mobile, Tablet, Desktop).
- **Dwibahasa (ID/EN):** Mendukung Bahasa Indonesia dan Inggris secara dinamis menggunakan React Context API.
- **Scroll Spy Navigation:** Navigasi aktif otomatis mengikuti posisi scroll halaman.
- **Smart Active Link:** Logika navigasi cerdas yang mendeteksi path URL dan Hash link.

### 🚀 Fungsionalitas
- **Dynamic Portfolio & Certificates:**
  - Filter kategori proyek & penerbit sertifikat secara otomatis.
  - Pencarian real-time (Search) tanpa reload.
  - Pagination client-side yang mulus.
- **Detail Proyek Dinamis:** Halaman detail (`[id]`) yang mengambil data lengkap dari database, dengan validasi link demo/repo.
- **Kontak Terintegrasi:**
  - Formulir kontak yang menyimpan pesan langsung ke database Supabase.
  - Tombol WhatsApp Floating & Direct Chat.
  - Keamanan RLS (Row Level Security) untuk melindungi data.
- **Downloadable CV:** Fitur unduh CV langsung dari halaman About.

### 🗄️ Backend (Supabase)
- **Tables:** `user_profiles`, `admin_profiles`, `educations`, `experiences`, `portfolios`, `certificates`, `contact_messages`.
- **Storage:** Bucket untuk menyimpan foto profil, gambar proyek, dan bukti sertifikat.
- **Security:** Implementasi RLS (Row Level Security) agar hanya admin yang bisa memodifikasi data, sementara publik hanya bisa membaca (SELECT) dan mengirim pesan (INSERT).

## 🛠️ Teknologi yang Digunakan

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Database & Auth:** [Supabase](https://supabase.com/)
- **State Management:** React Context API & Hooks

## 🚀 Cara Menjalankan Project (Local)

Ikuti langkah-langkah ini untuk menjalankan proyek di komputer lokal:

### 1. Clone Repository
```bash
git clone https://github.com/azizhadiid/hadiidaziz.git
cd nama-repo
```

### 2. Install Dependencies
```bash
npm install
# atau
yarn install
```

### 3. Setup Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Setup Database
```bash
Jalankan query SQL yang ada di file query.sql pada SQL Editor di Dashboard Supabase kamu untuk membuat tabel dan mengatur kebijakan keamanan (RLS).
```

### 5. Jalankan Development Server
```bash
npm run dev
# Buka Browser Masing2
Buka http://localhost:3000 di browser kamu.
```

## 📬 Kontak
Jika kamu tertarik untuk bekerja sama atau memiliki pertanyaan, silakan hubungi melalui form kontak di website ini atau email langsung ke azizalhadiid55@gmail.com.