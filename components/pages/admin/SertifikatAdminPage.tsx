'use client'

import React, { useState } from 'react';
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
    UploadCloud
} from 'lucide-react';
import MainLayoutAdmin from '@/components/layout/MainLayoutAdmin';

// Definisikan tipe data untuk Sertifikat
interface Certificate {
    id: number;
    title: string;
    issuer: string;
    date: string;
    image: string;
    credentialId: string;
    status: string;
}

export default function SertifikatAdminPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // State untuk Modal
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

    const itemsPerPage = 6;

    // Dummy Data
    const [certificates, setCertificates] = useState<Certificate[]>([
        {
            id: 1,
            title: 'AWS Certified Solutions Architect',
            issuer: 'Amazon Web Services',
            date: '2024-11-15',
            image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=300&fit=crop',
            credentialId: 'AWS-SA-2024-001',
            status: 'active'
        },
        {
            id: 2,
            title: 'Google Cloud Professional',
            issuer: 'Google Cloud',
            date: '2024-10-22',
            image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=300&fit=crop',
            credentialId: 'GCP-PRO-2024-002',
            status: 'active'
        },
        {
            id: 3,
            title: 'Meta Front-End Developer',
            issuer: 'Meta (Facebook)',
            date: '2024-09-10',
            image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
            credentialId: 'META-FE-2024-003',
            status: 'active'
        },
        {
            id: 4,
            title: 'Microsoft Azure Administrator',
            issuer: 'Microsoft',
            date: '2024-08-05',
            image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
            credentialId: 'AZ-104-2024-004',
            status: 'active'
        },
        {
            id: 5,
            title: 'Certified Kubernetes Administrator',
            issuer: 'Linux Foundation',
            date: '2024-07-18',
            image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=300&fit=crop',
            credentialId: 'CKA-2024-005',
            status: 'active'
        },
        {
            id: 6,
            title: 'Professional Scrum Master',
            issuer: 'Scrum.org',
            date: '2024-06-12',
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
            credentialId: 'PSM-I-2024-006',
            status: 'active'
        },
        {
            id: 7,
            title: 'Adobe Certified Expert',
            issuer: 'Adobe',
            date: '2024-05-20',
            image: 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=400&h=300&fit=crop',
            credentialId: 'ACE-2024-007',
            status: 'active'
        },
    ]);

    // Filtering Logic
    const filteredCertificates = certificates.filter(cert =>
        cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.issuer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination Logic
    const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentCertificates = filteredCertificates.slice(startIndex, startIndex + itemsPerPage);

    // Handlers
    const handleDeleteClick = (cert: Certificate) => {
        setSelectedCert(cert);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (selectedCert) {
            setCertificates(certificates.filter(c => c.id !== selectedCert.id));
            setShowDeleteModal(false);
            setSelectedCert(null);
        }
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
                        onChange={(e) => setSearchQuery(e.target.value)}
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
                    { label: 'Total', value: certificates.length, icon: <Award className="w-5 h-5 text-orange-600" />, bg: 'bg-orange-100' },
                    { label: 'Active', value: certificates.length, icon: <CheckCircle className="w-5 h-5 text-green-600" />, bg: 'bg-green-100' },
                    { label: 'This Year', value: '2024', icon: <Calendar className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-100' },
                    { label: 'Issuers', value: '6', icon: <Building className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-100' },
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

            {/* --- CERTIFICATES GRID --- */}
            {filteredCertificates.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {currentCertificates.map((cert) => (
                        <Card
                            key={cert.id}
                            className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden bg-white"
                        >
                            {/* Image Section */}
                            <div className="relative h-48 overflow-hidden bg-slate-100">
                                <img
                                    src={cert.image}
                                    alt={cert.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Quick Actions Overlay */}
                                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <button className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-700 hover:text-orange-600 shadow-lg hover:scale-110 transition-all cursor-pointer">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-700 hover:text-blue-600 shadow-lg hover:scale-110 transition-all cursor-pointer">
                                        <Download className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Status Badge */}
                                <div className="absolute top-3 left-3">
                                    <span className="px-2 py-1 bg-green-500/90 backdrop-blur-sm text-white text-xs font-medium rounded-full flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        Active
                                    </span>
                                </div>
                            </div>

                            {/* Content Section */}
                            <CardContent className="p-5">
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                                        {cert.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                                        <Building className="w-4 h-4" />
                                        <span className="line-clamp-1">{cert.issuer}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(cert.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    <p className="text-xs text-slate-500 mb-3 font-mono">ID: {cert.credentialId}</p>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg"
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
                        <Search className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Sertifikat tidak ditemukan</h3>
                    <p className="text-slate-500">Coba kata kunci lain atau tambahkan sertifikat baru.</p>
                </div>
            )}

            {/* --- PAGINATION --- */}
            {totalPages > 1 && (
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

            {/* --- MODAL DELETE (Custom Popup) --- */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 scale-100 animate-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                            <Trash2 className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-center text-slate-900 mb-2">Hapus Sertifikat?</h3>
                        <p className="text-sm text-center text-slate-500 mb-6">
                            Apakah Anda yakin ingin menghapus <strong>"{selectedCert?.title}"</strong>? Tindakan ini tidak dapat dibatalkan.
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

            {/* --- MODAL ADD (Custom Popup) --- */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Tambah Sertifikat Baru</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

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
                                    <Label htmlFor="date">Tanggal Terbit</Label>
                                    <Input id="date" type="date" className="rounded-xl" />
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