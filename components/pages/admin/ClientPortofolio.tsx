'use client'

import React, { useState, useEffect } from 'react';
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
    ChevronLeft,
    ChevronRight,
    X,
    ExternalLink,
    Loader2,
    UploadCloud,
    ImageIcon
} from 'lucide-react';
import MainLayoutAdmin from '@/components/layout/MainLayoutAdmin';
import supabase from '@/lib/db'; // Pastikan path ini benar
import toast from 'react-hot-toast';

// 1. Definisi Tipe Data Sesuai Database
interface Portfolio {
    id: string; // UUID di database adalah string
    nama_portfolio: string;
    jenis_proyek: string;
    kategori_proyek: string;
    teknologi: string;
    deskripsi_singkat: string;
    lama_pengerjaan: string;
    periode: string;
    deskripsi_proyek: string;
    image_url: string; // Kita simpan URL gambar di sini (tambah kolom ini di DB jika belum ada, atau gunakan logic map)
    link_demo?: string; // Opsional
    link_github?: string; // Opsional
}

export default function AdminPortofolio() {
    // --- STATE UTAMA ---
    const [portfolioData, setPortfolioData] = useState<Portfolio[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // --- STATE UI ---
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [filterCategory, setFilterCategory] = useState('All');

    // --- STATE MODAL ---
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);

    // --- STATE FORM & UPLOAD ---
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        nama_portfolio: '',
        jenis_proyek: '',
        kategori_proyek: 'Fullstack',
        teknologi: '',
        deskripsi_singkat: '',
        lama_pengerjaan: '',
        periode: '',
        deskripsi_proyek: '',
        link_demo: '',
        link_github: ''
    });

    const itemsPerPage = 6;
    const categories = ['All', 'Fullstack', 'Frontend', 'Backend', 'Mobile App'];

    // 1. FETCH DATA
    const fetchPortfolios = async () => {
        setIsLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Note: Pastikan tabel Anda punya kolom 'image_url' atau sesuaikan kodenya
            // Jika di database belum ada kolom image_url, Anda perlu menambahkannya via SQL:
            // alter table public.portfolios add column image_url text;

            const { data, error } = await supabase
                .from('portfolios')
                .select('*')
                .eq('admin_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPortfolioData(data || []);
        } catch (error: any) {
            console.error('Error fetching portfolios:', error);
            toast.error('Gagal memuat data portofolio.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPortfolios();
    }, []);

    // 2. HANDLER INPUT & IMAGE
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        // Handle select element manually mapping or direct id match
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // Limit 2MB
                toast.error("Ukuran gambar maksimal 2MB");
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const resetForm = () => {
        setFormData({
            nama_portfolio: '', jenis_proyek: '', kategori_proyek: 'Fullstack',
            teknologi: '', deskripsi_singkat: '', lama_pengerjaan: '',
            periode: '', deskripsi_proyek: '', link_demo: '', link_github: ''
        });
        setImageFile(null);
        setImagePreview(null);
    };

    const closeModal = () => {
        setShowAddModal(false);
        setSelectedPortfolio(null);
        resetForm();
    };

    // 3. UPLOAD FUNCTION
    const uploadImage = async (file: File): Promise<string | null> => {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('portfolio_images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('portfolio_images')
                .getPublicUrl(filePath);

            return publicUrl;
        } catch (error) {
            console.error("Error uploading image:", error);
            return null;
        }
    };

    // 4. CREATE / UPDATE
    const handleSave = async () => {
        if (!formData.nama_portfolio || !formData.deskripsi_singkat) {
            toast.error("Nama dan deskripsi singkat wajib diisi!");
            return;
        }

        setIsSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Sesi habis.");

            let finalImageUrl = selectedPortfolio?.image_url || '';

            // Jika ada file baru yang dipilih, upload dulu
            if (imageFile) {
                const uploadedUrl = await uploadImage(imageFile);
                if (uploadedUrl) finalImageUrl = uploadedUrl;
            }

            const payload = {
                admin_id: user.id,
                ...formData,
                image_url: finalImageUrl // Pastikan nama kolom di DB sama ('image_url')
            };

            let error;
            if (selectedPortfolio) {
                // Update
                const { error: updateError } = await supabase
                    .from('portfolios')
                    .update({ ...payload, updated_at: new Date().toISOString() })
                    .eq('id', selectedPortfolio.id);
                error = updateError;
            } else {
                // Insert
                const { error: insertError } = await supabase
                    .from('portfolios')
                    .insert(payload);
                error = insertError;
            }

            if (error) throw error;

            toast.success(selectedPortfolio ? "Portofolio diperbarui!" : "Portofolio berhasil ditambahkan!");
            closeModal();
            fetchPortfolios();

        } catch (error: any) {
            toast.error("Gagal menyimpan: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    // 5. PREPARE EDIT
    const handleEditClick = (item: Portfolio) => {
        setSelectedPortfolio(item);
        setFormData({
            nama_portfolio: item.nama_portfolio,
            jenis_proyek: item.jenis_proyek || '',
            kategori_proyek: item.kategori_proyek || 'Fullstack',
            teknologi: item.teknologi || '',
            deskripsi_singkat: item.deskripsi_singkat || '',
            lama_pengerjaan: item.lama_pengerjaan || '',
            periode: item.periode || '',
            deskripsi_proyek: item.deskripsi_proyek || '',
            link_demo: item.link_demo || '',
            link_github: item.link_github || ''
        });
        setImagePreview(item.image_url || null);
        setShowAddModal(true); // Reuse modal tambah untuk edit
    };

    // 6. DELETE
    const handleDeleteClick = (item: Portfolio) => {
        setSelectedPortfolio(item);
        setShowDeleteAlert(true);
    };

    const confirmDelete = async () => {
        if (!selectedPortfolio) return;
        setIsDeleting(true);
        try {
            const { error } = await supabase
                .from('portfolios')
                .delete()
                .eq('id', selectedPortfolio.id);

            if (error) throw error;

            // Opsional: Hapus gambar dari storage jika mau bersih-bersih
            // Tapi butuh logic parsing nama file dari URL

            toast.success("Portofolio dihapus.");
            fetchPortfolios();
        } catch (error: any) {
            toast.error("Gagal menghapus: " + error.message);
        } finally {
            setIsDeleting(false);
            setShowDeleteAlert(false);
            setSelectedPortfolio(null);
        }
    };

    // --- FILTER & PAGINATION LOGIC ---
    const filteredPortfolio = portfolioData.filter(item => {
        const matchSearch = item.nama_portfolio.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.teknologi?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCategory = filterCategory === 'All' || item.kategori_proyek === filterCategory;
        return matchSearch && matchCategory;
    });

    const totalPages = Math.ceil(filteredPortfolio.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPortfolio = filteredPortfolio.slice(startIndex, startIndex + itemsPerPage);

    // Helper Styles
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
        return type === 'Web App' ? 'bg-indigo-100 text-indigo-700' : 'bg-pink-100 text-pink-700';
    };

    return (
        <MainLayoutAdmin>
            {/* --- ACTION BAR --- */}
            <div className="mb-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-1">
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
                    onClick={() => { resetForm(); setShowAddModal(true); }}
                    className="w-full sm:w-auto bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg rounded-xl"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Project
                </Button>
            </div>

            {/* --- LOADING / EMPTY STATE --- */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
                    <p className="text-slate-500">Memuat portofolio...</p>
                </div>
            ) : filteredPortfolio.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed mb-6">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FolderOpen className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Belum ada project</h3>
                    <p className="text-slate-500 mb-6">Mulai tambahkan karya terbaik Anda di sini.</p>
                </div>
            ) : (
                /* --- PORTFOLIO GRID --- */
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {currentPortfolio.map((item) => (
                        <Card key={item.id} className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col h-full">
                            {/* Project Image */}
                            <div className="relative h-48 overflow-hidden bg-slate-100 shrink-0">
                                {item.image_url ? (
                                    <img
                                        src={item.image_url}
                                        alt={item.nama_portfolio}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                                        <ImageIcon className="w-12 h-12" />
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <button
                                    onClick={() => { setSelectedPortfolio(item); setShowDetailModal(true); }}
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-700 hover:text-orange-600 shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 cursor-pointer"
                                >
                                    <Eye className="w-6 h-6" />
                                </button>

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
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getCategoryColor(item.kategori_proyek)}`}>
                                        <Layers className="w-3 h-3 mr-1" />
                                        {item.kategori_proyek}
                                    </span>
                                </div>

                                <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2 flex-1">
                                    {item.deskripsi_singkat}
                                </p>

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

                                <div className="mb-4">
                                    <div className="flex flex-wrap gap-1.5">
                                        {item.teknologi?.split(',').slice(0, 3).map((tech, i) => (
                                            <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-slate-50 text-slate-600 border border-slate-200 rounded text-[10px] font-medium">
                                                {tech.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-auto">
                                    <Button
                                        size="sm" variant="outline"
                                        className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg"
                                        onClick={() => handleEditClick(item)}
                                    >
                                        <Edit className="w-3.5 h-3.5 mr-1.5" /> Edit
                                    </Button>
                                    <Button
                                        size="sm" variant="outline"
                                        className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg"
                                        onClick={() => handleDeleteClick(item)}
                                    >
                                        <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Hapus
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* --- PAGINATION --- */}
            {!isLoading && totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-600">
                        Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredPortfolio.length)} dari {filteredPortfolio.length} project
                    </p>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>
                            <ChevronLeft className="w-4 h-4" /> Prev
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>
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
                            {selectedPortfolio.image_url ? (
                                <img src={selectedPortfolio.image_url} alt={selectedPortfolio.nama_portfolio} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400"><ImageIcon className="w-12 h-12" /></div>
                            )}
                            <button onClick={() => setShowDetailModal(false)} className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur-sm">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 sm:p-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedPortfolio.nama_portfolio}</h2>
                            <div className="space-y-6">
                                <p className="text-slate-600 leading-relaxed text-sm">{selectedPortfolio.deskripsi_proyek}</p>
                                <div className="flex gap-3 pt-4">
                                    <Button className="flex-1 bg-slate-900 text-white hover:bg-slate-800 rounded-xl h-12">
                                        <ExternalLink className="w-4 h-4 mr-2" /> Live Demo
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- ADD/EDIT MODAL --- */}
            {showAddModal && (
                <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-2xl border-0 shadow-2xl max-h-[90vh] overflow-y-auto my-8">
                        <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between sticky top-0 bg-white z-10">
                            <CardTitle className="text-xl font-bold text-slate-900">
                                {selectedPortfolio ? 'Edit Project' : 'Tambah Project Baru'}
                            </CardTitle>
                            <button onClick={closeModal}><X className="w-6 h-6 text-slate-400" /></button>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            {/* Image Upload Area */}
                            <div className="space-y-2">
                                <Label>Thumbnail Project</Label>
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-orange-400 transition-colors bg-slate-50 relative overflow-hidden group">
                                    {imagePreview ? (
                                        <div className="relative w-full h-48 rounded-lg overflow-hidden">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <p className="text-white text-sm font-medium">Klik untuk ganti</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-6">
                                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 text-orange-600">
                                                <UploadCloud className="w-6 h-6" />
                                            </div>
                                            <p className="text-sm font-medium text-slate-700">Klik untuk upload gambar</p>
                                            <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 2MB</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Inputs */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nama_portfolio">Nama Project *</Label>
                                    <Input id="nama_portfolio" value={formData.nama_portfolio} onChange={handleInputChange} placeholder="E-Commerce Dashboard" className="rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="jenis_proyek">Jenis Proyek</Label>
                                    <Input id="jenis_proyek" value={formData.jenis_proyek} onChange={handleInputChange} placeholder="Web App" className="rounded-xl" />
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="kategori_proyek">Kategori</Label>
                                    <select id="kategori_proyek" value={formData.kategori_proyek} onChange={handleInputChange} className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-orange-500 outline-none">
                                        <option value="Fullstack">Fullstack</option>
                                        <option value="Frontend">Frontend</option>
                                        <option value="Backend">Backend</option>
                                        <option value="Mobile App">Mobile App</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lama_pengerjaan">Lama Pengerjaan</Label>
                                    <Input id="lama_pengerjaan" value={formData.lama_pengerjaan} onChange={handleInputChange} placeholder="1 Bulan" className="rounded-xl" />
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="periode">Periode</Label>
                                    <Input id="periode" value={formData.periode} onChange={handleInputChange} placeholder="Jan - Feb 2025" className="rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="teknologi">Teknologi (Pisahkan koma)</Label>
                                    <Input id="teknologi" value={formData.teknologi} onChange={handleInputChange} placeholder="React, Next.js, Tailwind" className="rounded-xl" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="deskripsi_singkat">Deskripsi Singkat *</Label>
                                <Input id="deskripsi_singkat" value={formData.deskripsi_singkat} onChange={handleInputChange} placeholder="Ringkasan..." className="rounded-xl" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="deskripsi_proyek">Deskripsi Lengkap</Label>
                                <textarea id="deskripsi_proyek" value={formData.deskripsi_proyek} onChange={handleInputChange} className="w-full min-h-24 p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500 outline-none resize-y" placeholder="Detail project..." />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <Button variant="outline" className="flex-1 rounded-xl" onClick={closeModal} disabled={isSaving}>Batal</Button>
                                <Button className="flex-1 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-xl" onClick={handleSave} disabled={isSaving}>
                                    {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</> : 'Simpan Project'}
                                </Button>
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
                                Anda yakin ingin menghapus <strong>{selectedPortfolio?.nama_portfolio}</strong>?
                            </p>
                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowDeleteAlert(false)}>Batal</Button>
                                <Button className="flex-1 bg-red-600 text-white hover:bg-red-700 rounded-xl" onClick={confirmDelete} disabled={isDeleting}>
                                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Hapus'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </MainLayoutAdmin>
    );
}