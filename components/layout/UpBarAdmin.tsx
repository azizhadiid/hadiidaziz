'use client'

import React, { useEffect, useState } from 'react';
import { Menu, User } from 'lucide-react';
import supabase from '@/lib/db';

interface UpbarProps {
    onMenuClick: () => void;
}

export default function Upbar({ onMenuClick }: UpbarProps) {
    const [profile, setProfile] = useState({
        name: 'Memuat...',
        avatar: '',
        role: 'Admin'
    });

    // Fetch Data Profil saat komponen dimuat
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // 1. Ambil User yang sedang login
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    // 2. Ambil detail dari tabel admin_profiles
                    const { data } = await supabase
                        .from('admin_profiles')
                        .select('nama_admin, foto_profile, department')
                        .eq('id', user.id)
                        .maybeSingle();

                    if (data) {
                        setProfile({
                            name: data.nama_admin || user.email?.split('@')[0] || 'Admin', // Fallback ke email jika nama kosong
                            avatar: data.foto_profile || '',
                            role: data.department || 'Administrator'
                        });
                    }
                }
            } catch (error) {
                console.error("Gagal mengambil data profil upbar:", error);
            }
        };

        fetchProfile();
    }, []);

    // Helper untuk membuat inisial nama (Misal: Aziz Alhadiid -> AA)
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    return (
        <header className="sticky top-0 z-30 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
            <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                {/* Left Section */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-3">

                    <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-200">
                        <div className="text-left">
                            <p className="text-sm font-bold text-slate-900">{profile.name}</p>
                            <p className="text-xs text-slate-500">{profile.role}</p>
                        </div>
                        {/* Avatar Foto */}
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm bg-slate-100 group cursor-pointer">
                            {profile.avatar ? (
                                <img
                                    src={profile.avatar}
                                    alt={profile.name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                            ) : (
                                // Fallback jika tidak ada foto: Tampilkan Inisial
                                <div className="w-full h-full bg-linear-to-tr from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xs">
                                    {profile.name !== 'Memuat...' ? getInitials(profile.name) : <User className="w-5 h-5" />}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}