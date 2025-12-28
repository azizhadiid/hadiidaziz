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
    Calendar,
    ExternalLink,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    X,
    Loader2,
    AlignLeft,
    Link as IconLink
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
    // --- STATE ---
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
            console.error('Error fetching experience:', error);
            toast.error('Gagal memuat data pengalaman.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchExperience();
    }, []);

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

    // --- CRUD OPERATIONS ---
    const handleSave = async () => {
        if (!formData.posisi || !formData.perusahaan) {
            toast.error("Posisi dan Perusahaan wajib diisi!");
            return;
        }

        setIsSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Sesi habis.");

            const { error } = await supabase.from('experiences').insert({
                admin_id: user.id,
                ...formData
            });

            if (error) throw error;
            toast.success("Pengalaman berhasil ditambahkan!");
            closeModal();
            fetchExperience();
        } catch (error: any) {
            toast.error("Gagal menyimpan: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = (exp: Experience) => {
        setSelectedExp(exp);
        setFormData({
            posisi: exp.posisi,
            jenis_pekerjaan: exp.jenis_pekerjaan || '',
            perusahaan: exp.perusahaan,
            periode: exp.periode || '',
            lama_bekerja: exp.lama_bekerja || '',
            lokasi: exp.lokasi || '',
            deskripsi: exp.deskripsi || '',
            keahlian: exp.keahlian || '',
            link_proyek: exp.link_proyek || ''
        });
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        if (!selectedExp) return;
        if (!formData.posisi || !formData.perusahaan) {
            toast.error("Posisi dan Perusahaan wajib diisi!");
            return;
        }

        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('experiences')
                .update({ ...formData, updated_at: new Date().toISOString() })
                .eq('id', selectedExp.id);

            if (error) throw error;
            toast.success("Pengalaman berhasil diperbarui!");
            closeModal();
            fetchExperience();
        } catch (error: any) {
            toast.error("Gagal update: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = (exp: Experience) => {
        setSelectedExp(exp);
        setShowDeleteAlert(true);
    };

    const confirmDelete = async () => {
        if (!selectedExp) return;
        setIsDeleting(true);
        try {
            const { error } = await supabase.from('experiences').delete().eq('id', selectedExp.id);
            if (error) throw error;
            toast.success(`Pengalaman di "${selectedExp.perusahaan}" berhasil dihapus`);
            fetchExperience();
        } catch (error: any) {
            toast.error("Gagal menghapus: " + error.message);
        } finally {
            setIsDeleting(false);
            setShowDeleteAlert(false);
            setSelectedExp(null);
        }
    };

    // --- HELPERS ---
    const filteredExperience = experienceData.filter(exp =>
        exp.posisi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.perusahaan.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredExperience.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentExperience = filteredExperience.slice(startIndex, startIndex + itemsPerPage);

    const getJobTypeColor = (type: string) => {
        const lower = type?.toLowerCase() || '';
        if (lower.includes('full')) return 'bg-green-100 text-green-700 border-green-200';
        if (lower.includes('freelance')) return 'bg-blue-100 text-blue-700 border-blue-200';
        if (lower.includes('intern')) return 'bg-purple-100 text-purple-700 border-purple-200';
        if (lower.includes('contract')) return 'bg-orange-100 text-orange-700 border-orange-200';
        return 'bg-slate-100 text-slate-700 border-slate-200';
    };

    // --- RENDER ---
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
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        className="pl-10 h-11 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                    />
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                    <Button variant="outline" className="flex-1 sm:flex-none border-slate-200 text-slate-700 rounded-xl">
                        <Filter className="w-4 h-4 mr-2" /> Filter
                    </Button>
                    <Button
                        onClick={() => { resetForm(); setShowAddModal(true); }}
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
                    { label: 'Companies', value: new Set(experienceData.map(e => e.perusahaan)).size, icon: <Building2 className="w-5 h-5 text-green-600" />, bg: 'bg-green-100' },
                    { label: 'Tahun Ini', value: experienceData.filter(e => e.periode.includes(new Date().getFullYear().toString())).length, icon: <Clock className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-100' },
                    { label: 'Skills Recorded', value: 'Active', icon: <Code className="w-5 h-5 text-orange-600" />, bg: 'bg-orange-100' },
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

            {/* --- CONTENT LIST --- */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
                    <p className="text-slate-500">Memuat data pengalaman...</p>
                </div>
            ) : filteredExperience.length > 0 ? (
                <div className="space-y-6 mb-6">
                    {currentExperience.map((exp) => (
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
                                                        <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                                            <span>{exp.periode}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                                                            <span>{exp.lama_bekerja}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
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

                                            {exp.deskripsi && (
                                                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                                                    {exp.deskripsi}
                                                </p>
                                            )}

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
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed mb-6">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        {searchQuery ? <Search className="w-8 h-8 text-slate-300" /> : <Briefcase className="w-8 h-8 text-slate-300" />}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                        {searchQuery ? 'Tidak ditemukan' : 'Belum ada data pengalaman'}
                    </h3>
                    <p className="text-slate-500 mb-6">
                        {searchQuery
                            ? `Tidak ada hasil untuk "${searchQuery}"`
                            : 'Tambahkan riwayat pekerjaan, magang, atau freelance Anda di sini.'}
                    </p>
                    {!searchQuery && (
                        <Button
                            onClick={() => { resetForm(); setShowAddModal(true); }}
                            className="bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-xl shadow-lg hover:shadow-xl"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Pengalaman Pertama
                        </Button>
                    )}
                </div>
            )}

            {/* --- PAGINATION --- */}
            {!isLoading && filteredExperience.length > itemsPerPage && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-600">
                        Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredExperience.length)} dari {filteredExperience.length} data
                    </p>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="border-slate-200 rounded-lg">
                            <ChevronLeft className="w-4 h-4" /> Prev
                        </Button>

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
                                <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl" onClick={confirmDelete} disabled={isDeleting}>
                                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Hapus'}
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
                                {showAddModal ? <Plus className="w-5 h-5 text-orange-600" /> : <Edit className="w-5 h-5 text-blue-600" />}
                                {showAddModal ? 'Tambah Pengalaman Baru' : 'Edit Pengalaman'}
                            </CardTitle>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-700">
                                <X className="w-6 h-6" />
                            </button>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="posisi">Posisi *</Label>
                                        <Input
                                            id="posisi"
                                            value={formData.posisi}
                                            onChange={handleInputChange}
                                            placeholder="Contoh: Senior Frontend Developer"
                                            className="mt-1 rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="jenis_pekerjaan">Jenis Pekerjaan</Label>
                                        <select
                                            id="jenis_pekerjaan"
                                            value={formData.jenis_pekerjaan}
                                            onChange={handleInputChange}
                                            className="w-full mt-1 h-10 px-3 border border-slate-200 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        >
                                            <option value="">Pilih jenis...</option>
                                            <option value="Full-time">Full-time</option>
                                            <option value="Freelance">Freelance</option>
                                            <option value="Internship">Internship</option>
                                            <option value="Contract">Contract</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="perusahaan">Perusahaan *</Label>
                                        <Input
                                            id="perusahaan"
                                            value={formData.perusahaan}
                                            onChange={handleInputChange}
                                            placeholder="Contoh: Tokopedia"
                                            className="mt-1 rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="lokasi">Lokasi</Label>
                                        <Input
                                            id="lokasi"
                                            value={formData.lokasi}
                                            onChange={handleInputChange}
                                            placeholder="Contoh: Jakarta Selatan (Hybrid)"
                                            className="mt-1 rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="periode">Periode (Bulan/Tahun)</Label>
                                        <Input
                                            id="periode"
                                            value={formData.periode}
                                            onChange={handleInputChange}
                                            placeholder="Jan 2023 - Sekarang"
                                            className="mt-1 rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="lama_bekerja">Lama Bekerja</Label>
                                        <Input
                                            id="lama_bekerja"
                                            value={formData.lama_bekerja}
                                            onChange={handleInputChange}
                                            placeholder="1 Tahun 2 Bulan"
                                            className="mt-1 rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="keahlian">Keahlian (Pisahkan koma)</Label>
                                    <Input
                                        id="keahlian"
                                        value={formData.keahlian}
                                        onChange={handleInputChange}
                                        placeholder="React, TypeScript, Scrum..."
                                        className="mt-1 rounded-xl"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="link_proyek">Link Website Perusahaan</Label>
                                    <div className="relative mt-1">
                                        <IconLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            id="link_proyek"
                                            value={formData.link_proyek}
                                            onChange={handleInputChange}
                                            placeholder="https://..."
                                            className="pl-10 rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="deskripsi">Deskripsi Pekerjaan</Label>
                                    <div className="relative mt-1">
                                        <AlignLeft className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                        <textarea
                                            id="deskripsi"
                                            value={formData.deskripsi}
                                            onChange={handleInputChange}
                                            rows={4}
                                            placeholder="Jelaskan tanggung jawab dan pencapaian Anda..."
                                            className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <Button
                                    variant="outline"
                                    className="flex-1 border-slate-200 rounded-xl"
                                    onClick={closeModal}
                                >
                                    Batal
                                </Button>
                                <Button
                                    className={`flex-1 text-white rounded-xl ${showAddModal ? 'bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                                    onClick={showAddModal ? handleSave : handleUpdate}
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</>
                                    ) : (
                                        showAddModal ? 'Simpan' : 'Simpan Perubahan'
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </MainLayoutAdmin>
    );
}