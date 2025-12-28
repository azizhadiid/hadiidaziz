'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Search, Plus, Edit, Trash2, Eye, Filter, ChevronLeft, ChevronRight,
    Calendar, Building, CheckCircle, Award, X, UploadCloud, Loader2, Link as IconLink
} from 'lucide-react';
import MainLayoutAdmin from '@/components/layout/MainLayoutAdmin';
import supabase from '@/lib/db';
import toast from 'react-hot-toast';

// Interface Data
interface Certificate {
    id: string;
    nama_sertifikat: string;
    organisasi_sertifikat: string;
    periode_sertifikat: string;
    no_sertifikat: string;
    foto_sertifikat: string | null;
    link_organisasi: string;
    created_at: string;
}

export default function SertifikatAdminPage() {
    // --- STATE UTAMA ---
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false); // Loading saat simpan
    const [isDeleting, setIsDeleting] = useState(false); // Loading saat hapus

    // --- STATE UI ---
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

    // --- STATE FORM (ADD) ---
    const [formData, setFormData] = useState({
        nama_sertifikat: '',
        organisasi_sertifikat: '',
        periode_sertifikat: '',
        no_sertifikat: '',
        link_organisasi: ''
    });
    // State khusus file
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // State khusus edit
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingCert, setEditingCert] = useState<any>(null)


    const itemsPerPage = 6;

    // 1. FETCH DATA
    const fetchCertificates = async () => {
        setIsLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('certificates')
                .select('*')
                .eq('admin_id', user.id) // Filter by User Login
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCertificates(data || []);
        } catch (error: any) {
            console.error('Error:', error);
            toast.error('Gagal memuat data sertifikat.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCertificates();
    }, []);

    // 2. HANDLER INPUT FORM
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    // 3. HANDLER FILE SELECT & PREVIEW (VALIDASI 2MB)
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Validasi Ukuran (2MB = 2 * 1024 * 1024 bytes)
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Ukuran file terlalu besar! Maksimal 2MB.");
                e.target.value = ''; // Reset input
                return;
            }

            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file)); // Buat preview lokal
        }
    };

    // 4. HANDLER SIMPAN DATA (UPLOAD + INSERT)
    const handleSave = async () => {
        // Validasi Input Wajib
        if (!formData.nama_sertifikat || !formData.organisasi_sertifikat) {
            toast.error("Nama Sertifikat dan Penerbit wajib diisi!");
            return;
        }

        setIsSaving(true);
        try {
            // A. Ambil Admin ID
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Sesi habis, silakan login ulang.");

            let finalImageUrl = null;

            // B. Proses Upload Gambar (Jika ada file dipilih)
            if (selectedFile) {
                const fileExt = selectedFile.name.split('.').pop();
                // Nama file unik: userID-timestamp.ext
                const fileName = `${user.id}-${Date.now()}.${fileExt}`;
                const filePath = `${fileName}`;

                // Upload ke bucket 'certificates'
                const { error: uploadError } = await supabase.storage
                    .from('certificates')
                    .upload(filePath, selectedFile);

                if (uploadError) throw uploadError;

                // Ambil Public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('certificates')
                    .getPublicUrl(filePath);

                finalImageUrl = publicUrl;
            }

            // C. Proses Insert ke Database
            const { error: insertError } = await supabase
                .from('certificates')
                .insert({
                    admin_id: user.id, // Relasi ke Admin Profile
                    nama_sertifikat: formData.nama_sertifikat,
                    organisasi_sertifikat: formData.organisasi_sertifikat,
                    periode_sertifikat: formData.periode_sertifikat,
                    no_sertifikat: formData.no_sertifikat,
                    link_organisasi: formData.link_organisasi,
                    foto_sertifikat: finalImageUrl // URL gambar atau null
                });

            if (insertError) throw insertError;

            toast.success("Sertifikat berhasil ditambahkan!");
            setShowAddModal(false);
            resetForm();
            fetchCertificates(); // Refresh data

        } catch (error: any) {
            console.error("Save Error:", error);
            toast.error("Gagal menyimpan: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const resetForm = () => {
        setFormData({
            nama_sertifikat: '',
            organisasi_sertifikat: '',
            periode_sertifikat: '',
            no_sertifikat: '',
            link_organisasi: ''
        });
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // Filter & Pagination Logic
    const filteredCertificates = certificates.filter(cert =>
        cert.nama_sertifikat.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.organisasi_sertifikat.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentCertificates = filteredCertificates.slice(startIndex, startIndex + itemsPerPage);

    // --- HANDLER DELETE ---
    const handleDeleteClick = (cert: Certificate) => {
        setSelectedCert(cert);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedCert) return;
        setIsDeleting(true);

        try {
            // 1. Cek apakah ada gambar yang perlu dihapus dari Storage
            if (selectedCert.foto_sertifikat) {
                // Ekstrak nama file dari URL
                // URL: .../public/certificates/[FILENAME]
                const imageUrl = selectedCert.foto_sertifikat;
                const fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);

                // Hapus file dari bucket 'certificates'
                const { error: storageError } = await supabase.storage
                    .from('certificates')
                    .remove([fileName]);

                if (storageError) console.warn("Gagal hapus gambar lama:", storageError.message);
            }

            // 2. Hapus Data dari Database
            const { error } = await supabase
                .from('certificates')
                .delete()
                .eq('id', selectedCert.id);

            if (error) throw error;

            // 3. Notifikasi Sukses Sesuai Request
            toast.success(`Sertifikat "${selectedCert.nama_sertifikat}" telah berhasil terhapus`, {
                icon: '🗑️',
                duration: 4000
            });

            // 4. Refresh Data
            fetchCertificates();

        } catch (error: any) {
            toast.error("Gagal menghapus: " + error.message);
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
            setSelectedCert(null);
        }
    };

    // Hendle edit
    const handleEditClick = (cert: any) => {
        setEditingCert(cert)

        setFormData({
            nama_sertifikat: cert.nama_sertifikat,
            organisasi_sertifikat: cert.organisasi_sertifikat,
            periode_sertifikat: cert.periode_sertifikat || '',
            no_sertifikat: cert.no_sertifikat || '',
            link_organisasi: cert.link_organisasi || '',
        })

        setPreviewUrl(cert.foto_sertifikat || null)
        setSelectedFile(null)

        setShowEditModal(true)
    }

    // Handle Upadet
    const handleUpdate = async () => {
        if (!editingCert) return

        setIsSaving(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Sesi habis')

            let finalImageUrl = previewUrl

            // 🔥 JIKA USER PILIH GAMBAR BARU
            if (selectedFile) {
                const fileExt = selectedFile.name.split('.').pop()
                const fileName = `${user.id}-${Date.now()}.${fileExt}`

                // Upload ke storage
                const { error: uploadError } = await supabase.storage
                    .from('certificates')
                    .upload(fileName, selectedFile)

                if (uploadError) throw uploadError

                // Ambil public URL
                const { data } = supabase.storage
                    .from('certificates')
                    .getPublicUrl(fileName)

                finalImageUrl = data.publicUrl
            }

            // 🔥 UPDATE DATABASE
            const { error } = await supabase
                .from('certificates') // ⬅️ PERBAIKAN NAMA TABEL
                .update({
                    nama_sertifikat: formData.nama_sertifikat,
                    organisasi_sertifikat: formData.organisasi_sertifikat,
                    periode_sertifikat: formData.periode_sertifikat,
                    no_sertifikat: formData.no_sertifikat,
                    link_organisasi: formData.link_organisasi,
                    foto_sertifikat: finalImageUrl,
                })
                .eq('id', editingCert.id)

            if (error) throw error

            toast.success('Sertifikat berhasil diperbarui ✨')
            setShowEditModal(false)
            resetForm()
            fetchCertificates()

        } catch (error: any) {
            console.error(error)
            toast.error('Gagal update: ' + error.message)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <MainLayoutAdmin>

            {/* Header & Search */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative flex-1 max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                        type="text"
                        placeholder="Cari sertifikat atau penerbit..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        className="pl-10 h-11 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                    />
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <Button variant="outline" className="flex-1 sm:flex-none border-slate-200 text-slate-700 rounded-xl">
                        <Filter className="w-4 h-4 mr-2" /> Filter
                    </Button>
                    <Button onClick={() => setShowAddModal(true)} className="flex-1 sm:flex-none bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-xl shadow-lg">
                        <Plus className="w-4 h-4 mr-2" /> Tambah Sertifikat
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Total', value: certificates.length, icon: <Award className="w-5 h-5 text-orange-600" />, bg: 'bg-orange-100' },
                    { label: 'Penerbit', value: new Set(certificates.map(c => c.organisasi_sertifikat)).size, icon: <Building className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-100' },
                    { label: 'Tahun Ini', value: certificates.filter(c => c.created_at.includes(new Date().getFullYear().toString())).length, icon: <Calendar className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-100' },
                    { label: 'Status', value: 'Active', icon: <CheckCircle className="w-5 h-5 text-green-600" />, bg: 'bg-green-100' },
                ].map((stat, idx) => (
                    <Card key={idx} className="border-0 shadow-md">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center`}>{stat.icon}</div>
                                <div><p className="text-2xl font-bold text-slate-900">{stat.value}</p><p className="text-xs text-slate-500">{stat.label}</p></div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Grid Data */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
                    <p className="text-slate-500">Memuat data sertifikat...</p>
                </div>
            ) : filteredCertificates.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {currentCertificates.map((cert) => (
                        <Card key={cert.id} className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden bg-white flex flex-col h-full">

                            {/* --- DISPLAY IMAGE --- */}
                            <div className="relative h-48 overflow-hidden bg-slate-200 shrink-0 border-b border-slate-100">
                                {cert.foto_sertifikat ? (
                                    <img
                                        src={cert.foto_sertifikat}
                                        alt={cert.nama_sertifikat}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                                        <Award className="w-12 h-12" />
                                    </div>
                                )}

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>

                                {/* Tombol View */}
                                {cert.foto_sertifikat && (
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <a href={cert.foto_sertifikat} target="_blank" rel="noreferrer" className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-slate-700 hover:text-orange-600 shadow-lg cursor-pointer transform hover:scale-110 transition-transform">
                                            <Eye className="w-4 h-4" />
                                        </a>
                                    </div>
                                )}
                            </div>

                            <CardContent className="p-5 flex flex-col flex-1">
                                <div className="mb-4 flex-1">
                                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors" title={cert.nama_sertifikat}>{cert.nama_sertifikat}</h3>
                                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-2"><Building className="w-4 h-4 shrink-0" /><span className="line-clamp-1">{cert.organisasi_sertifikat}</span></div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500"><Calendar className="w-4 h-4 shrink-0" /><span>{cert.periode_sertifikat || '-'}</span></div>
                                </div>
                                <div className="pt-4 border-t border-slate-100 mt-auto">
                                    <p className="text-xs text-slate-500 mb-3 font-mono truncate">No: {cert.no_sertifikat || '-'}</p>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg"
                                            onClick={() => handleEditClick(cert)}
                                        >
                                            <Edit className="w-3 h-3 mr-1" />
                                            Edit
                                        </Button>
                                        <Button size="sm" variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg" onClick={() => handleDeleteClick(cert)}><Trash2 className="w-3 h-3 mr-1" />Delete</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed mb-6">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        {searchQuery ? <Search className="w-8 h-8 text-slate-300" /> : <Award className="w-8 h-8 text-slate-300" />}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{searchQuery ? 'Tidak ditemukan' : 'Belum ada sertifikat'}</h3>
                    <p className="text-slate-500 mb-6">{searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : 'Mulai tambahkan sertifikat profesional Anda di sini.'}</p>
                    {!searchQuery && <Button onClick={() => setShowAddModal(true)} className="bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-xl shadow-lg"><Plus className="w-4 h-4 mr-2" />Tambah Sertifikat Pertama</Button>}
                </div>
            )}

            {/* Pagination */}
            {!isLoading && filteredCertificates.length > itemsPerPage && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-600">Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredCertificates.length)} dari {filteredCertificates.length} data</p>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="border-slate-200 rounded-lg"><ChevronLeft className="w-4 h-4" />Prev</Button>
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="border-slate-200 rounded-lg">Next<ChevronRight className="w-4 h-4" /></Button>
                    </div>
                </div>
            )}

            {/* --- MODAL ADD --- */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Tambah Sertifikat Baru</h3>
                            <button onClick={() => { setShowAddModal(false); resetForm(); }} className="text-slate-400 hover:text-slate-700"><X className="w-6 h-6" /></button>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="nama_sertifikat">Nama Sertifikat <span className="text-red-500">*</span></Label>
                                <Input id="nama_sertifikat" value={formData.nama_sertifikat} onChange={handleInputChange} placeholder="Contoh: AWS Cloud Practitioner" className="rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="organisasi_sertifikat">Penerbit (Organisasi) <span className="text-red-500">*</span></Label>
                                <Input id="organisasi_sertifikat" value={formData.organisasi_sertifikat} onChange={handleInputChange} placeholder="Contoh: Amazon Web Services" className="rounded-xl" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="periode_sertifikat">Periode / Tanggal</Label>
                                    <Input id="periode_sertifikat" value={formData.periode_sertifikat} onChange={handleInputChange} placeholder="Contoh: Jan 2024 - 2027" className="rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="no_sertifikat">Credential ID</Label>
                                    <Input id="no_sertifikat" value={formData.no_sertifikat} onChange={handleInputChange} placeholder="No. Sertifikat (Opsional)" className="rounded-xl" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="link_organisasi">Link Verifikasi (Opsional)</Label>
                                <div className="relative">
                                    <IconLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input id="link_organisasi" value={formData.link_organisasi} onChange={handleInputChange} placeholder="https://..." className="pl-10 rounded-xl" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Upload Gambar Sertifikat</Label>
                                <div
                                    className={`border-2 border-dashed ${previewUrl ? 'border-orange-500 bg-orange-50' : 'border-slate-200'} rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer relative overflow-hidden`}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" className="h-32 object-contain rounded-md shadow-sm" />
                                    ) : (
                                        <>
                                            <UploadCloud className="w-10 h-10 text-slate-400 mb-2" />
                                            <p className="text-sm font-medium text-slate-700">Klik untuk upload gambar</p>
                                            <p className="text-xs text-slate-400">PNG, JPG up to 2MB</p>
                                        </>
                                    )}
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
                                </div>
                                {previewUrl && (
                                    <button onClick={(e) => { e.stopPropagation(); setPreviewUrl(null); setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="text-xs text-red-500 underline text-center w-full block mt-2">Hapus Gambar</button>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <Button variant="outline" className="flex-1 rounded-xl" onClick={() => { setShowAddModal(false); resetForm(); }}>Batal</Button>
                            <Button
                                className="flex-1 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-xl"
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</> : 'Simpan Data'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL DELETE --- */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 scale-100 animate-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto"><Trash2 className="w-6 h-6 text-red-600" /></div>
                        <h3 className="text-lg font-bold text-center text-slate-900 mb-2">Hapus Sertifikat?</h3>
                        <p className="text-sm text-center text-slate-500 mb-6">Apakah Anda yakin ingin menghapus <strong>"{selectedCert?.nama_sertifikat}"</strong>?</p>
                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowDeleteModal(false)}>Batal</Button>

                            {/* Tombol Hapus dengan Loading */}
                            <Button
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl"
                                onClick={confirmDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : 'Ya, Hapus'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Edit */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">

                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-900">
                                Edit Sertifikat
                            </h3>
                            <button
                                onClick={() => {
                                    setShowEditModal(false)
                                    resetForm()
                                }}
                                className="text-slate-400 hover:text-slate-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Form (SAMA DENGAN TAMBAH) */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Nama Sertifikat</Label>
                                <Input
                                    value={formData.nama_sertifikat}
                                    onChange={handleInputChange}
                                    id="nama_sertifikat"
                                    className="rounded-xl"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Penerbit</Label>
                                <Input
                                    value={formData.organisasi_sertifikat}
                                    onChange={handleInputChange}
                                    id="organisasi_sertifikat"
                                    className="rounded-xl"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Periode</Label>
                                    <Input
                                        value={formData.periode_sertifikat}
                                        onChange={handleInputChange}
                                        id="periode_sertifikat"
                                        className="rounded-xl"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>No Sertifikat</Label>
                                    <Input
                                        value={formData.no_sertifikat}
                                        onChange={handleInputChange}
                                        id="no_sertifikat"
                                        className="rounded-xl"
                                    />
                                </div>
                            </div>

                            {/* Upload Gambar */}
                            <div className="space-y-2">
                                <Label>Gambar Sertifikat</Label>
                                <div
                                    className={`border-2 border-dashed rounded-xl p-6 flex justify-center cursor-pointer ${previewUrl ? 'border-orange-500 bg-orange-50' : 'border-slate-200'
                                        }`}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {previewUrl ? (
                                        <img src={previewUrl} className="h-32 object-contain" />
                                    ) : (
                                        <UploadCloud className="w-10 h-10 text-slate-400" />
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex gap-3 mt-8">
                            <Button
                                variant="outline"
                                className="flex-1 rounded-xl"
                                onClick={() => setShowEditModal(false)}
                            >
                                Batal
                            </Button>

                            <Button
                                className="flex-1 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-xl"
                                onClick={handleUpdate}
                            >
                                Simpan Perubahan
                            </Button>
                        </div>
                    </div>
                </div>
            )}

        </MainLayoutAdmin>
    );
}