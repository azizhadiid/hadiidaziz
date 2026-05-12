'use client'

import React, { useState, useEffect } from 'react';
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
    ExternalLink,
    Edit3,
    Trash2,
    X,
    Loader2,
    AlignLeft,
    Link as IconLink,
    ArrowUpRight,
    Sparkles,
    CalendarDays,
    Timer,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import MainLayoutAdmin from '@/components/layout/MainLayoutAdmin';
import supabase from '@/lib/db';
import toast from 'react-hot-toast';

// --- INTERFACE ---
interface Experience {
    id: string;
    posisi: string;
    jenis_pekerjaan: string;
    perusahaan: string;
    periode: string;
    lama_bekerja: string;
    lokasi: string;
    deskripsi: string;
    keahlian: string;
    link_proyek: string;
    created_at: string;
}

export default function AdminPengalamanPage() {
    // --- STATE UTAMA ---
    const [experienceData, setExperienceData] = useState<Experience[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // UI State
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    // Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [selectedExp, setSelectedExp] = useState<Experience | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        posisi: '',
        jenis_pekerjaan: '',
        perusahaan: '',
        periode: '',
        lama_bekerja: '',
        lokasi: '',
        deskripsi: '',
        keahlian: '',
        link_proyek: ''
    });

    // --- FETCH DATA ---
    const fetchExperience = async () => {
        setIsLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('experiences')
                .select('*')
                .eq('admin_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setExperienceData(data || []);
        } catch (error: any) {
            toast.error('Gagal memuat data.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchExperience(); }, []);

    // --- HANDLERS ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const resetForm = () => {
        setFormData({
            posisi: '', jenis_pekerjaan: '', perusahaan: '', periode: '',
            lama_bekerja: '', lokasi: '', deskripsi: '', keahlian: '', link_proyek: ''
        });
    };

    const closeModal = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setSelectedExp(null);
        resetForm();
    };

    // --- CRUD ---
    const handleSave = async () => {
        if (!formData.posisi || !formData.perusahaan) return toast.error("Wajib diisi!");
        setIsSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { error } = await supabase.from('experiences').insert({ admin_id: user?.id, ...formData });
            if (error) throw error;
            toast.success("Berhasil ditambah!");
            closeModal();
            fetchExperience();
        } catch (error: any) { toast.error("Gagal menyimpan"); } finally { setIsSaving(false); }
    };

    const handleEdit = (exp: Experience) => {
        setSelectedExp(exp);
        setFormData({ ...exp } as any);
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        if (!selectedExp) return;
        setIsSaving(true);
        try {
            const { error } = await supabase.from('experiences').update({ ...formData }).eq('id', selectedExp.id);
            if (error) throw error;
            toast.success("Berhasil diperbarui!");
            closeModal();
            fetchExperience();
        } catch (error: any) { toast.error("Gagal update"); } finally { setIsSaving(false); }
    };

    const confirmDelete = async () => {
        if (!selectedExp) return;
        setIsDeleting(true);
        try {
            await supabase.from('experiences').delete().eq('id', selectedExp.id);
            toast.success("Dihapus");
            fetchExperience();
        } finally {
            setIsDeleting(false);
            setShowDeleteAlert(false);
            setSelectedExp(null);
        }
    };

    const filteredExperience = experienceData.filter(exp =>
        exp.posisi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.perusahaan.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredExperience.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentExperience = filteredExperience.slice(startIndex, startIndex + itemsPerPage);

    const getJobTypeColor = (type: string) => {
        const lower = type?.toLowerCase() || '';
        if (lower.includes('full')) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
        if (lower.includes('freelance')) return 'bg-sky-50 text-sky-700 border-sky-100';
        return 'bg-slate-50 text-slate-700 border-slate-100';
    };

    return (
        <MainLayoutAdmin>
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Karir</h1>
                    <p className="text-slate-500 text-sm">Kelola riwayat profesional Anda</p>
                </div>
                <Button onClick={() => { resetForm(); setShowAddModal(true); }} className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl h-12 px-6 font-bold shadow-lg shadow-orange-100 transition-all active:scale-95">
                    <Plus className="w-5 h-5 mr-2 stroke-[3px]" /> Tambah Baru
                </Button>
            </div>

            {/* --- ACTION BAR --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="md:col-span-2 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Cari perusahaan atau posisi..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 transition-all shadow-sm"
                    />
                </div>
                <Button variant="outline" className="border-slate-200 rounded-2xl h-full font-bold text-slate-600"><Filter className="w-4 h-4 mr-2" /> Urutkan</Button>
            </div>

            {/* --- LIST --- */}
            {isLoading ? (
                <div className="flex flex-col items-center py-20"><Loader2 className="w-10 h-10 text-orange-500 animate-spin" /></div>
            ) : (
                <div className="space-y-6">
                    {currentExperience.map((exp) => (
                        <Card key={exp.id} className="border-0 shadow-sm rounded-[2rem] overflow-hidden ring-1 ring-slate-100 group">
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row">
                                    <div className="md:w-48 bg-slate-50/50 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100">
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm ring-1 ring-slate-100 mb-3"><Building2 className="w-8 h-8 text-orange-500 stroke-[1.5px]" /></div>
                                        <h4 className="font-bold text-slate-900 text-sm text-center line-clamp-2">{exp.perusahaan}</h4>
                                    </div>
                                    <div className="flex-1 p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-black text-slate-900 group-hover:text-orange-600 transition-colors">{exp.posisi}</h3>
                                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold text-slate-400 mt-1">
                                                    <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> {exp.periode}</span>
                                                    <span className="flex items-center gap-1"><Timer className="w-3.5 h-3.5" /> {exp.lama_bekerja}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEdit(exp)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-blue-500 transition-all"><Edit3 className="w-4 h-4" /></button>
                                                <button onClick={() => { setSelectedExp(exp); setShowDeleteAlert(true); }} className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4">"{exp.deskripsi}"</p>
                                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-50">
                                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getJobTypeColor(exp.jenis_pekerjaan)}`}>{exp.jenis_pekerjaan || 'Proyek'}</span>
                                            {exp.link_proyek && <a href={exp.link_proyek} target="_blank" className="text-[10px] font-black text-orange-500 flex items-center gap-1 uppercase">Website <ArrowUpRight className="w-3 h-3" /></a>}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* --- PAGINATION --- */}
            {!isLoading && totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="rounded-xl border-slate-200"><ChevronLeft className="w-4 h-4" /></Button>
                    <div className="h-10 px-4 flex items-center bg-white border border-slate-200 rounded-xl font-bold text-xs">{currentPage} / {totalPages}</div>
                    <Button variant="outline" size="icon" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="rounded-xl border-slate-200"><ChevronRight className="w-4 h-4" /></Button>
                </div>
            )}

            {/* --- MODAL FORM (COMPACT SIZE) --- */}
            {(showAddModal || showEditModal) && (
                <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300">
                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Compact Header */}
                        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${showAddModal ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500'}`}>
                                    {showAddModal ? <Plus className="w-5 h-5 stroke-[3px]" /> : <Edit3 className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-slate-900 leading-none">{showAddModal ? 'Tambah Pengalaman' : 'Edit Pengalaman'}</h2>
                                    <p className="text-slate-400 text-xs mt-1 font-medium italic">Simpan jejak karir Anda</p>
                                </div>
                            </div>
                            <button onClick={closeModal} className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400"><X className="w-5 h-5" /></button>
                        </div>

                        {/* Compact Form Body */}
                        <div className="p-8 space-y-5 max-h-[65vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Posisi Pekerjaan</Label>
                                    <Input id="posisi" value={formData.posisi} onChange={handleInputChange} placeholder="Frontend Developer" className="h-11 rounded-xl border-slate-200 text-sm focus:ring-4 focus:ring-orange-500/5 transition-all" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tipe</Label>
                                    <select id="jenis_pekerjaan" value={formData.jenis_pekerjaan} onChange={handleInputChange} className="w-full h-11 px-4 border border-slate-200 bg-white rounded-xl text-sm outline-none focus:ring-4 focus:ring-orange-500/5 transition-all appearance-none">
                                        <option value="">Pilih tipe...</option>
                                        <option value="Full-time">Full-time</option>
                                        <option value="Freelance">Freelance</option>
                                        <option value="Internship">Internship</option>
                                        <option value="Contract">Contract</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Perusahaan</Label>
                                    <Input id="perusahaan" value={formData.perusahaan} onChange={handleInputChange} placeholder="Google Inc." className="h-11 rounded-xl border-slate-200 text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Lokasi</Label>
                                    <Input id="lokasi" value={formData.lokasi} onChange={handleInputChange} placeholder="Remote / Jakarta" className="h-11 rounded-xl border-slate-200 text-sm" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Periode</Label>
                                    <Input id="periode" value={formData.periode} onChange={handleInputChange} placeholder="2024 - Sekarang" className="h-11 rounded-xl border-slate-200 text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Lama Bekerja</Label>
                                    <Input id="lama_bekerja" value={formData.lama_bekerja} onChange={handleInputChange} placeholder="1 Tahun" className="h-11 rounded-xl border-slate-200 text-sm" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Keahlian (Pisahkan koma)</Label>
                                <Input id="keahlian" value={formData.keahlian} onChange={handleInputChange} placeholder="React, Next.js, Tailwind" className="h-11 rounded-xl border-slate-200 text-sm" />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Link Perusahaan</Label>
                                <div className="relative">
                                    <IconLink className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                    <Input id="link_proyek" value={formData.link_proyek} onChange={handleInputChange} placeholder="https://..." className="h-11 pl-10 rounded-xl border-slate-200 text-sm" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Deskripsi Pekerjaan</Label>
                                <textarea id="deskripsi" value={formData.deskripsi} onChange={handleInputChange} rows={3} className="w-full p-4 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-orange-500/5 transition-all resize-none font-medium italic" placeholder="Ceritakan pencapaian Anda..." />
                            </div>
                        </div>

                        {/* Compact Footer */}
                        <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex gap-3">
                            <Button variant="ghost" onClick={closeModal} className="flex-1 h-11 rounded-xl font-bold text-slate-400 text-sm">Batal</Button>
                            <Button onClick={showAddModal ? handleSave : handleUpdate} disabled={isSaving} className={`flex-2 h-11 text-white rounded-xl font-black shadow-lg transition-all active:scale-95 text-sm ${showAddModal ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-100' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'}`}>
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- DELETE ALERT --- */}
            {showDeleteAlert && (
                <div className="fixed inset-0 bg-slate-900/60 z-60 flex items-center justify-center p-4 backdrop-blur-md">
                    <div className="bg-white p-8 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-5"><Trash2 className="w-8 h-8" /></div>
                        <h3 className="text-xl font-black text-slate-900">Hapus Riwayat?</h3>
                        <p className="text-slate-500 mt-2 mb-8 text-xs font-medium">Data di <strong>{selectedExp?.perusahaan}</strong> akan hilang permanen.</p>
                        <div className="flex flex-col gap-2">
                            <Button onClick={confirmDelete} disabled={isDeleting} className="w-full bg-red-500 hover:bg-red-600 text-white h-12 rounded-xl font-bold shadow-lg shadow-red-100">{isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ya, Hapus Sekarang'}</Button>
                            <Button variant="ghost" onClick={() => setShowDeleteAlert(false)} className="w-full h-12 rounded-xl font-bold text-slate-400">Kembali</Button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayoutAdmin>
    );
}