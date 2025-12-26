'use client'

import React, { useState } from 'react';
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
    CheckCircle
} from 'lucide-react';
import MainLayoutAdmin from '@/components/layout/MainLayoutAdmin';

// 1. Definisi Tipe Data (Sesuai DB admin_profiles)
interface AdminProfile {
    id: string;
    nama_admin: string;
    email: string; // Biasanya dari auth.users, tapi kita tampilkan saja
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

    // Dummy Data (Nanti diganti dengan fetch dari Supabase)
    const [profile, setProfile] = useState<AdminProfile>({
        id: '123-456',
        nama_admin: 'Aziz Alhadiid',
        email: 'aziz@example.com', // Read-only biasanya
        no_hp: '+62 812-3456-7890',
        foto_profile: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
        jenis_kelamin: 'Laki-laki',
        tempat_lahir: 'Jambi',
        tanggal_lahir: '2000-08-17',
        department: 'IT Development',
        admin_code: 'ADM-001',
        deskripsi_profile: 'Full Stack Developer with a passion for building scalable web applications and intuitive user interfaces.'
    });

    // Handler Perubahan Input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setIsLoading(true);
        // Simulasi API Call
        setTimeout(() => {
            setIsLoading(false);
            alert('Profil berhasil diperbarui!');
        }, 1000);
    };

    return (
        <MainLayoutAdmin>

            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Profil Saya</h1>
                <p className="text-slate-500 text-sm">Kelola informasi pribadi dan pengaturan akun Anda.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">

                {/* --- KOLOM KIRI: FOTO & RINGKASAN --- */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-0 shadow-lg overflow-hidden">
                        {/* Cover Background (Hiasan) */}
                        <div className="h-32 bg-linear-to-r from-orange-500 to-orange-600"></div>

                        <CardContent className="px-6 pb-8 relative">
                            {/* Foto Profil Avatar */}
                            <div className="relative -mt-16 mb-4 flex justify-center">
                                <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-200">
                                    <img
                                        src={profile.foto_profile}
                                        alt={profile.nama_admin}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Tombol Ganti Foto */}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer group">
                                        <Camera className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                                    </div>
                                </div>
                            </div>

                            <div className="text-center">
                                <h2 className="text-xl font-bold text-slate-900">{profile.nama_admin}</h2>
                                <p className="text-sm text-slate-500 font-medium mb-4">{profile.department}</p>

                                <div className="flex justify-center gap-2 mb-6">
                                    <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                                        Admin
                                    </span>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                                        Active
                                    </span>
                                </div>

                                <div className="space-y-3 text-left bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <Mail className="w-4 h-4 text-slate-400" />
                                        <span className="truncate">{profile.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <Hash className="w-4 h-4 text-slate-400" />
                                        <span>{profile.admin_code}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <Building className="w-4 h-4 text-slate-400" />
                                        <span>{profile.department}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* --- KOLOM KANAN: FORM EDIT DATA --- */}
                <div className="lg:col-span-2">
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="border-b border-slate-100 pb-4">
                            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <User className="w-5 h-5 text-orange-600" />
                                Edit Informasi Pribadi
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>

                                {/* Row 1: Nama & No HP */}
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="nama_admin" className="text-slate-600">Nama Lengkap</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input
                                                id="nama_admin"
                                                name="nama_admin"
                                                value={profile.nama_admin}
                                                onChange={handleChange}
                                                className="pl-10 h-11 rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="no_hp" className="text-slate-600">Nomor HP / WhatsApp</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input
                                                id="no_hp"
                                                name="no_hp"
                                                value={profile.no_hp}
                                                onChange={handleChange}
                                                className="pl-10 h-11 rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Row 2: Tempat & Tanggal Lahir */}
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="tempat_lahir" className="text-slate-600">Tempat Lahir</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input
                                                id="tempat_lahir"
                                                name="tempat_lahir"
                                                value={profile.tempat_lahir}
                                                onChange={handleChange}
                                                className="pl-10 h-11 rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="tanggal_lahir" className="text-slate-600">Tanggal Lahir</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input
                                                type="date"
                                                id="tanggal_lahir"
                                                name="tanggal_lahir"
                                                value={profile.tanggal_lahir}
                                                onChange={handleChange}
                                                className="pl-10 h-11 rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Row 3: Jenis Kelamin & Departemen */}
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="jenis_kelamin" className="text-slate-600">Jenis Kelamin</Label>
                                        <select
                                            id="jenis_kelamin"
                                            name="jenis_kelamin"
                                            value={profile.jenis_kelamin}
                                            onChange={handleChange}
                                            className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        >
                                            <option value="">Pilih...</option>
                                            <option value="Laki-laki">Laki-laki</option>
                                            <option value="Perempuan">Perempuan</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="department" className="text-slate-600">Departemen</Label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input
                                                id="department"
                                                name="department"
                                                value={profile.department}
                                                onChange={handleChange}
                                                className="pl-10 h-11 rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Row 4: Deskripsi Profile */}
                                <div className="space-y-2">
                                    <Label htmlFor="deskripsi_profile" className="text-slate-600">Bio / Deskripsi Singkat</Label>
                                    <div className="relative">
                                        <AlignLeft className="absolute left-3 top-4 w-4 h-4 text-slate-400" />
                                        <textarea
                                            id="deskripsi_profile"
                                            name="deskripsi_profile"
                                            rows={4}
                                            value={profile.deskripsi_profile}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                                            placeholder="Tuliskan sedikit tentang diri Anda..."
                                        />
                                    </div>
                                    <p className="text-xs text-slate-400 text-right">Maksimal 500 karakter</p>
                                </div>

                                {/* Tombol Simpan */}
                                <div className="pt-4 flex justify-end">
                                    <Button
                                        onClick={handleSave}
                                        disabled={isLoading}
                                        className="bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg rounded-xl h-11 px-8"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center gap-2">
                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                Menyimpan...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <Save className="w-4 h-4" />
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
        </MainLayoutAdmin>
    );
}