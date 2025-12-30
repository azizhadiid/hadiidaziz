'use client'

import React, { useEffect, useState, useMemo } from 'react';
import {
    Code, ExternalLink, Calendar, Building2, Award,
    Layers, Search, ChevronLeft, ChevronRight, Filter, X
} from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/components/contexts/LanguageContext';
import MainLayoutGuest from '@/components/layout/guest/MainLayoutGuest';
import supabase from '@/lib/db';
import Link from 'next/link';

// --- TIPE DATA DARI DB ---
interface PortfolioData {
    id: string;
    nama_portfolio: string;
    jenis_proyek: string; // Filter Key untuk Proyek
    kategori_proyek: string;
    teknologi: string;
    deskripsi_singkat: string;
    image_url?: string;
    // Update link lama menjadi dua link baru ini (sesuai info kamu)
    link_demo?: string;
    link_github?: string;
    created_at: string;
}

interface CertificateData {
    id: string;
    nama_sertifikat: string;
    organisasi_sertifikat: string; // Filter Key untuk Sertifikat
    periode_sertifikat: string;
    no_sertifikat: string;
    foto_sertifikat?: string;
    link_organisasi?: string;
    created_at: string;
}

const ITEMS_PER_PAGE = 6;

function PortfolioContent() {
    const { t } = useLanguage();

    // --- STATES ---
    const [activeTab, setActiveTab] = useState<'projects' | 'certificates'>('projects');
    const [projects, setProjects] = useState<PortfolioData[]>([]);
    const [certificates, setCertificates] = useState<CertificateData[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter & Search States
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);

    // --- FETCH DATA (Sekali saja saat load) ---
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Projects
                const { data: projData } = await supabase
                    .from('portfolios')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (projData) setProjects(projData);

                // Fetch Certificates
                const { data: certData } = await supabase
                    .from('certificates')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (certData) setCertificates(certData);

            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // --- RESET FILTER SAAT TAB BERUBAH ---
    useEffect(() => {
        setSearchQuery('');
        setSelectedFilter('All');
        setCurrentPage(1);
    }, [activeTab]);

    // --- LOGIKA FILTERING & SEARCHING (SMOOTH) ---
    const filteredItems = useMemo(() => {
        let data: any[] = activeTab === 'projects' ? projects : certificates;

        // 1. Filter by Category (Jenis Proyek / Organisasi)
        if (selectedFilter !== 'All') {
            data = data.filter(item => {
                if (activeTab === 'projects') {
                    return (item as PortfolioData).jenis_proyek === selectedFilter;
                } else {
                    return (item as CertificateData).organisasi_sertifikat === selectedFilter;
                }
            });
        }

        // 2. Filter by Search Query
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            data = data.filter(item => {
                if (activeTab === 'projects') {
                    const p = item as PortfolioData;
                    return (
                        p.nama_portfolio.toLowerCase().includes(lowerQuery) ||
                        p.deskripsi_singkat.toLowerCase().includes(lowerQuery) ||
                        p.teknologi?.toLowerCase().includes(lowerQuery)
                    );
                } else {
                    const c = item as CertificateData;
                    return (
                        c.nama_sertifikat.toLowerCase().includes(lowerQuery) ||
                        c.organisasi_sertifikat.toLowerCase().includes(lowerQuery)
                    );
                }
            });
        }

        return data;
    }, [activeTab, projects, certificates, selectedFilter, searchQuery]);

    // --- LOGIKA PAGINATION ---
    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // --- GENERATE UNIQUE FILTERS DARI DATA DB ---
    const availableFilters = useMemo(() => {
        const uniqueSet = new Set<string>();
        if (activeTab === 'projects') {
            projects.forEach(p => p.jenis_proyek && uniqueSet.add(p.jenis_proyek));
        } else {
            certificates.forEach(c => c.organisasi_sertifikat && uniqueSet.add(c.organisasi_sertifikat));
        }
        return ['All', ...Array.from(uniqueSet)];
    }, [activeTab, projects, certificates]);

    return (
        <MainLayoutGuest>
            <section className="pt-20 pb-20 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-slate-50 via-orange-50/30 to-white min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* --- HEADER --- */}
                    <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
                        <span className="text-orange-600 font-bold tracking-wider uppercase text-sm">
                            {t.portfolioPage.tagline}
                        </span>
                        <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 leading-tight">
                            {t.portfolioPage.title} <br className="hidden sm:block" />
                            <span className="bg-linear-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                                {t.portfolioPage.titleAccent}
                            </span>
                        </h1>
                        <p className="text-slate-600 text-lg">
                            {t.portfolioPage.desc}
                        </p>
                    </div>

                    {/* --- CONTROLS SECTION (Tab, Search, Filter) --- */}
                    <div className="space-y-8 mb-12">

                        {/* 1. Tab Switcher */}
                        <div className="flex justify-center">
                            <div className="bg-white p-1.5 rounded-full border border-slate-200 shadow-sm inline-flex">
                                <button
                                    onClick={() => setActiveTab('projects')}
                                    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2
                                        ${activeTab === 'projects'
                                            ? 'bg-orange-500 text-white shadow-md'
                                            : 'text-slate-500 hover:text-orange-600 hover:bg-orange-50'}
                                    `}
                                >
                                    <Layers className="w-4 h-4" />
                                    {t.portfolioPage.tabProject}
                                </button>
                                <button
                                    onClick={() => setActiveTab('certificates')}
                                    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2
                                        ${activeTab === 'certificates'
                                            ? 'bg-orange-500 text-white shadow-md'
                                            : 'text-slate-500 hover:text-orange-600 hover:bg-orange-50'}
                                    `}
                                >
                                    <Award className="w-4 h-4" />
                                    {t.portfolioPage.tabCert}
                                </button>
                            </div>
                        </div>

                        {/* 2. Search & Filter Bar */}
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between max-w-5xl mx-auto">

                            {/* Search Input */}
                            <div className="relative w-full md:w-96 group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder={activeTab === 'projects' ? "Search projects..." : "Search certificates..."}
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                    className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            {/* Filter Pills (Horizontal Scroll) */}
                            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto md:pb-0 no-scrollbar items-center">
                                <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
                                {availableFilters.map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => { setSelectedFilter(filter); setCurrentPage(1); }}
                                        className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-semibold transition-all border
                                            ${selectedFilter === filter
                                                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                                                : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300 hover:text-orange-600'}
                                        `}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* --- MAIN GRID CONTENT --- */}
                    <div className="min-h-100">
                        {loading ? (
                            // Loading Skeleton
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="bg-white rounded-2xl h-96 animate-pulse border border-slate-100 shadow-sm">
                                        <div className="h-48 bg-slate-200 rounded-t-2xl"></div>
                                        <div className="p-6 space-y-3">
                                            <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                                            <div className="h-4 bg-slate-200 rounded w-full"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : paginatedItems.length > 0 ? (
                            activeTab === 'projects' ? (
                                // PROJECTS GRID
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in zoom-in duration-500">
                                    {paginatedItems.map((item: any) => (
                                        <div key={item.id} className="group bg-white rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                                            <div className="h-48 overflow-hidden bg-slate-100 relative">
                                                <img
                                                    src={item.image_url || `https://ui-avatars.com/api/?name=${item.nama_portfolio}&background=random`}
                                                    alt={item.nama_portfolio}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute top-4 left-4">
                                                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-orange-700 text-xs font-bold rounded-full shadow-lg border border-orange-100">
                                                        {item.jenis_proyek}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-6 flex flex-col grow">
                                                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-1">
                                                    {item.nama_portfolio}
                                                </h3>
                                                <p className="text-slate-600 text-sm mb-4 line-clamp-3 grow">
                                                    {item.deskripsi_singkat}
                                                </p>
                                                <div className="flex flex-wrap gap-2 mb-6">
                                                    {item.teknologi ? item.teknologi.split(',').slice(0, 3).map((tech: string, idx: number) => (
                                                        <span key={idx} className="text-[10px] px-2 py-1 bg-slate-50 text-slate-500 border border-slate-200 rounded-md">
                                                            {tech.trim()}
                                                        </span>
                                                    )) : null}
                                                </div>
                                                <Link
                                                    href={`/portofolio/${item.id}`} // Pastikan ini mengarah ke ID
                                                    className="mt-auto w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors"
                                                >
                                                    {t.portfolioPage.btnView} <ExternalLink className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                // CERTIFICATES GRID
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in duration-500">
                                    {paginatedItems.map((cert: any) => (
                                        <div key={cert.id} className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:border-orange-200 hover:shadow-lg transition-all duration-300 flex flex-col">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 border border-orange-100">
                                                        <Award className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-500">Issued by</p>
                                                        <p className="font-bold text-slate-900 text-sm line-clamp-1">{cert.organisasi_sertifikat}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                                                {cert.nama_sertifikat}
                                            </h3>
                                            {cert.foto_sertifikat && (
                                                <div className="h-32 w-full bg-slate-100 rounded-lg mb-4 overflow-hidden border border-slate-200 relative group">
                                                    <img
                                                        src={cert.foto_sertifikat}
                                                        alt={cert.nama_sertifikat}
                                                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                                                    />
                                                </div>
                                            )}
                                            <div className="space-y-2 mt-auto mb-4">
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span>{cert.periode_sertifikat}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <Code className="w-3.5 h-3.5" />
                                                    <span className="line-clamp-1">ID: {cert.no_sertifikat || '-'}</span>
                                                </div>
                                            </div>
                                            {cert.link_organisasi ? (
                                                <a
                                                    href={cert.link_organisasi}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full py-2 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors"
                                                >
                                                    {t.portfolioPage.btnCredential} <ExternalLink className="w-3 h-3" />
                                                </a>
                                            ) : (
                                                <button disabled className="w-full py-2 rounded-lg bg-slate-100 text-slate-400 text-xs font-bold cursor-not-allowed">
                                                    No Link Available
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )
                        ) : (
                            // Empty State
                            <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-300">
                                <Search className="w-16 h-16 mb-4 opacity-20" />
                                <h3 className="text-lg font-semibold text-slate-600">No results found</h3>
                                <p className="text-sm">Try adjusting your search or filter.</p>
                                <button
                                    onClick={() => { setSearchQuery(''); setSelectedFilter('All'); }}
                                    className="mt-4 text-orange-600 hover:text-orange-700 font-semibold text-sm"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>

                    {/* --- PAGINATION CONTROLS --- */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-16">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-full border border-slate-200 hover:bg-white hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all text-slate-600"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <div className="flex gap-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-10 h-10 rounded-full text-sm font-bold transition-all
                                            ${currentPage === page
                                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-110'
                                                : 'bg-white text-slate-600 border border-slate-200 hover:border-orange-300'}
                                        `}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-full border border-slate-200 hover:bg-white hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all text-slate-600"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                </div>
            </section>
        </MainLayoutGuest>
    );
}

export default function PortfolioPage() {
    return (
        <LanguageProvider>
            <PortfolioContent />
        </LanguageProvider>
    );
}