'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Menu,
    X,
    LayoutDashboard,
    Award,
    GraduationCap,
    Briefcase,
    FolderOpen,
    User,
    Bell,
    Search,
    Settings,
    LogOut,
    TrendingUp,
    Eye,
    ChevronRight,
    Calendar,
    Plus,
    ExternalLink,
    MoreVertical
} from 'lucide-react';

export default function AdminDashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeMenu, setActiveMenu] = useState('dashboard');

    const menuItems = [
        { id: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
        { id: 'sertifikat', icon: <Award className="w-5 h-5" />, label: 'Sertifikat' },
        { id: 'pendidikan', icon: <GraduationCap className="w-5 h-5" />, label: 'Pendidikan' },
        { id: 'pengalaman', icon: <Briefcase className="w-5 h-5" />, label: 'Pengalaman' },
        { id: 'portofolio', icon: <FolderOpen className="w-5 h-5" />, label: 'Portofolio' },
        { id: 'profil', icon: <User className="w-5 h-5" />, label: 'Profil' },
    ];

    const statsCards = [
        {
            title: 'Total Pengalaman',
            value: '8',
            subtitle: 'Proyek & Pekerjaan',
            icon: <Briefcase className="w-8 h-8" />,
            trend: '+2 tahun ini',
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600'
        },
        {
            title: 'Total Sertifikat',
            value: '12',
            subtitle: 'Lisensi Profesional',
            icon: <Award className="w-8 h-8" />,
            trend: '+3 bulan ini',
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50',
            iconColor: 'text-orange-600'
        },
        {
            title: 'Total Portofolio',
            value: '24',
            subtitle: 'Proyek Selesai',
            icon: <FolderOpen className="w-8 h-8" />,
            trend: '+5 kuartal ini',
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600'
        },
    ];

    // DATA DUMMY BARU: Recent Portfolio
    const recentPortfolios = [
        {
            name: 'Sistem Informasi Akademik',
            category: 'Full Stack Web',
            tech: ['Next.js', 'Supabase'],
            date: '20 Des 2025',
            status: 'Completed'
        },
        {
            name: 'Aplikasi Kasir UMKM',
            category: 'Mobile App',
            tech: ['Flutter', 'Firebase'],
            date: '15 Des 2025',
            status: 'In Progress'
        },
        {
            name: 'Company Profile BUMN',
            category: 'Frontend',
            tech: ['React', 'Tailwind'],
            date: '10 Des 2025',
            status: 'Completed'
        },
    ];

    // DATA DUMMY BARU: Recent Certificates
    const recentCertificates = [
        {
            name: 'AWS Cloud Practitioner',
            org: 'Amazon Web Services',
            date: '2025-12-01',
            validUntil: '2028'
        },
        {
            name: 'Full Stack JavaScript',
            org: 'Dicoding Indonesia',
            date: '2025-11-20',
            validUntil: 'Seumur Hidup'
        },
        {
            name: 'Cyber Security Essentials',
            org: 'Cisco Networking',
            date: '2025-11-15',
            validUntil: 'Seumur Hidup'
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100 font-sans">
            {/* Sidebar */}
            {/* FIX: Menghapus lg:translate-x-0 agar toggle bekerja di desktop */}
            <aside
                className={`fixed top-0 left-0 z-40 h-screen transition-transform duration-300 border-r border-slate-200 bg-white shadow-xl 
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                style={{ width: '16rem' }}
            >
                <div className="h-full flex flex-col">
                    {/* Logo */}
                    <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                                <span className="text-white font-bold text-lg">A</span>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Aziz Panel</h2>
                                <p className="text-xs text-slate-500 font-medium">Portfolio Admin</p>
                            </div>
                        </div>
                        {/* Tombol X hanya untuk Mobile */}
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="lg:hidden text-slate-400 hover:text-slate-700 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Menu Items */}
                    <nav className="flex-1 px-3 py-6 overflow-y-auto custom-scrollbar">
                        <div className="space-y-1">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveMenu(item.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeMenu === item.id
                                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/25'
                                        : 'text-slate-600 hover:bg-orange-50 hover:text-orange-700'
                                        }`}
                                >
                                    {/* Icon dengan efek bounce kecil saat hover */}
                                    <span className={`${activeMenu === item.id ? 'text-white' : 'text-slate-400 group-hover:text-orange-500'}`}>
                                        {item.icon}
                                    </span>
                                    <span className="font-medium">{item.label}</span>
                                    {activeMenu === item.id && (
                                        <ChevronRight className="w-4 h-4 ml-auto opacity-80" />
                                    )}
                                </button>
                            ))}
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

            {/* Main Content */}
            {/* FIX: Margin kiri menyesuaikan state isSidebarOpen */}
            <div className={`transition-all duration-300 min-h-screen flex flex-col ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>

                {/* Top Bar */}
                <header className="sticky top-0 z-30 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
                    <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                        {/* Left Section */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <Menu className="w-6 h-6" />
                            </button>

                            {/* Search Bar */}
                            <div className="hidden md:flex items-center gap-2 bg-slate-100/80 rounded-full px-4 py-2.5 w-80 border border-transparent focus-within:border-orange-300 focus-within:bg-white transition-all">
                                <Search className="w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Cari data portfolio..."
                                    className="bg-transparent border-none outline-none text-sm text-slate-700 placeholder-slate-400 w-full"
                                />
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-3">
                            <button className="relative p-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-all">
                                <Bell className="w-6 h-6" />
                                <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                            </button>

                            <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-200">
                                <div className="text-right">
                                    <p className="text-sm font-bold text-slate-900">Aziz A.</p>
                                    <p className="text-xs text-slate-500">Super Admin</p>
                                </div>
                                <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                    {/* Placeholder Avatar */}
                                    <div className="w-full h-full bg-gradient-to-tr from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                                        AZ
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="p-4 sm:p-6 lg:p-8 flex-1">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                            Dashboard Overview
                        </h1>
                        <p className="text-slate-600">Pantau perkembangan portfolio dan data karirmu di sini.</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {statsCards.map((stat, index) => (
                            <Card
                                key={index}
                                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative group bg-white"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`${stat.bgColor} p-3 rounded-xl ${stat.iconColor}`}>
                                            {stat.icon}
                                        </div>
                                        <div className="flex items-center gap-1 text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-lg">
                                            <TrendingUp className="w-3 h-3" />
                                            <span>{stat.trend}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-bold text-slate-900 mb-1">
                                        {stat.value}
                                    </h3>
                                    <p className="text-sm font-medium text-slate-600 mb-1">
                                        {stat.title}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {stat.subtitle}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Two Column Layout: Recent Portfolio & Recent Certificate */}
                    <div className="grid lg:grid-cols-3 gap-6">

                        {/* LEFT COLUMN: Recent Portfolio */}
                        <Card className="lg:col-span-2 border-0 shadow-lg bg-white overflow-hidden">
                            <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg font-bold text-slate-900">
                                            Recent Portfolio
                                        </CardTitle>
                                        <p className="text-sm text-slate-500">Project terbaru yang ditambahkan</p>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                                        <Eye className="w-4 h-4 mr-2" />
                                        Lihat Semua
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-100">
                                    {recentPortfolios.map((item, index) => (
                                        <div
                                            key={index}
                                            className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-4 group"
                                        >
                                            {/* Icon Placeholder */}
                                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                                <FolderOpen className="w-6 h-6" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-slate-900 truncate">
                                                    {item.name}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                                        {item.category}
                                                    </span>
                                                    <span className="text-xs text-slate-400">• {item.date}</span>
                                                </div>
                                            </div>

                                            {/* Tech Stack Bubbles (Desktop only) */}
                                            <div className="hidden sm:flex items-center gap-1">
                                                {item.tech.map((t, i) => (
                                                    <span key={i} className="text-[10px] px-2 py-1 bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>

                                            <Button size="icon" variant="ghost" className="text-slate-400 hover:text-orange-500">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* RIGHT COLUMN: Recent Certificates */}
                        <Card className="border-0 shadow-lg bg-white h-fit">
                            <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-bold text-slate-900">
                                        Recent Certificates
                                    </CardTitle>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500">
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="space-y-4">
                                    {recentCertificates.map((cert, index) => (
                                        <div
                                            key={index}
                                            className="relative p-4 rounded-xl border border-slate-100 bg-white hover:border-orange-200 hover:shadow-md transition-all group"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1 w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                                                    <Award className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 line-clamp-2">
                                                        {cert.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-0.5">
                                                        {cert.org}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                                                            Valid: {cert.validUntil}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ExternalLink className="w-4 h-4 text-orange-400" />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Button className="w-full mt-4 bg-slate-900 text-white hover:bg-slate-800">
                                    Lihat Semua Sertifikat
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                </main>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
}