'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Plus, Edit, Trash2, MapPin, Calendar, ChevronLeft, ChevronRight,
    BookOpen, Trophy, Clock, Building2, GraduationCap, Search, Filter, X, Loader2
} from 'lucide-react';
import MainLayoutAdmin from '@/components/layout/MainLayoutAdmin';
import supabase from '@/lib/db';
import toast from 'react-hot-toast';

// 1. Interface Sesuai Tabel Database 'educations'
interface Education {
    id: string;
    tempat_pendidikan: string;
    gelar: string;
    bidang_studi: string;
    periode: string;
    nilai: string;
    deskripsi: string;
    keahlian_pendidikan: string; // Disimpan sebagai text string (pisahkan koma)
    link_institusi: string;
    created_at: string;
}

export default function PendidikanAdminPage() {
    // --- STATE UTAMA ---
    const [educationData, setEducationData] = useState<Education[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    // --- STATE UI ---
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Modal States
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [selectedEdu, setSelectedEdu] = useState<Education | null>(null);

    const itemsPerPage = 5;

    // 2. FETCH DATA DARI SUPABASE
    const fetchEducation = async () => {
        setIsLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('educations')
                .select('*')
                .eq('admin_id', user.id)
                .order('created_at', { ascending: false }); // Urutkan dari yang terbaru dibuat

            if (error) throw error;
            setEducationData(data || []);
        } catch (error: any) {
            console.error('Error fetching education:', error);
            toast.error('Gagal memuat data pendidikan.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEducation();
    }, []);

    // 3. LOGIK FILTERING (SEARCH)
    const filteredEducation = educationData.filter(edu =>
        edu.gelar?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        edu.tempat_pendidikan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        edu.bidang_studi?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 4. LOGIK PAGINATION
    const totalPages = Math.ceil(filteredEducation.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentEducation = filteredEducation.slice(startIndex, startIndex + itemsPerPage);

    // 5. HELPER: Warna Badge Status (Simulasi logika sederhana)
    const getStatusColor = (periode: string) => {
        if (!periode) return 'bg-slate-100 text-slate-700 border-slate-200';
        const lower = periode.toLowerCase();
        if (lower.includes('sekarang') || lower.includes('present')) return 'bg-orange-100 text-orange-700 border-orange-200'; // Sedang berjalan
        return 'bg-green-100 text-green-700 border-green-200'; // Selesai
    };

    // 6. HANDLER DELETE (Langsung diaktifkan)
    const handleDelete = (edu: Education) => {
        setSelectedEdu(edu);
        setShowDeleteAlert(true);
    };

    const confirmDelete = async () => {
        if (!selectedEdu) return;
        setIsDeleting(true);
        try {
            const { error } = await supabase
                .from('educations')
                .delete()
                .eq('id', selectedEdu.id);

            if (error) throw error;

            toast.success("Data pendidikan berhasil dihapus");
            fetchEducation(); // Refresh data
        } catch (error: any) {
            toast.error("Gagal menghapus: " + error.message);
        } finally {
            setIsDeleting(false);
            setShowDeleteAlert(false);
            setSelectedEdu(null);
        }
    };

    // Placeholder Handlers untuk Add/Edit (Nanti diimplementasikan)
    const handleEdit = (edu: Education) => {
        setSelectedEdu(edu);
        setShowEditModal(true);
        // Nanti isi form disini
    };

    return (
        <MainLayoutAdmin>

            {/* --- ACTION BAR --- */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative flex-1 max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                        type="text"
                        placeholder="Cari gelar, jurusan, atau kampus..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
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
                        Tambah Pendidikan
                    </Button>
                </div>
            </div>

            {/* --- STATS SUMMARY --- */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Total Riwayat', value: educationData.length, icon: <GraduationCap className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-100' },
                    // Hitung unik institusi
                    { label: 'Institusi', value: new Set(educationData.map(e => e.tempat_pendidikan)).size, icon: <Building2 className="w-5 h-5 text-orange-600" />, bg: 'bg-orange-100' },
                    { label: 'Gelar', value: new Set(educationData.map(e => e.gelar)).size, icon: <Trophy className="w-5 h-5 text-green-600" />, bg: 'bg-green-100' },
                    { label: 'Status', value: 'Active', icon: <BookOpen className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-100' },
                ].map((stat, index) => (
                    <Card key={index} className="border-0 shadow-md">
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

            {/* --- CONTENT AREA --- */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
                    <p className="text-slate-500">Memuat riwayat pendidikan...</p>
                </div>
            ) : filteredEducation.length > 0 ? (
                // --- TIMELINE LIST ---
                <div className="space-y-6 mb-6">
                    {currentEducation.map((edu) => (
                        <Card
                            key={edu.id}
                            className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                        >
                            <div className="relative">
                                {/* Timeline Indicator Strip */}
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-linear-to-b from-orange-500 to-orange-600"></div>

                                <CardContent className="p-6 pl-8">
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                        {/* Left Content */}
                                        <div className="flex-1 space-y-4">

                                            {/* Header: Icon & Title */}
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform shrink-0">
                                                            <GraduationCap className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                                                                {edu.gelar}
                                                            </h3>
                                                            <p className="text-sm font-medium text-orange-600">{edu.bidang_studi}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-slate-700 mb-2">
                                                        <Building2 className="w-4 h-4 text-slate-500" />
                                                        <span className="font-medium">{edu.tempat_pendidikan}</span>
                                                    </div>

                                                    {/* Metadata: Date, GPA */}
                                                    <div className="flex flex-wrap items-center gap-4 text-sm mb-3">
                                                        <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                                            <Calendar className="w-4 h-4 text-slate-500" />
                                                            <span>{edu.periode}</span>
                                                        </div>

                                                        {edu.nilai && (
                                                            <div className="flex items-center gap-2 bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">
                                                                <Trophy className="w-4 h-4 text-yellow-600" />
                                                                <span className="font-medium text-yellow-700">Nilai: {edu.nilai}</span>
                                                            </div>
                                                        )}

                                                        {/* Status Badge berdasarkan periode */}
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(edu.periode)}`}>
                                                            {edu.periode.toLowerCase().includes('sekarang') ? 'Sedang Berjalan' : 'Selesai'}
                                                        </span>
                                                    </div>

                                                    {/* Description */}
                                                    {edu.deskripsi && (
                                                        <p className="text-sm text-slate-600 leading-relaxed mb-3">
                                                            {edu.deskripsi}
                                                        </p>
                                                    )}

                                                    {/* Achievements Tags / Keahlian */}
                                                    {edu.keahlian_pendidikan && (
                                                        <div className="flex flex-wrap gap-2">
                                                            {edu.keahlian_pendidikan.split(',').map((skill, i) => (
                                                                <span
                                                                    key={i}
                                                                    className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-[10px] font-medium border border-orange-100"
                                                                >
                                                                    <BookOpen className="w-3 h-3" />
                                                                    {skill.trim()}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex lg:flex-col gap-2 lg:ml-4 border-t lg:border-t-0 pt-4 lg:pt-0 mt-2 lg:mt-0">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex-1 lg:flex-none border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg"
                                                onClick={() => handleEdit(edu)}
                                            >
                                                <Edit className="w-4 h-4 lg:mr-2" />
                                                <span className="hidden lg:inline">Edit</span>
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex-1 lg:flex-none border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg"
                                                onClick={() => handleDelete(edu)}
                                            >
                                                <Trash2 className="w-4 h-4 lg:mr-2" />
                                                <span className="hidden lg:inline">Delete</span>
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                // --- EMPTY STATE ---
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed mb-6">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        {searchQuery ? <Search className="w-8 h-8 text-slate-300" /> : <GraduationCap className="w-8 h-8 text-slate-300" />}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                        {searchQuery ? 'Tidak ditemukan' : 'Belum ada data pendidikan'}
                    </h3>
                    <p className="text-slate-500 mb-6">
                        {searchQuery
                            ? `Tidak ada hasil untuk "${searchQuery}"`
                            : 'Tambahkan riwayat pendidikan, sekolah, atau kursus Anda di sini.'}
                    </p>
                    {!searchQuery && (
                        <Button
                            onClick={() => setShowAddModal(true)}
                            className="bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-xl shadow-lg hover:shadow-xl"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Pendidikan Pertama
                        </Button>
                    )}
                </div>
            )}

            {/* --- PAGINATION --- */}
            {!isLoading && filteredEducation.length > itemsPerPage && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-600">
                        Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredEducation.length)} dari {filteredEducation.length} data
                    </p>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="border-slate-200 rounded-lg"
                        >
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

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="border-slate-200 rounded-lg"
                        >
                            Next <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* --- MODAL DELETE --- */}
            {showDeleteAlert && (
                <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-md border-0 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                        <CardHeader className="border-b border-slate-100">
                            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <Trash2 className="w-5 h-5 text-red-600" />
                                Hapus Pendidikan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <p className="text-slate-600 mb-6">
                                Apakah Anda yakin ingin menghapus <strong>"{selectedEdu?.gelar}"</strong> di <strong>"{selectedEdu?.tempat_pendidikan}"</strong>? Tindakan ini tidak dapat dibatalkan.
                            </p>
                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1 border-slate-200 rounded-xl" onClick={() => setShowDeleteAlert(false)}>
                                    Batal
                                </Button>
                                <Button
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl"
                                    onClick={confirmDelete}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Hapus'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* --- MODAL ADD / EDIT (Placeholder visual saja, belum fungsional untuk update/insert) --- */}
            {(showAddModal || showEditModal) && (
                <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-2xl border-0 shadow-2xl my-8 scale-100 animate-in zoom-in-95 duration-200">
                        <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
                            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                {showAddModal ? <Plus className="w-5 h-5 text-orange-600" /> : <Edit className="w-5 h-5 text-orange-600" />}
                                {showAddModal ? 'Tambah Pendidikan Baru' : 'Edit Data Pendidikan'}
                            </CardTitle>
                            <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="text-slate-400 hover:text-slate-700">
                                <X className="w-6 h-6" />
                            </button>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="text-center py-10">
                                <p className="text-slate-500">Form Add/Edit akan kita aktifkan pada langkah selanjutnya.</p>
                                <Button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="mt-4">Tutup</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

        </MainLayoutAdmin>
    );
}