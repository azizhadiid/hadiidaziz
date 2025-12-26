'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Briefcase,
    Building2,
    Clock,
    Code,
    Plus,
    Search,
    Filter,
    MapPin,
    Calendar,
    ExternalLink,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    X
} from 'lucide-react';
import MainLayoutAdmin from '@/components/layout/MainLayoutAdmin';

// 1. Interface
interface Experience {
    id: number;
    posisi: string;
    jenis_pekerjaan: string;
    perusahaan: string;
    periode: string;
    lama_bekerja: string;
    lokasi: string;
    deskripsi: string;
    keahlian: string;
    link_proyek: string;
}

export default function AdminPengalamanPage() {
    // State Management
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);

    // Selected Item State
    const [selectedExp, setSelectedExp] = useState<Experience | null>(null);

    const itemsPerPage = 4;

    // Dummy Data
    const [experienceData, setExperienceData] = useState<Experience[]>([
        {
            id: 1,
            posisi: 'Senior Frontend Developer',
            jenis_pekerjaan: 'Full-time',
            perusahaan: 'Tokopedia',
            periode: 'Jan 2023 - Sekarang',
            lama_bekerja: '1 Tahun 11 Bulan',
            lokasi: 'Jakarta Selatan (Hybrid)',
            deskripsi: 'Leading frontend development team to build scalable e-commerce features.',
            keahlian: 'React, TypeScript, Next.js, Redux, Tailwind CSS',
            link_proyek: 'https://tokopedia.com'
        },
        {
            id: 2,
            posisi: 'Frontend Developer',
            jenis_pekerjaan: 'Full-time',
            perusahaan: 'Gojek',
            periode: 'Mar 2021 - Dec 2022',
            lama_bekerja: '1 Tahun 9 Bulan',
            lokasi: 'Jakarta Selatan (On-site)',
            deskripsi: 'Developed and maintained driver and customer-facing web applications.',
            keahlian: 'React, JavaScript, Redux, SASS',
            link_proyek: 'https://gojek.com'
        },
    ]);

    // Filtering & Pagination Logic
    const filteredExperience = experienceData.filter(exp =>
        exp.posisi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.perusahaan.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredExperience.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentExperience = filteredExperience.slice(startIndex, startIndex + itemsPerPage);

    // Handlers
    const handleEdit = (exp: Experience) => {
        setSelectedExp(exp);
        setShowEditModal(true);
    };

    const handleDelete = (exp: Experience) => {
        setSelectedExp(exp);
        setShowDeleteAlert(true);
    };

    const confirmDelete = () => {
        if (selectedExp) {
            setExperienceData(experienceData.filter(item => item.id !== selectedExp.id));
            setShowDeleteAlert(false);
            setSelectedExp(null);
        }
    };

    // Helper for badge colors
    const getJobTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            'Full-time': 'bg-green-100 text-green-700 border-green-200',
            'Freelance': 'bg-blue-100 text-blue-700 border-blue-200',
            'Internship': 'bg-purple-100 text-purple-700 border-purple-200',
            'Contract': 'bg-orange-100 text-orange-700 border-orange-200'
        };
        return colors[type] || 'bg-slate-100 text-slate-700 border-slate-200';
    };

    return (
        <MainLayoutAdmin>
            {/* --- ACTION BAR --- */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative flex-1 max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                        type="text"
                        placeholder="Cari posisi atau perusahaan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-11 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                    />
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                    <Button variant="outline" className="flex-1 sm:flex-none border-slate-200 text-slate-700 rounded-xl">
                        <Filter className="w-4 h-4 mr-2" /> Filter
                    </Button>
                    <Button
                        onClick={() => setShowAddModal(true)}
                        className="flex-1 sm:flex-none bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg rounded-xl"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Pengalaman
                    </Button>
                </div>
            </div>

            {/* --- STATS SUMMARY --- */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Total Jobs', value: experienceData.length, icon: <Briefcase className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-100' },
                    { label: 'Companies', value: '5', icon: <Building2 className="w-5 h-5 text-green-600" />, bg: 'bg-green-100' },
                    { label: 'Years Exp', value: '4+', icon: <Clock className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-100' },
                    { label: 'Skills', value: '15+', icon: <Code className="w-5 h-5 text-orange-600" />, bg: 'bg-orange-100' },
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

            {/* --- EXPERIENCE LIST --- */}
            <div className="space-y-6 mb-6">
                {currentExperience.length > 0 ? (
                    currentExperience.map((exp) => (
                        <Card key={exp.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                            <div className="relative">
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-linear-to-b from-orange-500 to-orange-600"></div>

                                <CardContent className="p-6 pl-8">
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-start gap-4">
                                                <div className="w-14 h-14 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform shrink-0">
                                                    <Briefcase className="w-7 h-7" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors mb-1">
                                                        {exp.posisi}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-slate-700 mb-2">
                                                        <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
                                                        <span className="font-medium">{exp.perusahaan}</span>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 mb-3">
                                                        <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md">
                                                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                                            <span>{exp.periode}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md">
                                                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                                                            <span>{exp.lama_bekerja}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md">
                                                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                                                            <span>{exp.lokasi}</span>
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getJobTypeColor(exp.jenis_pekerjaan)}`}>
                                                            {exp.jenis_pekerjaan}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                                                {exp.deskripsi}
                                            </p>

                                            {exp.keahlian && (
                                                <div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {exp.keahlian.split(',').map((skill, i) => (
                                                            <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-full text-xs font-medium hover:border-orange-200 hover:text-orange-600 transition-colors">
                                                                <Code className="w-3 h-3" />
                                                                {skill.trim()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {exp.link_proyek && (
                                                <a href={exp.link_proyek} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors mt-2">
                                                    <ExternalLink className="w-4 h-4" />
                                                    Lihat Website Perusahaan
                                                </a>
                                            )}
                                        </div>

                                        <div className="flex lg:flex-col gap-2 lg:ml-4">
                                            <Button size="sm" variant="outline" className="flex-1 lg:flex-none border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg" onClick={() => handleEdit(exp)}>
                                                <Edit className="w-4 h-4 lg:mr-2" />
                                                <span className="hidden lg:inline">Edit</span>
                                            </Button>
                                            <Button size="sm" variant="outline" className="flex-1 lg:flex-none border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg" onClick={() => handleDelete(exp)}>
                                                <Trash2 className="w-4 h-4 lg:mr-2" />
                                                <span className="hidden lg:inline">Delete</span>
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Data tidak ditemukan</h3>
                        <p className="text-slate-500">Coba kata kunci lain atau tambahkan pengalaman baru.</p>
                    </div>
                )}
            </div>

            {/* --- PAGINATION --- */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-600">
                        Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredExperience.length)} dari {filteredExperience.length} data
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

            {/* --- DELETE ALERT --- */}
            {showDeleteAlert && (
                <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-md border-0 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                        <CardHeader className="border-b border-slate-100">
                            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <Trash2 className="w-5 h-5 text-red-600" />
                                Hapus Pengalaman?
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <p className="text-slate-600 mb-6">
                                Apakah Anda yakin ingin menghapus posisi <strong>{selectedExp?.posisi}</strong> di <strong>{selectedExp?.perusahaan}</strong>?
                            </p>
                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1 border-slate-200 rounded-xl" onClick={() => setShowDeleteAlert(false)}>
                                    Batal
                                </Button>
                                <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl" onClick={confirmDelete}>
                                    Hapus
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* --- ADD / EDIT MODAL --- */}
            {(showAddModal || showEditModal) && (
                <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-3xl border-0 shadow-2xl my-8 scale-100 animate-in zoom-in-95 duration-200">
                        <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
                            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                {showAddModal ? <Plus className="w-5 h-5 text-orange-600" /> : <Edit className="w-5 h-5 text-orange-600" />}
                                {showAddModal ? 'Tambah Pengalaman Baru' : 'Edit Pengalaman'}
                            </CardTitle>
                            <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="text-slate-400 hover:text-slate-700">
                                <X className="w-6 h-6" />
                            </button>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Posisi *</Label>
                                        <Input placeholder="Contoh: Senior Frontend Developer" className="mt-1 rounded-xl" />
                                    </div>
                                    <div>
                                        <Label>Jenis Pekerjaan *</Label>
                                        <select className="w-full mt-1 h-10 px-3 border border-slate-200 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                                            <option value="">Pilih jenis</option>
                                            <option value="Full-time">Full-time</option>
                                            <option value="Freelance">Freelance</option>
                                            <option value="Internship">Internship</option>
                                            <option value="Contract">Contract</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Perusahaan *</Label>
                                        <Input placeholder="Contoh: Tokopedia" className="mt-1 rounded-xl" />
                                    </div>
                                    <div>
                                        <Label>Lokasi *</Label>
                                        <Input placeholder="Contoh: Jakarta Selatan (Hybrid)" className="mt-1 rounded-xl" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <Button
                                    variant="outline"
                                    className="flex-1 border-slate-200 rounded-xl"
                                    onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
                                >
                                    Batal
                                </Button>
                                <Button
                                    className="flex-1 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-xl"
                                >
                                    Simpan
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </MainLayoutAdmin>
    );
}