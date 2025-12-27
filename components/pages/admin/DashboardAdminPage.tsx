'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Untuk navigasi
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Award, FolderOpen, TrendingUp, Eye, MoreVertical, Plus, ExternalLink, Loader2, FileText } from 'lucide-react';
import MainLayoutAdmin from '@/components/layout/MainLayoutAdmin';
import supabase from '@/lib/db';

export default function DashboardPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [adminName, setAdminName] = useState('Admin');

    // State untuk Statistik Angka
    const [stats, setStats] = useState({
        experience: 0,
        certificate: 0,
        portfolio: 0
    });

    // State untuk Data List Terbaru
    const [recentPortfolios, setRecentPortfolios] = useState<any[]>([]);
    const [recentCertificates, setRecentCertificates] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Ambil User ID
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return; // Middleware handle redirect

                // 2. Ambil Nama Admin (Opsional, untuk sapaan)
                const { data: profile } = await supabase
                    .from('admin_profiles')
                    .select('nama_admin')
                    .eq('id', user.id)
                    .maybeSingle();

                if (profile?.nama_admin) setAdminName(profile.nama_admin);

                // 3. Jalankan semua query secara parallel biar cepat (Promise.all)
                const [
                    countExp,
                    countCert,
                    countPort,
                    dataPort,
                    dataCert
                ] = await Promise.all([
                    // Hitung Total Pengalaman
                    supabase.from('experiences').select('*', { count: 'exact', head: true }).eq('admin_id', user.id),
                    // Hitung Total Sertifikat
                    supabase.from('certificates').select('*', { count: 'exact', head: true }).eq('admin_id', user.id),
                    // Hitung Total Portofolio
                    supabase.from('portfolios').select('*', { count: 'exact', head: true }).eq('admin_id', user.id),

                    // Ambil 3 Portofolio Terbaru
                    supabase.from('portfolios')
                        .select('nama_portfolio, kategori_proyek, teknologi, created_at')
                        .eq('admin_id', user.id)
                        .order('created_at', { ascending: false })
                        .limit(3),

                    // Ambil 3 Sertifikat Terbaru
                    supabase.from('certificates')
                        .select('nama_sertifikat, organisasi_sertifikat, periode_sertifikat')
                        .eq('admin_id', user.id)
                        .order('created_at', { ascending: false })
                        .limit(3)
                ]);

                // 4. Update State
                setStats({
                    experience: countExp.count || 0,
                    certificate: countCert.count || 0,
                    portfolio: countPort.count || 0
                });

                setRecentPortfolios(dataPort.data || []);
                setRecentCertificates(dataCert.data || []);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Helper Format Tanggal
    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    // Konfigurasi Kartu Statistik
    const statsCards = [
        {
            title: 'Total Pengalaman',
            value: stats.experience, // Data Real
            subtitle: 'Proyek & Pekerjaan',
            icon: <Briefcase className="w-8 h-8" />,
            trend: 'Data Terkini',
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600'
        },
        {
            title: 'Total Sertifikat',
            value: stats.certificate, // Data Real
            subtitle: 'Lisensi Profesional',
            icon: <Award className="w-8 h-8" />,
            trend: 'Data Terkini',
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50',
            iconColor: 'text-orange-600'
        },
        {
            title: 'Total Portofolio',
            value: stats.portfolio, // Data Real
            subtitle: 'Proyek Selesai',
            icon: <FolderOpen className="w-8 h-8" />,
            trend: 'Data Terkini',
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600'
        },
    ];

    if (isLoading) {
        return (
            <MainLayoutAdmin>
                <div className="flex h-[80vh] items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
                </div>
            </MainLayoutAdmin>
        );
    }

    return (
        <MainLayoutAdmin>
            {/* Konten Dashboard */}

            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                    Halo, {adminName} 👋
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
                                <div className="flex items-center gap-1 text-slate-500 text-sm font-medium bg-slate-50 px-2 py-1 rounded-lg">
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
                <Card className="lg:col-span-2 border-0 shadow-lg bg-white overflow-hidden flex flex-col">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold text-slate-900">Recent Portfolio</CardTitle>
                                <p className="text-sm text-slate-500">Project terbaru yang ditambahkan</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                onClick={() => router.push('/admin/portofolio')}
                            >
                                <Eye className="w-4 h-4 mr-2" /> Lihat Semua
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 flex-1">
                        {recentPortfolios.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {recentPortfolios.map((item, index) => (
                                    <div key={index} className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-4 group">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                            <FolderOpen className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-slate-900 truncate">{item.nama_portfolio}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                                    {item.kategori_proyek}
                                                </span>
                                                <span className="text-xs text-slate-400 hidden sm:inline">• {formatDate(item.created_at)}</span>
                                            </div>
                                        </div>
                                        <div className="hidden sm:flex items-center gap-1">
                                            {/* Split string teknologi (koma) menjadi array */}
                                            {item.teknologi?.split(',').slice(0, 2).map((t: string, i: number) => (
                                                <span key={i} className="text-[10px] px-2 py-1 bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                                                    {t.trim()}
                                                </span>
                                            ))}
                                            {(item.teknologi?.split(',').length || 0) > 2 && (
                                                <span className="text-[10px] px-2 py-1 bg-slate-50 text-slate-400 rounded-md">+{(item.teknologi?.split(',').length || 0) - 2}</span>
                                            )}
                                        </div>
                                        <Button size="icon" variant="ghost" className="text-slate-400 hover:text-orange-500">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            // EMPTY STATE PORTOFOLIO
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                    <FolderOpen className="w-8 h-8 text-slate-300" />
                                </div>
                                <p className="text-slate-500 text-sm font-medium">Belum ada portofolio</p>
                                <Button
                                    variant="link"
                                    className="text-orange-600 h-auto p-0 text-xs mt-1"
                                    onClick={() => router.push('/admin/portofolio')}
                                >
                                    Tambah Project Baru
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Certificates */}
                <Card className="border-0 shadow-lg bg-white h-fit flex flex-col">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-bold text-slate-900">Recent Certificates</CardTitle>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-slate-500 hover:text-orange-600 hover:bg-orange-50"
                                onClick={() => router.push('/admin/sertifikat')}
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 flex-1">
                        {recentCertificates.length > 0 ? (
                            <>
                                <div className="space-y-4">
                                    {recentCertificates.map((cert, index) => (
                                        <div key={index} className="relative p-4 rounded-xl border border-slate-100 bg-white hover:border-orange-200 hover:shadow-md transition-all group">
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1 w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                                                    <Award className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 line-clamp-2">{cert.nama_sertifikat}</p>
                                                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{cert.organisasi_sertifikat}</p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="text-[10px] text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                                            {cert.periode_sertifikat || 'Tidak ada tanggal'}
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
                                <Button
                                    className="w-full mt-4 bg-slate-900 text-white hover:bg-slate-800"
                                    onClick={() => router.push('/admin/sertifikat')}
                                >
                                    Lihat Semua Sertifikat
                                </Button>
                            </>
                        ) : (
                            // EMPTY STATE SERTIFIKAT
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                    <Award className="w-7 h-7 text-slate-300" />
                                </div>
                                <p className="text-slate-500 text-sm font-medium">Belum ada sertifikat</p>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="mt-3 text-xs border-orange-200 text-orange-600 hover:bg-orange-50"
                                    onClick={() => router.push('/admin/sertifikat')}
                                >
                                    Tambah Sertifikat
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

        </MainLayoutAdmin>
    );
}