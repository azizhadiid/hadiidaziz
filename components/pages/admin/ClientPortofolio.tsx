'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Plus,
    Search,
    Edit3,
    Trash2,
    X,
    Loader2,
    UploadCloud,
    ImageIcon,
    Github,
    Globe,
    ChevronLeft,
    ChevronRight,
    ArrowUpRight,
    Code2,
    Layers,
    CalendarDays,
    Timer,
    Hash
} from 'lucide-react';
import MainLayoutAdmin from '@/components/layout/MainLayoutAdmin';
import supabase from '@/lib/db';
import toast from 'react-hot-toast';

interface Portfolio {
    id: string;
    nama_portfolio: string;
    jenis_proyek: string;
    kategori_proyek: string;
    teknologi: string;
    deskripsi_singkat: string;
    lama_pengerjaan: string;
    periode: string;
    deskripsi_proyek: string;
    image_url: string;
    link_demo?: string;
    link_github?: string;
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
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);

    // --- STATE FORM ---
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

    const fetchPortfolios = async () => {
        setIsLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { data, error } = await supabase
                .from('portfolios')
                .select('*')
                .eq('admin_id', user.id)
                .order('created_at', { ascending: false });
            if (error) throw error;
            setPortfolioData(data || []);
        } catch (error: any) {
            toast.error('Gagal memuat data.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchPortfolios(); }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) return toast.error("Max 2MB");
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

    const uploadImage = async (file: File): Promise<string | null> => {
        try {
            const fileName = `${Date.now()}-${file.name}`;
            const { error } = await supabase.storage.from('portfolio_images').upload(fileName, file);
            if (error) throw error;
            return supabase.storage.from('portfolio_images').getPublicUrl(fileName).data.publicUrl;
        } catch (error) { return null; }
    };

    const handleSave = async () => {
        if (!formData.nama_portfolio) return toast.error("Nama wajib diisi!");
        setIsSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            let finalImageUrl = selectedPortfolio?.image_url || '';
            if (imageFile) {
                const uploadedUrl = await uploadImage(imageFile);
                if (uploadedUrl) finalImageUrl = uploadedUrl;
            }
            const payload = { admin_id: user?.id, ...formData, image_url: finalImageUrl };
            const { error } = selectedPortfolio
                ? await supabase.from('portfolios').update(payload).eq('id', selectedPortfolio.id)
                : await supabase.from('portfolios').insert(payload);
            if (error) throw error;
            toast.success("Berhasil disimpan");
            closeModal();
            fetchPortfolios();
        } catch (error: any) {
            toast.error("Gagal menyimpan");
        } finally { setIsSaving(false); }
    };

    const handleEditClick = (item: Portfolio) => {
        setSelectedPortfolio(item);
        setFormData({
            nama_portfolio: item.nama_portfolio || '',
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
        setShowAddModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedPortfolio) return;
        setIsDeleting(true);
        try {
            await supabase.from('portfolios').delete().eq('id', selectedPortfolio.id);
            toast.success("Dihapus");
            fetchPortfolios();
        } finally {
            setIsDeleting(false);
            setShowDeleteAlert(false);
        }
    };

    const filteredPortfolio = portfolioData.filter(item =>
        item.nama_portfolio.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (filterCategory === 'All' || item.kategori_proyek === filterCategory)
    );

    const totalPages = Math.ceil(filteredPortfolio.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPortfolio = filteredPortfolio.slice(startIndex, startIndex + itemsPerPage);

    return (
        <MainLayoutAdmin>
            {/* Header Section */}
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between mb-12">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Karya Kreatif</h1>
                    <p className="text-slate-500 font-medium">Etalase pencapaian dan proyek Anda</p>
                </div>
                <Button
                    onClick={() => { resetForm(); setShowAddModal(true); }}
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl px-8 h-14 shadow-lg shadow-orange-200 transition-all active:scale-95 text-base font-bold"
                >
                    <Plus className="w-5 h-5 mr-2 stroke-[3px]" /> Buat Project
                </Button>
            </div>

            {/* Filter & Search */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-10">
                <div className="xl:col-span-2 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Telusuri karya anda..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-base focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 transition-all shadow-sm"
                    />
                </div>
                <div className="xl:col-span-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => { setFilterCategory(cat); setCurrentPage(1); }}
                            className={`px-6 py-3.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${filterCategory === cat
                                ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 -translate-y-0.5'
                                : 'bg-white text-slate-500 border border-slate-200 hover:border-orange-200 hover:text-orange-600 shadow-sm'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Grid */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <div className="w-12 h-12 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin" />
                    <p className="text-slate-400 font-bold animate-pulse">Menyiapkan Galeri...</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {currentPortfolio.map((item) => (
                            <div key={item.id} className="group flex flex-col bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] transition-all duration-500">
                                <div className="aspect-4/3 relative overflow-hidden bg-slate-50">
                                    {item.image_url ? (
                                        <img src={item.image_url} alt={item.nama_portfolio} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full"><ImageIcon className="w-12 h-12 text-slate-200" /></div>
                                    )}
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                                        <button onClick={() => handleEditClick(item)} className="p-4 bg-white rounded-2xl text-slate-900 hover:bg-orange-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300">
                                            <Edit3 className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => { setSelectedPortfolio(item); setShowDeleteAlert(true); }} className="p-4 bg-white rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="absolute top-6 left-6">
                                        <div className="px-4 py-2 bg-white/90 backdrop-blur rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm">
                                            {item.kategori_proyek}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-orange-600 transition-colors line-clamp-1">{item.nama_portfolio}</h3>
                                        <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-orange-500" />
                                    </div>
                                    <p className="text-slate-500 text-sm line-clamp-2 mb-6 leading-relaxed flex-1 italic font-medium">"{item.deskripsi_singkat}"</p>
                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Layers className="w-4 h-4" />
                                            <span className="text-xs font-bold text-slate-600 line-clamp-1">{item.jenis_proyek}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <CalendarDays className="w-4 h-4" />
                                            <span className="text-xs font-bold text-slate-600 line-clamp-1">{item.periode}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-2">
                                            {item.link_github && (
                                                <a href={item.link_github} target="_blank" className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"><Github className="w-5 h-5" /></a>
                                            )}
                                            {item.link_demo && (
                                                <a href={item.link_demo} target="_blank" className="p-3 bg-orange-50 text-orange-400 hover:text-orange-600 hover:bg-orange-100 rounded-xl transition-all"><Globe className="w-5 h-5" /></a>
                                            )}
                                        </div>
                                        <div className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">2026 EDITION</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-100 pt-10">
                            <p className="text-sm text-slate-400 font-bold">Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredPortfolio.length)} dari {filteredPortfolio.length} Project</p>
                            <div className="flex items-center gap-3">
                                <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-orange-500 disabled:opacity-30 transition-all shadow-sm active:scale-90"><ChevronLeft className="w-5 h-5" /></button>
                                <div className="flex gap-2">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-12 h-12 rounded-2xl text-sm font-black transition-all ${currentPage === i + 1 ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'bg-white text-slate-400 border border-slate-200 hover:border-orange-200 hover:text-orange-500'}`}>{i + 1}</button>
                                    ))}
                                </div>
                                <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-orange-500 disabled:opacity-30 transition-all shadow-sm active:scale-90"><ChevronRight className="w-5 h-5" /></button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Modal Add/Edit */}
            {showAddModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col my-auto">
                        <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-white shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500"><Code2 className="w-6 h-6" /></div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 leading-none">{selectedPortfolio ? 'Update Data' : 'Draft Baru'}</h2>
                                    <p className="text-slate-400 text-sm mt-1 font-medium">Lengkapi detail project anda</p>
                                </div>
                            </div>
                            <button onClick={closeModal} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all"><X className="w-6 h-6" /></button>
                        </div>

                        <div className="p-10 overflow-y-auto space-y-8 max-h-[60vh] custom-scrollbar">
                            <div className={`relative aspect-2/1 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center transition-all group ${imagePreview ? 'border-transparent' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-orange-300'}`}>
                                {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover rounded-[2rem]" alt="Preview" /> : <div className="text-center space-y-3"><UploadCloud className="w-10 h-10 text-slate-300 mx-auto" /><p className="text-sm font-bold text-slate-500 tracking-tight">Pilih Thumbnail Terbaik</p></div>}
                                <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Nama Proyek</Label>
                                    <Input id="nama_portfolio" value={formData.nama_portfolio} onChange={handleInputChange} className="h-14 rounded-2xl border-slate-200 px-5 text-base font-medium" placeholder="Ex: FinTech Website" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Kategori Utama</Label>
                                    <select id="kategori_proyek" value={formData.kategori_proyek} onChange={handleInputChange} className="w-full h-14 px-5 rounded-2xl border border-slate-200 bg-white text-base font-medium outline-none appearance-none">
                                        {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* INPUT YANG TADI HILANG: Jenis Proyek, Periode, Lama Pengerjaan */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-1"><Layers className="w-3 h-3" /> Jenis</Label>
                                    <Input id="jenis_proyek" value={formData.jenis_proyek} onChange={handleInputChange} className="h-14 rounded-2xl border-slate-200 px-5" placeholder="Web App" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-1"><CalendarDays className="w-3 h-3" /> Periode</Label>
                                    <Input id="periode" value={formData.periode} onChange={handleInputChange} className="h-14 rounded-2xl border-slate-200 px-5" placeholder="2026" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-1"><Timer className="w-3 h-3" /> Durasi</Label>
                                    <Input id="lama_pengerjaan" value={formData.lama_pengerjaan} onChange={handleInputChange} className="h-14 rounded-2xl border-slate-200 px-5" placeholder="2 Minggu" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">URL GitHub</Label>
                                    <Input id="link_github" value={formData.link_github} onChange={handleInputChange} className="h-14 rounded-2xl border-slate-200 px-5" placeholder="https://github.com/..." />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Live Demo</Label>
                                    <Input id="link_demo" value={formData.link_demo} onChange={handleInputChange} className="h-14 rounded-2xl border-slate-200 px-5" placeholder="https://demo.com/..." />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Teknologi (Tags)</Label>
                                <Input id="teknologi" value={formData.teknologi} onChange={handleInputChange} placeholder="React, Supabase, Tailwind CSS" className="h-14 rounded-2xl border-slate-200 px-5" />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Deskripsi Singkat</Label>
                                <textarea id="deskripsi_singkat" value={formData.deskripsi_singkat} onChange={handleInputChange} className="w-full p-5 rounded-2xl border border-slate-200 h-24 focus:outline-none focus:ring-4 focus:ring-orange-500/5 transition-all resize-none font-medium" placeholder="Tuliskan tagline proyek..." />
                            </div>
                        </div>

                        <div className="p-10 border-t border-slate-50 flex items-center gap-4 bg-slate-50/50 shrink-0">
                            <Button variant="ghost" onClick={closeModal} className="flex-1 h-14 rounded-2xl font-bold text-slate-500">Batalkan</Button>
                            <Button onClick={handleSave} disabled={isSaving} className="flex-2 bg-orange-500 hover:bg-orange-600 text-white h-14 rounded-2xl font-black shadow-xl shadow-orange-100 transition-all">
                                {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Terbitkan Proyek'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteAlert && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-60 flex items-center justify-center p-4">
                    <div className="bg-white p-10 rounded-[3rem] max-w-sm w-full text-center shadow-2xl scale-in-center">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6"><Trash2 className="w-10 h-10" /></div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Hapus Karya?</h3>
                        <p className="text-slate-500 mt-2 mb-10 font-medium text-sm">Langkah ini bersifat permanen dan tidak bisa dibatalkan.</p>
                        <div className="flex flex-col gap-3">
                            <Button onClick={confirmDelete} disabled={isDeleting} className="w-full bg-red-500 hover:bg-red-600 text-white h-14 rounded-2xl font-bold shadow-lg shadow-red-100">{isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Ya, Hapus Sekarang'}</Button>
                            <Button variant="ghost" onClick={() => setShowDeleteAlert(false)} className="w-full h-14 rounded-2xl font-bold text-slate-400">Kembali</Button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayoutAdmin>
    );
}