'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Eye,
    Download,
    Filter,
    ChevronLeft,
    ChevronRight,
    Calendar,
    Building,
    CheckCircle,
    Award,
    X,
    UploadCloud,
    Loader2
} from 'lucide-react';
import MainLayoutAdmin from '@/components/layout/MainLayoutAdmin';
import supabase from '@/lib/db';
import toast from 'react-hot-toast';

// 1. Sesuaikan Interface dengan Database
interface Certificate {
    id: string;
    nama_sertifikat: string;
    organisasi_sertifikat: string;
    periode_sertifikat: string;
    no_sertifikat: string;
    foto_sertifikat: string | null;
    keahlian: string; // Disimpan sebagai string text di DB
    link_organisasi: string;
    created_at: string;
}

export default function SertifikatAdminPage() {
    // State Data
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // State UI & Filter
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // State Modal (Disiapkan untuk fitur selanjutnya)
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

    const itemsPerPage = 6;

    // 2. Fetch Data dari Supabase
    useEffect(() => {
        const fetchCertificates = async () => {
            setIsLoading(true);
            try {
                // Ambil User Login
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return; // Middleware akan handle redirect

                // Query Data
                const { data, error } = await supabase
                    .from('certificates')
                    .select('*')
                    .eq('admin_id', user.id) // Filter punya admin ini saja
                    .order('created_at', { ascending: false });

                if (error) throw error;

                setCertificates(data || []);
            } catch (error: any) {
                console.error('Error fetching certificates:', error);
                toast.error('Gagal memuat data sertifikat.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCertificates();
    }, []);

    // 3. Logic Searching & Filtering
    const filteredCertificates = certificates.filter(cert =>
        cert.nama_sertifikat.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.organisasi_sertifikat.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 4. Logic Pagination
    const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentCertificates = filteredCertificates.slice(startIndex, startIndex + itemsPerPage);

    // Handlers (Placeholder untuk Delete/Edit nanti)
    const handleDeleteClick = (cert: Certificate) => {
        setSelectedCert(cert);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        // Logic hapus ke DB akan ditambahkan nanti
        toast.success("Fitur hapus akan segera aktif");
        setShowDeleteModal(false);
    };

    return (
        <MainLayoutAdmin>

            {/* --- HEADER SECTION --- */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                        type="text"
                        placeholder="Cari sertifikat atau penerbit..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1); // Reset ke halaman 1 saat search
                        }}
                        className="pl-10 h-11 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 w-full sm:w-auto">
                    <Button
                        variant="outline"
                        className="flex-1 sm:flex-none border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl"
                    >
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </Button>
                    <Button
                        onClick={() => setShowAddModal(true)}
                        className="flex-1 sm:flex-none bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg rounded-xl"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Sertifikat
                    </Button>
                </div>
            </div>

            {/* --- STATS SUMMARY --- */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Total Sertifikat', value: certificates.length, icon: <Award className="w-5 h-5 text-orange-600" />, bg: 'bg-orange-100' },
                    // Hitung jumlah unik organisasi
                    { label: 'Penerbit', value: new Set(certificates.map(c => c.organisasi_sertifikat)).size, icon: <Building className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-100' },
                    { label: 'Tahun Ini', value: certificates.filter(c => c.created_at.includes(new Date().getFullYear().toString())).length, icon: <Calendar className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-100' },
                    { label: 'Status', value: 'Active', icon: <CheckCircle className="w-5 h-5 text-green-600" />, bg: 'bg-green-100' },
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

            {/* --- CONTENT AREA --- */}
            {isLoading ? (
                // Loading State
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
                    <p className="text-slate-500">Memuat data sertifikat...</p>
                </div>
            ) : filteredCertificates.length > 0 ? (
                // Data List
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {currentCertificates.map((cert) => (
                        <Card
                            key={cert.id}
                            className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden bg-white flex flex-col h-full"
                        >
                            {/* Image Section */}
                            <div className="relative h-48 overflow-hidden bg-slate-100 shrink-0">
                                {cert.foto_sertifikat ? (
                                    <img
                                        src={cert.foto_sertifikat}
                                        alt={cert.nama_sertifikat}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                                        <Award className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Quick Actions Overlay */}
                                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <button className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-700 hover:text-orange-600 shadow-lg hover:scale-110 transition-all cursor-pointer">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Content Section */}
                            <CardContent className="p-5 flex flex-col flex-1">
                                <div className="mb-4 flex-1">
                                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors" title={cert.nama_sertifikat}>
                                        {cert.nama_sertifikat}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                                        <Building className="w-4 h-4 shrink-0" />
                                        <span className="line-clamp-1">{cert.organisasi_sertifikat}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <Calendar className="w-4 h-4 shrink-0" />
                                        {/* Tampilkan periode langsung karena di DB tipenya Text */}
                                        <span>{cert.periode_sertifikat || '-'}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 mt-auto">
                                    <p className="text-xs text-slate-500 mb-3 font-mono truncate">
                                        No: {cert.no_sertifikat || '-'}
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg"
                                            onClick={() => {
                                                // Nanti diisi fungsi edit
                                                alert("Edit: " + cert.nama_sertifikat)
                                            }}
                                        >
                                            <Edit className="w-3 h-3 mr-1" />
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 rounded-lg"
                                            onClick={() => handleDeleteClick(cert)}
                                        >
                                            <Trash2 className="w-3 h-3 mr-1" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                // --- EMPTY STATE ---
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed mb-6">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        {searchQuery ? <Search className="w-8 h-8 text-slate-300" /> : <Award className="w-8 h-8 text-slate-300" />}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                        {searchQuery ? 'Tidak ditemukan' : 'Belum ada sertifikat'}
                    </h3>
                    <p className="text-slate-500 mb-6">
                        {searchQuery
                            ? `Tidak ada hasil untuk "${searchQuery}"`
                            : 'Mulai tambahkan sertifikat profesional Anda di sini.'}
                    </p>
                    {!searchQuery && (
                        <Button
                            onClick={() => setShowAddModal(true)}
                            className="bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-xl shadow-lg hover:shadow-xl"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Sertifikat Pertama
                        </Button>
                    )}
                </div>
            )}

            {/* --- PAGINATION --- */}
            {!isLoading && filteredCertificates.length > itemsPerPage && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-600">
                        Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredCertificates.length)} dari {filteredCertificates.length} data
                    </p>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="border-slate-200 rounded-lg"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Prev
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
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* --- MODAL DELETE (Placeholder UI) --- */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 scale-100 animate-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                            <Trash2 className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-center text-slate-900 mb-2">Hapus Sertifikat?</h3>
                        <p className="text-sm text-center text-slate-500 mb-6">
                            Apakah Anda yakin ingin menghapus <strong>"{selectedCert?.nama_sertifikat}"</strong>? Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowDeleteModal(false)}>
                                Batal
                            </Button>
                            <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl" onClick={confirmDelete}>
                                Ya, Hapus
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL ADD (Placeholder UI) --- */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Tambah Sertifikat Baru</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Placeholder Form Content */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Nama Sertifikat</Label>
                                <Input id="title" placeholder="Contoh: AWS Certified Cloud Practitioner" className="rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="issuer">Penerbit (Organisasi)</Label>
                                <Input id="issuer" placeholder="Contoh: Amazon Web Services" className="rounded-xl" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="date">Periode</Label>
                                    <Input id="date" placeholder="Jan 2024" className="rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="id">Credential ID</Label>
                                    <Input id="id" placeholder="No. Sertifikat" className="rounded-xl" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Upload Gambar</Label>
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer">
                                    <UploadCloud className="w-10 h-10 text-slate-400 mb-2" />
                                    <p className="text-sm font-medium text-slate-700">Klik untuk upload gambar</p>
                                    <p className="text-xs text-slate-400">PNG, JPG up to 2MB</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowAddModal(false)}>
                                Batal
                            </Button>
                            <Button className="flex-1 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-xl" onClick={() => setShowAddModal(false)}>
                                Simpan Data
                            </Button>
                        </div>
                    </div>
                </div>
            )}

        </MainLayoutAdmin>
    );
}