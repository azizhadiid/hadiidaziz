'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Briefcase,
    Camera,
    Save,
    Building,
    Hash,
    AlignLeft,
    Loader2,
    UploadCloud
} from 'lucide-react';
import MainLayoutAdmin from '@/components/layout/MainLayoutAdmin';
import supabase from '@/lib/db';
import toast from 'react-hot-toast';

// 1. Definisi Tipe Data (Sesuai kolom di DB admin_profiles)
interface AdminProfile {
    id?: string; // Optional karena diambil dari Auth
    nama_admin: string;
    no_hp: string;
    foto_profile: string;
    jenis_kelamin: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    department: string;
    admin_code: string;
    deskripsi_profile: string;
}

export default function AdminProfilePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [email, setEmail] = useState(''); // Email diambil terpisah dari Auth User
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    // State Form
    const [profile, setProfile] = useState<AdminProfile>({
        nama_admin: '',
        no_hp: '',
        foto_profile: '',
        jenis_kelamin: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        department: '',
        admin_code: '',
        deskripsi_profile: ''
    });

    // 2. Fetch Data saat halaman dimuat
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // A. Ambil User Auth (Untuk ID & Email)
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) return; // Middleware akan handle redirect jika null
                setEmail(user.email || '');

                // B. Ambil Data dari tabel admin_profiles
                const { data, error } = await supabase
                    .from('admin_profiles')
                    .select('*')
                    .eq('id', user.id)
                    .maybeSingle();

                if (error && error.code !== 'PGRST116') {
                    // PGRST116 = Data tidak ditemukan (wajar jika baru pertama kali)
                    console.error('Error fetching profile:', error);
                }

                // C. Jika data ada, isi state. Jika tidak, biarkan default kosong.
                if (data) {
                    setProfile({
                        nama_admin: data.nama_admin || '',
                        no_hp: data.no_hp || '',
                        foto_profile: data.foto_profile || '',
                        jenis_kelamin: data.jenis_kelamin || '',
                        tempat_lahir: data.tempat_lahir || '',
                        tanggal_lahir: data.tanggal_lahir || '',
                        department: data.department || '',
                        admin_code: data.admin_code || '',
                        deskripsi_profile: data.deskripsi_profile || ''
                    });
                }

            } catch (err) {
                console.error('Unexpected error:', err);
            } finally {
                setIsFetching(false);
            }
        };

        fetchProfile();
    }, []);

    // 3. Handler Perubahan Input Text
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    // 4. Handler Upload Foto
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!e.target.files || e.target.files.length === 0) {
                return;
            }
            const file = e.target.files[0];

            // Validasi Ukuran (Max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Ukuran foto maksimal 2MB!');
                return;
            }

            setUploading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("User tidak ditemukan");

            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload ke Supabase Storage (Bucket: avatars)
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Dapatkan URL Publik
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // Update State Foto
            setProfile(prev => ({ ...prev, foto_profile: publicUrl }));
            toast.success('Foto berhasil diupload!');

        } catch (error: any) {
            console.error('Error uploading image:', error);
            toast.error('Gagal upload gambar.');
        } finally {
            setUploading(false);
        }
    };

    // 5. Handler Simpan Data (Upsert)
    const handleSave = async () => {
        setIsLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Sesi habis, silakan login ulang.");

            // Validasi Sederhana
            if (!profile.nama_admin) {
                toast.error("Nama lengkap wajib diisi.");
                setIsLoading(false);
                return;
            }

            // Upsert: Update jika ID ada, Insert jika tidak
            const { error } = await supabase
                .from('admin_profiles')
                .upsert({
                    id: user.id, // KUNCI UTAMA: ID admin_profiles = ID Auth User
                    ...profile,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;

            toast.success('Profil berhasil diperbarui!');
        } catch (error: any) {
            console.error('Error saving profile:', error);
            toast.error('Gagal menyimpan profil: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <MainLayoutAdmin>
                <div className="flex h-screen items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                </div>
            </MainLayoutAdmin>
        );
    }

    return (
        <MainLayoutAdmin>
            {/* --- NEW: BACKGROUND BANNER FULL WIDTH --- */}
            {/* Ini adalah layer background oranye yang menutupi bagian atas halaman */}
            <div className="absolute inset-x-0 top-0 h-80 bg-linear-to-r from-orange-500 to-orange-600 shadow-inner"></div>

            {/* Wrapper Konten Utama (Relative agar berada di atas background) */}
            <div className="relative z-10">

                {/* Header Section (Teks diubah jadi putih) */}
                <div className="mb-8 pt-4">
                    <h1 className="text-3xl font-bold text-white">Profil Saya</h1>
                    <p className="text-orange-50 text-sm mt-1">Kelola informasi pribadi dan pengaturan akun Anda.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* --- KOLOM KIRI: FOTO & RINGKASAN --- */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Card dibuat overflow-visible agar foto bisa menyembul keluar */}
                        {/* Ditambah mt-16 agar kartu turun sedikit memberi ruang untuk foto */}
                        <Card className="border-0 shadow-2xl overflow-visible mt-16 bg-white/95 backdrop-blur-xs">
                            {/* Spanduk oranye DI DALAM card DIHAPUS */}

                            {/* Padding atas diset 0 karena foto menggunakan negative margin besar */}
                            <CardContent className="px-6 pb-8 pt-0 relative">
                                {/* Foto Profil Avatar */}
                                {/* Negative margin diperbesar (-mt-24) agar menyembul lebih tinggi */}
                                <div className="relative -mt-24 mb-6 flex justify-center">
                                    <div className="relative w-44 h-44 rounded-full border-[6px] border-white shadow-2xl overflow-hidden bg-slate-200 group">
                                        {profile.foto_profile ? (
                                            <img
                                                src={profile.foto_profile}
                                                alt={profile.nama_admin}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                                                <User className="w-16 h-16" />
                                            </div>
                                        )}

                                        {/* Tombol Upload Overlay */}
                                        <div
                                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-[2px]"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            {uploading ? (
                                                <Loader2 className="w-10 h-10 text-white animate-spin" />
                                            ) : (
                                                <Camera className="w-10 h-10 text-white drop-shadow-lg" />
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                        />
                                    </div>
                                </div>

                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-1">
                                        {profile.nama_admin || 'Nama Belum Diisi'}
                                    </h2>
                                    <p className="text-sm text-slate-500 font-medium mb-5">
                                        {profile.department || 'Departemen Belum Diisi'}
                                    </p>

                                    <div className="flex justify-center gap-2 mb-8">
                                        <span className="px-4 py-1.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full shadow-xs">
                                            Admin
                                        </span>
                                        <span className="px-4 py-1.5 bg-green-100 text-green-700 text-xs font-bold rounded-full shadow-xs">
                                            Active Account
                                        </span>
                                    </div>

                                    <div className="space-y-4 text-left bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-3 text-sm text-slate-700">
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs shrink-0">
                                                <Mail className="w-4 h-4 text-orange-500" />
                                            </div>
                                            <span className="truncate font-medium" title={email}>{email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-700">
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs shrink-0">
                                                <Hash className="w-4 h-4 text-orange-500" />
                                            </div>
                                            <span className="font-medium">{profile.admin_code || '-'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-700">
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs shrink-0">
                                                <Building className="w-4 h-4 text-orange-500" />
                                            </div>
                                            <span className="font-medium">{profile.department || '-'}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* --- KOLOM KANAN: FORM EDIT DATA --- */}
                    <div className="lg:col-span-2">
                        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-xs">
                            <CardHeader className="border-b border-slate-100 pb-4 bg-slate-50/50 rounded-t-xl">
                                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                        <User className="w-5 h-5 text-orange-600" />
                                    </div>
                                    Edit Informasi Pribadi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 or">
                                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>

                                    {/* Row 1 */}
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="nama_admin" className="text-slate-600 font-medium">Nama Lengkap</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <Input
                                                    id="nama_admin"
                                                    name="nama_admin"
                                                    value={profile.nama_admin}
                                                    onChange={handleChange}
                                                    placeholder="Contoh: Budi Santoso"
                                                    className="pl-11 h-12 rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500 bg-slate-50/30 focus:bg-white transition-colors"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="no_hp" className="text-slate-600 font-medium">Nomor HP / WhatsApp</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <Input
                                                    id="no_hp"
                                                    name="no_hp"
                                                    value={profile.no_hp}
                                                    onChange={handleChange}
                                                    placeholder="0812..."
                                                    className="pl-11 h-12 rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500 bg-slate-50/30 focus:bg-white transition-colors"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Row 2 */}
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="tempat_lahir" className="text-slate-600 font-medium">Tempat Lahir</Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <Input
                                                    id="tempat_lahir"
                                                    name="tempat_lahir"
                                                    value={profile.tempat_lahir}
                                                    onChange={handleChange}
                                                    placeholder="Contoh: Jakarta"
                                                    className="pl-11 h-12 rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500 bg-slate-50/30 focus:bg-white transition-colors"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="tanggal_lahir" className="text-slate-600 font-medium">Tanggal Lahir</Label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <Input
                                                    type="date"
                                                    id="tanggal_lahir"
                                                    name="tanggal_lahir"
                                                    value={profile.tanggal_lahir}
                                                    onChange={handleChange}
                                                    className="pl-11 h-12 rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500 bg-slate-50/30 focus:bg-white transition-colors"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Row 3 */}
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="jenis_kelamin" className="text-slate-600 font-medium">Jenis Kelamin</Label>
                                            <div className="relative">
                                                <select
                                                    id="jenis_kelamin"
                                                    name="jenis_kelamin"
                                                    value={profile.jenis_kelamin}
                                                    onChange={handleChange}
                                                    className="w-full h-12 pl-3 pr-10 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-slate-50/30 focus:bg-white transition-colors appearance-none"
                                                >
                                                    <option value="">Pilih Jenis Kelamin</option>
                                                    <option value="Laki-laki">Laki-laki</option>
                                                    <option value="Perempuan">Perempuan</option>
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="department" className="text-slate-600 font-medium">Departemen</Label>
                                            <div className="relative">
                                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <Input
                                                    id="department"
                                                    name="department"
                                                    value={profile.department}
                                                    onChange={handleChange}
                                                    placeholder="Contoh: IT Development"
                                                    className="pl-11 h-12 rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500 bg-slate-50/30 focus:bg-white transition-colors"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Row 4 */}
                                    <div className="space-y-2">
                                        <Label htmlFor="admin_code" className="text-slate-600 font-medium">Kode Admin</Label>
                                        <div className="relative">
                                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <Input
                                                id="admin_code"
                                                name="admin_code"
                                                value={profile.admin_code}
                                                onChange={handleChange}
                                                placeholder="Contoh: ADM-001"
                                                className="pl-11 h-12 rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500 bg-slate-50/30 focus:bg-white transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {/* Row 5 */}
                                    <div className="space-y-2">
                                        <Label htmlFor="deskripsi_profile" className="text-slate-600 font-medium">Bio / Deskripsi Singkat</Label>
                                        <div className="relative">
                                            <AlignLeft className="absolute left-3 top-4 w-5 h-5 text-slate-400" />
                                            <textarea
                                                id="deskripsi_profile"
                                                name="deskripsi_profile"
                                                rows={4}
                                                value={profile.deskripsi_profile}
                                                onChange={handleChange}
                                                className="w-full pl-11 pr-3 py-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none bg-slate-50/30 focus:bg-white transition-colors"
                                                placeholder="Tuliskan sedikit tentang peran dan tanggung jawab Anda..."
                                            />
                                        </div>
                                        <p className="text-xs text-slate-400 text-right">Maksimal 500 karakter</p>
                                    </div>

                                    {/* Tombol Simpan */}
                                    <div className="pt-6 border-t border-slate-100 flex justify-end">
                                        <Button
                                            onClick={handleSave}
                                            disabled={isLoading}
                                            className="bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl rounded-xl h-12 px-8 transition-all duration-300 transform hover:scale-[1.02]"
                                        >
                                            {isLoading ? (
                                                <span className="flex items-center gap-2">
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Menyimpan Perubahan...
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2 font-medium">
                                                    <Save className="w-5 h-5" />
                                                    Simpan Perubahan
                                                </span>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </MainLayoutAdmin>
    );
}