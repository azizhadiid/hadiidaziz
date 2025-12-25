'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Award, FolderOpen, TrendingUp, Eye, MoreVertical, Plus, ExternalLink } from 'lucide-react';
import MainLayoutAdmin from '@/components/layout/MainLayoutAdmin';

export default function DashboardPage() {

    // --- DATA DUMMY (Bisa dipindah ke file constant atau fetch API nanti) ---
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

    const recentPortfolios = [
        { name: 'Sistem Informasi Akademik', category: 'Full Stack Web', tech: ['Next.js', 'Supabase'], date: '20 Des 2025' },
        { name: 'Aplikasi Kasir UMKM', category: 'Mobile App', tech: ['Flutter', 'Firebase'], date: '15 Des 2025' },
        { name: 'Company Profile BUMN', category: 'Frontend', tech: ['React', 'Tailwind'], date: '10 Des 2025' },
    ];

    const recentCertificates = [
        { name: 'AWS Cloud Practitioner', org: 'Amazon Web Services', validUntil: '2028' },
        { name: 'Full Stack JavaScript', org: 'Dicoding Indonesia', validUntil: 'Seumur Hidup' },
        { name: 'Cyber Security Essentials', org: 'Cisco Networking', validUntil: 'Seumur Hidup' },
    ];
    // -----------------------------------------------------------------------

    return (
        <MainLayoutAdmin>
            {/* Konten Dashboard */}

            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                    Dashboard Overview
                </h1>
                <p className="text-slate-600">Pantau perkembangan portfolio dan data karirmu di sini.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {statsCards.map((stat, index) => (
                    <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative group bg-white">
                        <div className={`absolute inset-0 bg-linear-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
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
                            <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                            <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                            <p className="text-xs text-slate-400">{stat.subtitle}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Grid Content */}
            <div className="grid lg:grid-cols-3 gap-6">

                {/* Recent Portfolio */}
                <Card className="lg:col-span-2 border-0 shadow-lg bg-white overflow-hidden">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold text-slate-900">Recent Portfolio</CardTitle>
                                <p className="text-sm text-slate-500">Project terbaru yang ditambahkan</p>
                            </div>
                            <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                                <Eye className="w-4 h-4 mr-2" /> Lihat Semua
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-100">
                            {recentPortfolios.map((item, index) => (
                                <div key={index} className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-4 group">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                        <FolderOpen className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-slate-900 truncate">{item.name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{item.category}</span>
                                            <span className="text-xs text-slate-400">• {item.date}</span>
                                        </div>
                                    </div>
                                    <div className="hidden sm:flex items-center gap-1">
                                        {item.tech.map((t, i) => (
                                            <span key={i} className="text-[10px] px-2 py-1 bg-slate-100 text-slate-600 rounded-md border border-slate-200">{t}</span>
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

                {/* Recent Certificates */}
                <Card className="border-0 shadow-lg bg-white h-fit">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-bold text-slate-900">Recent Certificates</CardTitle>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500"><Plus className="w-4 h-4" /></Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="space-y-4">
                            {recentCertificates.map((cert, index) => (
                                <div key={index} className="relative p-4 rounded-xl border border-slate-100 bg-white hover:border-orange-200 hover:shadow-md transition-all group">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                                            <Award className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 line-clamp-2">{cert.name}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{cert.org}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-1 rounded-md">Valid: {cert.validUntil}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ExternalLink className="w-4 h-4 text-orange-400" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button className="w-full mt-4 bg-slate-900 text-white hover:bg-slate-800">Lihat Semua Sertifikat</Button>
                    </CardContent>
                </Card>
            </div>

        </MainLayoutAdmin>
    );
}