'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    FolderOpen,
    Layers,
    Code2,
    Clock,
    Plus,
    Search,
    Eye,
    Edit,
    Trash2,
    Calendar,
    Tag,
    ChevronLeft,
    ChevronRight,
    X,
    ExternalLink,
    Filter
} from 'lucide-react';
import MainLayoutAdmin from '@/components/layout/MainLayoutAdmin';

// 1. Definisi Tipe Data
interface Portfolio {
    id: number;
    nama_portfolio: string;
    jenis_proyek: string;
    kategori_proyek: string;
    teknologi: string;
    deskripsi_singkat: string;
    lama_pengerjaan: string;
    periode: string;
    deskripsi_proyek: string;
    image: string;
}

export default function AdminPortofolio() {
    // State Management
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [filterCategory, setFilterCategory] = useState('All');

    // Modal States
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);

    // Selected Item for Actions
    const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);

    const itemsPerPage = 6;
    const categories = ['All', 'Fullstack', 'Frontend', 'Backend', 'Mobile App'];

    // Dummy Data
    const [portfolioData, setPortfolioData] = useState<Portfolio[]>([
        {
            id: 1,
            nama_portfolio: 'E-Commerce Dashboard',
            jenis_proyek: 'Web App',
            kategori_proyek: 'Fullstack',
            teknologi: 'Next.js, Supabase, Tailwind CSS, TypeScript',
            deskripsi_singkat: 'Modern admin dashboard for managing online store with real-time analytics.',
            lama_pengerjaan: '4 Minggu',
            periode: 'Nov - Dec 2024',
            deskripsi_proyek: 'Comprehensive e-commerce admin dashboard featuring real-time sales analytics, inventory management, order processing, and customer relationship management. Built with Next.js 14 for optimal performance and Supabase for backend infrastructure.',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop'
        },
        {
            id: 2,
            nama_portfolio: 'Healthcare Mobile App',
            jenis_proyek: 'Mobile App',
            kategori_proyek: 'Frontend',
            teknologi: 'React Native, Redux, Firebase, Expo',
            deskripsi_singkat: 'Patient management app with appointment scheduling and telemedicine.',
            lama_pengerjaan: '6 Minggu',
            periode: 'Sep - Oct 2024',
            deskripsi_proyek: 'Mobile application for healthcare providers and patients. Features include video consultations, appointment booking, prescription management, and secure health record storage.',
            image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop'
        },
        {
            id: 3,
            nama_portfolio: 'Financial Planning Platform',
            jenis_proyek: 'Web App',
            kategori_proyek: 'Fullstack',
            teknologi: 'React, Node.js, PostgreSQL, Chart.js',
            deskripsi_singkat: 'Personal finance management tool with budget tracking and investments.',
            lama_pengerjaan: '5 Minggu',
            periode: 'Jul - Aug 2024',
            deskripsi_proyek: 'Comprehensive financial planning platform that helps users track expenses, manage budgets, monitor investments, and plan for financial goals.',
            image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&h=400&fit=crop'
        },
        {
            id: 4,
            nama_portfolio: 'Real Estate Platform',
            jenis_proyek: 'Web App',
            kategori_proyek: 'Fullstack',
            teknologi: 'Next.js, Prisma, PostgreSQL, Mapbox',
            deskripsi_singkat: 'Property listing website with advanced search and virtual tours.',
            lama_pengerjaan: '6 Minggu',
            periode: 'Oct - Nov 2023',
            deskripsi_proyek: 'Modern real estate platform for property search and listings. Features interactive maps, 3D virtual tours, advanced filtering, and mortgage calculators.',
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop'
        },
        {
            id: 5,
            nama_portfolio: 'Fitness Tracking App',
            jenis_proyek: 'Mobile App',
            kategori_proyek: 'Frontend',
            teknologi: 'React Native, GraphQL, HealthKit',
            deskripsi_singkat: 'Workout and nutrition tracking app with personalized plans.',
            lama_pengerjaan: '5 Minggu',
            periode: 'Aug - Sep 2023',
            deskripsi_proyek: 'Comprehensive fitness application with workout logging, nutrition tracking, custom workout plans, and progress tracking with charts.',
            image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop'
        }
    ]);

    // Filtering Logic
    const filteredPortfolio = portfolioData.filter(item => {
        const matchSearch = item.nama_portfolio.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.teknologi.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCategory = filterCategory === 'All' || item.kategori_proyek === filterCategory;
        return matchSearch && matchCategory;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredPortfolio.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPortfolio = filteredPortfolio.slice(startIndex, startIndex + itemsPerPage);

    // Handlers
    const handleViewDetail = (portfolio: Portfolio) => {
        setSelectedPortfolio(portfolio);
        setShowDetailModal(true);
    };

    const handleDelete = (portfolio: Portfolio) => {
        setSelectedPortfolio(portfolio);
        setShowDeleteAlert(true);
    };

    const confirmDelete = () => {
        if (selectedPortfolio) {
            setPortfolioData(portfolioData.filter(p => p.id !== selectedPortfolio.id));
            setShowDeleteAlert(false);
            setSelectedPortfolio(null);
        }
    };

    // Helper Functions for Styling
    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            'Fullstack': 'bg-purple-100 text-purple-700 border-purple-200',
            'Frontend': 'bg-blue-100 text-blue-700 border-blue-200',
            'Backend': 'bg-green-100 text-green-700 border-green-200',
            'Mobile App': 'bg-orange-100 text-orange-700 border-orange-200'
        };
        return colors[category] || 'bg-slate-100 text-slate-700 border-slate-200';
    };

    const getProjectTypeColor = (type: string) => {
        return type === 'Web App'
            ? 'bg-indigo-100 text-indigo-700'
            : 'bg-pink-100 text-pink-700';
    };

    return (
        <MainLayoutAdmin>

            {/* --- ACTION BAR --- */}
            <div className="mb-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-1">
                    {/* Search */}
                    <div className="relative flex-1 lg:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Cari project atau teknologi..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-11 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                        />
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => { setFilterCategory(cat); setCurrentPage(1); }}
                                className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all border ${filterCategory === cat
                                    ? 'bg-linear-to-r from-orange-500 to-orange-600 text-white shadow-lg border-transparent'
                                    : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <Button
                    onClick={() => setShowAddModal(true)}
                    className="w-full sm:w-auto bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg rounded-xl"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Project
                </Button>
            </div>

            {/* --- STATS SUMMARY --- */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Total Projects', value: portfolioData.length, icon: <FolderOpen className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-100' },
                    { label: 'Categories', value: '4', icon: <Layers className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-100' },
                    { label: 'Technologies', value: '20+', icon: <Code2 className="w-5 h-5 text-green-600" />, bg: 'bg-green-100' },
                    { label: 'Active Year', value: '2024', icon: <Clock className="w-5 h-5 text-orange-600" />, bg: 'bg-orange-100' },
                ].map((stat, idx) => (
                    <Card key={idx} className="border-0 shadow-md">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center`}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                                    <p className="text-xs text-slate-500">{stat.label}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* --- PORTFOLIO GRID --- */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {currentPortfolio.map((item) => (
                    <Card key={item.id} className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col h-full">
                        {/* Project Image */}
                        <div className="relative h-48 overflow-hidden bg-slate-100 shrink-0">
                            <img
                                src={item.image}
                                alt={item.nama_portfolio}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            {/* Quick Action Overlay */}
                            <button
                                onClick={() => handleViewDetail(item)}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-700 hover:text-orange-600 shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 cursor-pointer"
                            >
                                <Eye className="w-6 h-6" />
                            </button>

                            {/* Project Type Badge */}
                            <div className="absolute top-3 left-3">
                                <span className={`px-3 py-1 ${getProjectTypeColor(item.jenis_proyek)} text-xs font-bold rounded-full shadow-sm`}>
                                    {item.jenis_proyek}
                                </span>
                            </div>
                        </div>

                        <CardContent className="p-5 flex flex-col flex-1">
                            <div className="mb-3">
                                <div className="flex justify-between items-start gap-2 mb-2">
                                    <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-orange-600 transition-colors" title={item.nama_portfolio}>
                                        {item.nama_portfolio}
                                    </h3>
                                </div>

                                {/* Category Badge */}
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getCategoryColor(item.kategori_proyek)}`}>
                                    <Layers className="w-3 h-3 mr-1" />
                                    {item.kategori_proyek}
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2 flex-1">
                                {item.deskripsi_singkat}
                            </p>

                            {/* Meta Info */}
                            <div className="flex items-center justify-between text-xs text-slate-500 mb-4 pb-4 border-b border-slate-100">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{item.periode}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{item.lama_pengerjaan}</span>
                                </div>
                            </div>

                            {/* Technologies */}
                            <div className="mb-4">
                                <div className="flex flex-wrap gap-1.5">
                                    {item.teknologi.split(',').slice(0, 3).map((tech, i) => (
                                        <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-slate-50 text-slate-600 border border-slate-200 rounded text-[10px] font-medium">
                                            {tech.trim()}
                                        </span>
                                    ))}
                                    {item.teknologi.split(',').length > 3 && (
                                        <span className="inline-flex items-center px-2 py-1 bg-orange-50 text-orange-600 rounded text-[10px] font-bold">
                                            +{item.teknologi.split(',').length - 3}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 mt-auto">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg"
                                    onClick={() => alert('Edit: ' + item.nama_portfolio)}
                                >
                                    <Edit className="w-3.5 h-3.5 mr-1.5" />
                                    Edit
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg"
                                    onClick={() => handleDelete(item)}
                                >
                                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                                    Hapus
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* --- PAGINATION --- */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-600">
                        Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredPortfolio.length)} dari {filteredPortfolio.length} project
                    </p>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="border-slate-200 rounded-lg">
                            <ChevronLeft className="w-4 h-4" /> Prev
                        </Button>

                        <div className="flex gap-1">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${currentPage === i + 1
                                        ? 'bg-linear-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="border-slate-200 rounded-lg">
                            Next <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* --- DETAIL MODAL --- */}
            {showDetailModal && selectedPortfolio && (
                <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto scale-100 animate-in zoom-in-95 duration-200">
                        <div className="relative h-64 bg-slate-100">
                            <img src={selectedPortfolio.image} alt={selectedPortfolio.nama_portfolio} className="w-full h-full object-cover" />
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <div className="absolute bottom-4 left-4 flex gap-2">
                                <span className={`px-3 py-1 ${getProjectTypeColor(selectedPortfolio.jenis_proyek)} text-xs font-bold rounded-full shadow-lg`}>
                                    {selectedPortfolio.jenis_proyek}
                                </span>
                                <span className={`px-3 py-1 bg-white/90 text-slate-700 text-xs font-bold rounded-full shadow-lg flex items-center gap-1`}>
                                    <Layers className="w-3 h-3" />
                                    {selectedPortfolio.kategori_proyek}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedPortfolio.nama_portfolio}</h2>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-6">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" /> {selectedPortfolio.periode}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" /> {selectedPortfolio.lama_pengerjaan}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Deskripsi Project</h4>
                                    <p className="text-slate-600 leading-relaxed text-sm">{selectedPortfolio.deskripsi_proyek}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Teknologi</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedPortfolio.teknologi.split(',').map((tech, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium border border-slate-200 flex items-center gap-2">
                                                <Code2 className="w-4 h-4 text-slate-400" />
                                                {tech.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button className="flex-1 bg-slate-900 text-white hover:bg-slate-800 rounded-xl h-12">
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        Live Demo
                                    </Button>
                                    <Button variant="outline" className="flex-1 border-slate-200 rounded-xl h-12">
                                        <Code2 className="w-4 h-4 mr-2" />
                                        Source Code
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- ADD MODAL --- */}
            {showAddModal && (
                <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-2xl border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between sticky top-0 bg-white z-10">
                            <CardTitle className="text-xl font-bold text-slate-900">Tambah Project Baru</CardTitle>
                            <button onClick={() => setShowAddModal(false)}><X className="w-6 h-6 text-slate-400" /></button>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nama Project</Label>
                                    <Input placeholder="Contoh: E-Commerce Dashboard" className="rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Jenis Proyek</Label>
                                    <Input placeholder="Contoh: Web App / Mobile App" className="rounded-xl" />
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Kategori</Label>
                                    <select className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-orange-500 outline-none">
                                        <option>Fullstack</option>
                                        <option>Frontend</option>
                                        <option>Backend</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Lama Pengerjaan</Label>
                                    <Input placeholder="Contoh: 1 Bulan" className="rounded-xl" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Teknologi (Pisahkan koma)</Label>
                                <Input placeholder="React, Next.js, Tailwind..." className="rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Label>Deskripsi Singkat</Label>
                                <Input placeholder="Ringkasan untuk kartu..." className="rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Label>Deskripsi Lengkap</Label>
                                <textarea className="w-full min-h-25 p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500 outline-none resize-y" placeholder="Ceritakan detail project..." />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowAddModal(false)}>Batal</Button>
                                <Button className="flex-1 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-xl">Simpan Project</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* --- DELETE ALERT --- */}
            {showDeleteAlert && (
                <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <Card className="w-full max-w-md border-0 shadow-2xl">
                        <CardContent className="p-6">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-bold text-center text-slate-900 mb-2">Hapus Project?</h3>
                            <p className="text-center text-slate-500 mb-6">
                                Anda yakin ingin menghapus <strong>{selectedPortfolio?.nama_portfolio}</strong>? Data yang dihapus tidak dapat dikembalikan.
                            </p>
                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowDeleteAlert(false)}>Batal</Button>
                                <Button className="flex-1 bg-red-600 text-white hover:bg-red-700 rounded-xl" onClick={confirmDelete}>Hapus</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

        </MainLayoutAdmin>
    );
}