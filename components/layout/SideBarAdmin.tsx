'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    X, LayoutDashboard, Award, GraduationCap,
    Briefcase, FolderOpen, User, LogOut, ChevronRight
} from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
    const pathname = usePathname(); // Untuk mendeteksi menu aktif otomatis

    const menuItems = [
        { href: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
        { href: '/admin/sertifikat', icon: <Award className="w-5 h-5" />, label: 'Sertifikat' },
        { href: '/admin/pendidikan', icon: <GraduationCap className="w-5 h-5" />, label: 'Pendidikan' },
        { href: '/admin/pengalaman', icon: <Briefcase className="w-5 h-5" />, label: 'Pengalaman' },
        { href: '/admin/portofolio', icon: <FolderOpen className="w-5 h-5" />, label: 'Portofolio' },
        { href: '/admin/profil', icon: <User className="w-5 h-5" />, label: 'Profil' },
    ];

    return (
        <aside
            className={`fixed top-0 left-0 z-40 h-screen transition-transform duration-300 border-r border-slate-200 bg-white shadow-xl 
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            style={{ width: '16rem' }}
        >
            <div className="h-full flex flex-col">
                {/* Logo */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <span className="text-white font-bold text-lg">A</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Aziz Panel</h2>
                            <p className="text-xs text-slate-500 font-medium">Portfolio Admin</p>
                        </div>
                    </div>
                    {/* Tombol X hanya untuk Mobile */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden text-slate-400 hover:text-slate-700 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 px-3 py-6 overflow-y-auto custom-scrollbar">
                    <div className="space-y-1">
                        {menuItems.map((item) => {
                            // Cek apakah menu ini sedang aktif
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-linear-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/25'
                                        : 'text-slate-600 hover:bg-orange-50 hover:text-orange-700'
                                        }`}
                                >
                                    <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-orange-500'}`}>
                                        {item.icon}
                                    </span>
                                    <span className="font-medium">{item.label}</span>
                                    {isActive && (
                                        <ChevronRight className="w-4 h-4 ml-auto opacity-80" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-slate-100">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group">
                        <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}