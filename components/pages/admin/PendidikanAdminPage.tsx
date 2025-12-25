'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Plus,
    Edit,
    Trash2,
    MapPin,
    Calendar,
    ChevronLeft,
    ChevronRight,
    BookOpen,
    Trophy,
    Clock,
    Building2,
    GraduationCap,
    Search,
    Filter,
    X
} from 'lucide-react';
import MainLayoutAdmin from '@/components/layout/MainLayoutAdmin';

// Definisi Tipe Data
interface Education {
    id: number;
    degree: string;
    major: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa: string;
    status: string;
    description: string;
    achievements: string[];
}

export default function PendidikanAdminPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Modal States
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [selectedEdu, setSelectedEdu] = useState<Education | null>(null);

    const itemsPerPage = 5;

    // Dummy Data
    const [educationData, setEducationData] = useState<Education[]>([
        {
            id: 1,
            degree: 'Master of Computer Science',
            major: 'Artificial Intelligence',
            institution: 'Stanford University',
            location: 'Stanford, California, USA',
            startDate: '2020-09',
            endDate: '2022-06',
            gpa: '3.95',
            status: 'Graduated',
            description: 'Focused on machine learning, deep learning, and natural language processing. Thesis on neural network optimization.',
            achievements: ['Best Thesis Award', 'Dean\'s List']
        },
        {
            id: 2,
            degree: 'Bachelor of Computer Science',
            major: 'Software Engineering',
            institution: 'Massachusetts Institute of Technology',
            location: 'Cambridge, Massachusetts, USA',
            startDate: '2016-09',
            endDate: '2020-06',
            gpa: '3.88',
            status: 'Graduated',
            description: 'Comprehensive study of software development, algorithms, and system design. Capstone project on distributed systems.',
            achievements: ['Summa Cum Laude', 'Programming Competition Winner']
        },
        {
            id: 3,
            degree: 'High School Diploma',
            major: 'Science',
            institution: 'Jakarta International School',
            location: 'Jakarta, Indonesia',
            startDate: '2013-07',
            endDate: '2016-06',
            gpa: '3.92',
            status: 'Graduated',
            description: 'Specialized in Mathematics, Physics, and Computer Science. Active member of robotics club.',
            achievements: ['Valedictorian', 'National Science Olympiad Gold Medal']
        },
        {
            id: 4,
            degree: 'Online Certification',
            major: 'Full Stack Web Development',
            institution: 'Coursera - Meta',
            location: 'Online',
            startDate: '2023-01',
            endDate: '2023-06',
            gpa: 'N/A',
            status: 'Completed',
            description: 'Comprehensive program covering React, Node.js, databases, and deployment strategies.',
            achievements: ['Professional Certificate']
        },
    ]);

    // Logic Filtering & Pagination
    const filteredEducation = educationData.filter(edu =>
        edu.degree.toLowerCase().includes(searchQuery.toLowerCase()) ||
        edu.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
        edu.major.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredEducation.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentEducation = filteredEducation.slice(startIndex, startIndex + itemsPerPage);

    // Helper Functions
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    const calculateDuration = (start: string, end: string) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        if (years > 0 && remainingMonths > 0) return `${years} yr ${remainingMonths} mo`;
        if (years > 0) return `${years} years`;
        return `${remainingMonths} months`;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Graduated': return 'bg-green-100 text-green-700 border-green-200';
            case 'Completed': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'In Progress': return 'bg-orange-100 text-orange-700 border-orange-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    // Handlers
    const handleEdit = (edu: Education) => {
        setSelectedEdu(edu);
        setShowEditModal(true);
    };

    const handleDelete = (edu: Education) => {
        setSelectedEdu(edu);
        setShowDeleteAlert(true);
    };

    const confirmDelete = () => {
        if (selectedEdu) {
            setEducationData(educationData.filter(item => item.id !== selectedEdu.id));
            setShowDeleteAlert(false);
            setSelectedEdu(null);
        }
    };

    return (
        <MainLayoutAdmin>

            {/* --- ACTION BAR --- */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                        type="text"
                        placeholder="Cari pendidikan, gelar, atau kampus..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-11 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                    />
                </div>

                {/* Buttons */}
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
                    { label: 'Total', value: educationData.length, icon: <GraduationCap className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-100' },
                    { label: 'Degrees', value: '2', icon: <Trophy className="w-5 h-5 text-green-600" />, bg: 'bg-green-100' },
                    { label: 'Courses', value: '2', icon: <BookOpen className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-100' },
                    { label: 'Institutions', value: '3', icon: <Building2 className="w-5 h-5 text-orange-600" />, bg: 'bg-orange-100' },
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

            {/* --- TIMELINE LIST --- */}
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
                                                    <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                                        <GraduationCap className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                                                            {edu.degree}
                                                        </h3>
                                                        <p className="text-sm font-medium text-orange-600">{edu.major}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 text-slate-700 mb-2">
                                                    <Building2 className="w-4 h-4 text-slate-500" />
                                                    <span className="font-medium">{edu.institution}</span>
                                                </div>

                                                <div className="flex items-center gap-2 text-slate-600 mb-3">
                                                    <MapPin className="w-4 h-4 text-slate-500" />
                                                    <span className="text-sm">{edu.location}</span>
                                                </div>

                                                {/* Metadata: Date, Duration, GPA */}
                                                <div className="flex flex-wrap items-center gap-4 text-sm mb-3">
                                                    <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-2 py-1 rounded-md">
                                                        <Calendar className="w-4 h-4 text-slate-500" />
                                                        <span>{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-2 py-1 rounded-md">
                                                        <Clock className="w-4 h-4 text-slate-500" />
                                                        <span>{calculateDuration(edu.startDate, edu.endDate)}</span>
                                                    </div>
                                                    {edu.gpa !== 'N/A' && (
                                                        <div className="flex items-center gap-2 bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">
                                                            <Trophy className="w-4 h-4 text-yellow-600" />
                                                            <span className="font-medium text-yellow-700">GPA: {edu.gpa}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Status Badge */}
                                                <div className="mb-3">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(edu.status)}`}>
                                                        {edu.status}
                                                    </span>
                                                </div>

                                                {/* Description */}
                                                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                                                    {edu.description}
                                                </p>

                                                {/* Achievements Tags */}
                                                {edu.achievements && edu.achievements.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {edu.achievements.map((achievement, i) => (
                                                            <span
                                                                key={i}
                                                                className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium border border-orange-100"
                                                            >
                                                                <Trophy className="w-3 h-3" />
                                                                {achievement}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex lg:flex-col gap-2 lg:ml-4">
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

            {/* --- PAGINATION --- */}
            {totalPages > 1 && (
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
                                Apakah Anda yakin ingin menghapus <strong>"{selectedEdu?.degree}"</strong> di <strong>{selectedEdu?.institution}</strong>? Tindakan ini tidak dapat dibatalkan.
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

            {/* --- MODAL ADD / EDIT --- */}
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
                            <div className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="degree">Gelar / Program *</Label>
                                        <Input id="degree" placeholder="Contoh: Sarjana Komputer" className="mt-1 rounded-xl" />
                                    </div>
                                    <div>
                                        <Label htmlFor="major">Jurusan / Bidang Studi *</Label>
                                        <Input id="major" placeholder="Contoh: Teknik Informatika" className="mt-1 rounded-xl" />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="institution">Institusi / Kampus *</Label>
                                    <Input id="institution" placeholder="Contoh: Universitas Indonesia" className="mt-1 rounded-xl" />
                                </div>
                                <div>
                                    <Label htmlFor="location">Lokasi *</Label>
                                    <Input id="location" placeholder="Contoh: Depok, Indonesia" className="mt-1 rounded-xl" />
                                </div>
                                <div className="grid sm:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="startDate">Mulai *</Label>
                                        <Input id="startDate" type="month" className="mt-1 rounded-xl" />
                                    </div>
                                    <div>
                                        <Label htmlFor="endDate">Selesai *</Label>
                                        <Input id="endDate" type="month" className="mt-1 rounded-xl" />
                                    </div>
                                    <div>
                                        <Label htmlFor="gpa">IPK / GPA (Opsional)</Label>
                                        <Input id="gpa" placeholder="Contoh: 3.85" className="mt-1 rounded-xl" />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="description">Deskripsi</Label>
                                    <textarea
                                        id="description"
                                        rows={3}
                                        placeholder="Jelaskan fokus studi, tesis, atau hal penting lainnya..."
                                        className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-sm"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="achievements">Pencapaian (Pisahkan dengan koma)</Label>
                                    <Input id="achievements" placeholder="Contoh: Cum Laude, Ketua BEM, Juara 1 Hackathon" className="mt-1 rounded-xl" />
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
                                    className="flex-1 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl"
                                    onClick={() => {
                                        alert('Data berhasil disimpan!');
                                        setShowAddModal(false);
                                        setShowEditModal(false);
                                    }}
                                >
                                    Simpan Data
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

        </MainLayoutAdmin>
    );
}