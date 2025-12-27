-- ///////////////////////////// Bagian User Profile untuk Login

-- 1. Membuat tabel user_profiles
create table public.user_profiles (
  -- Menggunakan ID yang sama dengan auth.users
  id uuid references auth.users on delete cascade not null primary key,
  
  -- Kolom role, default 'pengunjung'
  role text default 'pengunjung',
  
  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Mengaktifkan RLS (Wajib di Supabase agar aman)
alter table public.user_profiles enable row level security;

-- Membuat fungsi trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, role)
  values (new.id, 'pengunjung'); -- Default role masuk sini
  return new;
end;
$$ language plpgsql security definer;

-- Memicu fungsi setiap kali ada user sign up
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Siapa saja (termasuk user yang tidak login) bisa MELIHAT data
create policy "Profil bisa dilihat publik"
on public.user_profiles for select
using (true);

-- Hanya user pemilik akun yang bisa MENAMBAH/MENGUBAH datanya sendiri
create policy "User bisa edit profil sendiri"
on public.user_profiles for all
using (auth.uid() = id)
with check (auth.uid() = id);

-- ///////////////////////////// Akhir Tabel

-- ///////////////////////////// Tabel Profile Admin
-- 1. Membuat tabel admin_profiles
create table public.admin_profiles (
  -- ID ini sekaligus Foreign Key ke user_profiles
  id uuid references public.user_profiles(id) on delete cascade not null primary key,
  
  -- Kolom khusus admin (contoh saja)
  admin_code text,
  department text default 'General',
  
  -- Timestamp
  created_at timestamptz default now()
);

alter table public.admin_profiles
  add column nama_admin text,
  add column no_hp text,       -- Gunakan text agar angka '0' di depan tidak hilang
  add column foto_profile text, -- Nanti akan diisi URL gambar dari Storage
  add column jenis_kelamin text,
  
  -- Saya sarankan dipisah agar nanti mudah diformat di Next.js (misal: 17 Agustus 1945)
  add column tempat_lahir text,
  add column tanggal_lahir date, 
  
  add column deskripsi_profile text;

-- 2. Mengaktifkan RLS
alter table public.admin_profiles enable row level security;

-- 2. SQL Query: RLS Khusus Admin (Kunci Utama)
create policy "Hanya Admin yang bisa CRUD"
on public.admin_profiles
for all
using (
  exists (
    select 1 from public.user_profiles
    where id = auth.uid() -- Cek user yang sedang login
    and role = 'admin'    -- Pastikan rolenya admin
  )
)
with check (
  exists (
    select 1 from public.user_profiles
    where id = auth.uid()
    and role = 'admin'
  )
);

-- ///////////////////////////// Akhir Tabel Profile admin


-- ///////////////////////////// Tabel Portofolio
-- 1. Tabel Portfolio
create table public.portfolios (
  id uuid default gen_random_uuid() primary key,
  
  -- Relasi ke tabel admin_profiles
  -- on delete cascade: jika admin dihapus, portfolionya ikut terhapus
  admin_id uuid references public.admin_profiles(id) on delete cascade not null,
  
  nama_portfolio text not null,
  jenis_proyek text,      -- Contoh: "Web App", "Mobile App"
  kategori_proyek text,   -- Contoh: "Frontend", "Backend", "Fullstack"
  
  -- Array of text: Cocok untuk tags teknologi
  teknologi text,       -- Contoh input di DB: '{Next.js, Supabase, Tailwind}'
  
  deskripsi_singkat text,         -- Ringkasan pendek untuk Card
  lama_pengerjaan text,   -- Contoh: "3 Minggu"
  periode text,           -- Contoh: "Jan - Feb 2025"
  deskripsi_proyek text,  -- Penjelasan detail (bisa format Markdown/Rich Text)
  
  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Mengaktifkan RLS
alter table public.portfolios enable row level security;

-- 2. SQL Query: RLS (Keamanan)
-- 1. Kebijakan PUBLIC (Siapa saja boleh baca/SELECT)
create policy "Siapa saja boleh lihat portfolio"
on public.portfolios
for select
using (true);

-- 2. Kebijakan ADMIN (Hanya admin boleh Insert/Update/Delete)
create policy "Hanya Admin boleh kelola portfolio"
on public.portfolios
for all
using (
  -- Cek apakah user yang login memiliki role 'admin' di tabel user_profiles
  exists (
    select 1 from public.user_profiles
    where id = auth.uid()
    and role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.user_profiles
    where id = auth.uid()
    and role = 'admin'
  )
);

-- ///////////////////////////// Akhir Tabel Portofolio

-- ///////////////////////////// Tabel Pengalaman
create table public.experiences (
  id uuid default gen_random_uuid() primary key,
  
  -- Foreign Key ke tabel admin_profiles
  -- Jika admin dihapus, data pengalaman juga terhapus (cascade)
  admin_id uuid references public.admin_profiles(id) on delete cascade not null,
  
  posisi text not null,           -- Contoh: "Frontend Developer"
  jenis_pekerjaan text,           -- Contoh: "Full-time", "Internship", "Freelance"
  perusahaan text not null,       -- Contoh: "Tokopedia", "Google"
  periode text,                   -- Contoh: "Jan 2024 - Sekarang"
  lama_bekerja text,              -- Contoh: "1 Tahun 2 Bulan"
  lokasi text,                    -- Contoh: "Jakarta Selatan (Hybrid)"
  
  deskripsi text,                 -- Penjelasan jobdesc (bisa panjang)
  
  -- Array of text: Untuk tags skill
  keahlian text,                -- Contoh input: '{React, TypeScript, Scrum}'
  
  link_proyek text,               -- Opsional: Jika ada link hasil kerja di perusahaan itu
  
  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Mengaktifkan RLS
alter table public.experiences enable row level security;

-- RLS (Row Level Security)
-- 1. Kebijakan PUBLIC (Siapa saja boleh baca)
create policy "Siapa saja boleh lihat pengalaman"
on public.experiences
for select
using (true);

-- 2. Kebijakan ADMIN (Hanya admin boleh Insert/Update/Delete)
create policy "Hanya Admin boleh kelola pengalaman"
on public.experiences
for all
using (
  -- Cek role user di tabel user_profiles
  exists (
    select 1 from public.user_profiles
    where id = auth.uid()
    and role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.user_profiles
    where id = auth.uid()
    and role = 'admin'
  )
);

-- ///////////////////////////// Akhir Tabel Pengalaman

-- ///////////////////////////// Tabel Pendidikan
create table public.educations (
  id uuid default gen_random_uuid() primary key,
  
  -- Foreign Key ke tabel admin_profiles
  -- on delete cascade: jika data admin dihapus, data pendidikan ikut hilang
  admin_id uuid references public.admin_profiles(id) on delete cascade not null,
  
  tempat_pendidikan text not null,  -- Contoh: "Universitas Indonesia"
  gelar text,                       -- Contoh: "Sarjana Komputer (S.Kom)"
  bidang_studi text,                -- Contoh: "Teknik Informatika"
  periode text,                     -- Contoh: "2019 - 2023"
  
  -- Saya gunakan TEXT untuk nilai, agar fleksibel (bisa "3.8/4.0" atau "Cum Laude")
  nilai text,                       
  
  kegiatan_sosial text,             -- Deskripsi aktivitas/organisasi (OSIS, BEM, UKM)
  
  -- Array of text: Untuk skill spesifik yang dipelajari di kampus/sekolah
  keahlian_pendidikan text,       -- Contoh input DB: '{Algoritma, Database, Jaringan}'
  
  deskripsi text,                   -- Cerita singkat tentang masa studi/judul skripsi
  link_institusi text,              -- Link website kampus/sekolah
  
  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Mengaktifkan RLS (Wajib)
alter table public.educations enable row level security;

-- 1. Kebijakan PUBLIC (Siapa saja boleh baca)
create policy "Siapa saja boleh lihat pendidikan"
on public.educations
for select
using (true);

-- 2. Kebijakan ADMIN (Hanya admin boleh Insert/Update/Delete)
create policy "Hanya Admin boleh kelola pendidikan"
on public.educations
for all
using (
  -- Cek role user di tabel user_profiles
  exists (
    select 1 from public.user_profiles
    where id = auth.uid()
    and role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.user_profiles
    where id = auth.uid()
    and role = 'admin'
  )
);

-- ///////////////////////////// Akhir Tabel Pendidikan

-- ///////////////////////////// Tabel Sertifikat
create table public.certificates (
  id uuid default gen_random_uuid() primary key,
  
  -- Foreign Key ke tabel admin_profiles
  -- on delete cascade: jika admin dihapus, sertifikat ikut terhapus
  admin_id uuid references public.admin_profiles(id) on delete cascade not null,
  
  nama_sertifikat text not null,       -- Contoh: "AWS Certified Cloud Practitioner"
  organisasi_sertifikat text not null, -- Contoh: "Amazon Web Services"
  periode_sertifikat text,             -- Contoh: "Berlaku s.d. Jan 2027" atau "Agustus 2024"
  no_sertifikat text,                  -- Credential ID / No. Sertifikat
  
  foto_sertifikat text,                -- URL Gambar/PDF sertifikat dari Supabase Storage
  
  -- Array of text: Skill yang divalidasi sertifikat ini
  keahlian text,                     -- Contoh: '{Cloud Computing, AWS, Security}'
  
  link_organisasi text,                -- Link verifikasi atau website penerbit
  deskripsi_sertifikat text,           -- Penjelasan singkat tentang sertifikat
  
  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Mengaktifkan RLS (Wajib)
alter table public.certificates enable row level security;

-- 1. Kebijakan PUBLIC (Siapa saja boleh baca)
create policy "Siapa saja boleh lihat sertifikat"
on public.certificates
for select
using (true);

-- 2. Kebijakan ADMIN (Hanya admin boleh Insert/Update/Delete)
create policy "Hanya Admin boleh kelola sertifikat"
on public.certificates
for all
using (
  -- Cek role user di tabel user_profiles
  exists (
    select 1 from public.user_profiles
    where id = auth.uid()
    and role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.user_profiles
    where id = auth.uid()
    and role = 'admin'
  )
);

-- ///////////////////////////// Akhir Tabel Sertifikat