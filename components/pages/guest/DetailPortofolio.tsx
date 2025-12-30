'use client'

import React, { useEffect, useState } from 'react';
import {
    ArrowLeft, Calendar, Layers, Globe, Github,
    ExternalLink, Lock, Code, CheckCircle2
} from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/components/contexts/LanguageContext';
import MainLayoutGuest from '@/components/layout/guest/MainLayoutGuest';
import supabase from '@/lib/db';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

// Tipe Data Lengkap sesuai DB kamu
interface PortfolioDetailData {
    id: string;
    nama_portfolio: string;
    jenis_proyek: string;
    kategori_proyek: string;
    teknologi: string;       // Disimpan string: "Next.js, Tailwind, ..."
    deskripsi_singkat: string;
    deskripsi_proyek: string; // Deskripsi lengkap (Rich text/Long text)
    periode: string;
    image_url?: string;
    link_demo?: string;      // Kolom baru
    link_github?: string;    // Kolom baru
}

function ProjectDetailContent() {
    const { t } = useLanguage();
    const params = useParams(); // Ambil ID dari URL
    const router = useRouter();

    const [project, setProject] = useState<PortfolioDetailData | null>(null);
    const [loading, setLoading] = useState(true);

    // --- FETCH DATA BY ID ---
    useEffect(() => {
        const fetchProject = async () => {
            if (!params.id) return;

            try {
                const { data, error } = await supabase
                    .from('portfolios')
                    .select('*')
                    .eq('id', params.id)
                    .single(); // Ambil 1 data saja

                if (error) {
                    console.error("Error fetching project:", error);
                    // Opsi: Redirect ke 404 jika error/tidak ketemu
                    // router.push('/404'); 
                } else {
                    setProject(data);
                }
            } catch (err) {
                console.error("Unexpected error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [params.id]);

    // --- LOADING STATE ---
    if (loading) {
        return (
            <MainLayoutGuest>
                <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto min-h-screen">
                    <div className="animate-pulse space-y-8">
                        <div className="h-8 bg-slate-200 rounded w-48"></div>
                        <div className="h-12 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-96 bg-slate-200 rounded-3xl"></div>
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-4">
                                <div className="h-4 bg-slate-200 rounded w-full"></div>
                                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                            </div>
                            <div className="h-64 bg-slate-200 rounded-2xl"></div>
                        </div>
                    </div>
                </div>
            </MainLayoutGuest>
        );
    }

    // --- IF DATA NOT FOUND ---
    if (!project) {
        return (
            <MainLayoutGuest>
                <div className="pt-40 text-center min-h-screen">
                    <h1 className="text-2xl font-bold text-slate-900">Project Not Found</h1>
                    <Link href="/portofolio" className="text-orange-600 hover:underline mt-4 inline-block">
                        Back to Portfolio
                    </Link>
                </div>
            </MainLayoutGuest>
        );
    }

    // Pisahkan string teknologi menjadi array
    const techStack = project.teknologi ? project.teknologi.split(',') : [];

    return (
        <MainLayoutGuest>
            <section className="pt-10 pb-20 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-slate-50 via-orange-50/30 to-white min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* --- TOP NAVIGATION --- */}
                    <Link
                        href="/portofolio"
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-600 transition-colors mb-8 group font-medium"
                    >
                        <div className="p-2 bg-white rounded-full border border-slate-200 group-hover:border-orange-200 group-hover:bg-orange-50 transition-all">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        {t.projectDetail.backBtn}
                    </Link>

                    {/* --- HERO HEADER --- */}
                    <div className="mb-12 space-y-4">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold uppercase rounded-full tracking-wide">
                                {project.jenis_proyek}
                            </span>
                            <span className="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-bold uppercase rounded-full tracking-wide">
                                {project.kategori_proyek}
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                            {project.nama_portfolio}
                        </h1>
                        <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
                            {project.deskripsi_singkat}
                        </p>
                    </div>

                    {/* --- MAIN IMAGE --- */}
                    <div className="rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 border border-slate-200 mb-16 bg-white relative group">
                        {/* Fallback Image jika null */}
                        <img
                            src={project.image_url || `https://ui-avatars.com/api/?name=${project.nama_portfolio}&background=random&size=1024`}
                            alt={project.nama_portfolio}
                            className="w-full h-auto object-cover max-h-150"
                        />
                        {/* Overlay Effect (Opsional) */}
                        <div className="absolute inset-0 bg-linear-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    {/* --- CONTENT GRID --- */}
                    <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">

                        {/* LEFT COLUMN: Description & Tech */}
                        <div className="lg:col-span-2 space-y-12">

                            {/* Project Overview (Long Description) */}
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                                        <Layers className="w-5 h-5" />
                                    </div>
                                    {t.projectDetail.overview}
                                </h2>
                                <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed whitespace-pre-line">
                                    {/* Jika kosong, tampilkan fallback */}
                                    {project.deskripsi_proyek || project.deskripsi_singkat}
                                </div>
                            </div>

                            {/* Tech Stack */}
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                        <Code className="w-5 h-5" />
                                    </div>
                                    {t.projectDetail.techStack}
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    {techStack.map((tech, idx) => (
                                        <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-700 font-medium hover:border-orange-300 hover:text-orange-600 transition-colors">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            {tech.trim()}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Sidebar Info & Buttons */}
                        <div className="space-y-8">
                            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-lg sticky top-32 animate-in fade-in slide-in-from-right-4 duration-700">
                                <h3 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">
                                    {t.projectDetail.projectInfo}
                                </h3>

                                <div className="space-y-6 mb-8">
                                    {/* Category */}
                                    <div>
                                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
                                            {t.projectDetail.category}
                                        </p>
                                        <p className="text-slate-900 font-medium text-lg flex items-center gap-2">
                                            <Layers className="w-4 h-4 text-orange-500" />
                                            {project.kategori_proyek}
                                        </p>
                                    </div>

                                    {/* Date */}
                                    <div>
                                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
                                            {t.projectDetail.date}
                                        </p>
                                        <p className="text-slate-900 font-medium text-lg flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-orange-500" />
                                            {project.periode || "-"}
                                        </p>
                                    </div>
                                </div>

                                {/* ACTION BUTTONS (LOGIC HERE) */}
                                <div className="space-y-3">

                                    {/* 1. Link Demo Button */}
                                    {project.link_demo ? (
                                        <a
                                            href={project.link_demo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full py-3.5 bg-linear-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all"
                                        >
                                            <Globe className="w-5 h-5" />
                                            {t.projectDetail.btnDemo}
                                        </a>
                                    ) : (
                                        <button disabled className="w-full py-3.5 bg-slate-100 text-slate-400 rounded-xl font-bold flex items-center justify-center gap-2 cursor-not-allowed border border-slate-200">
                                            <Lock className="w-4 h-4" />
                                            {t.projectDetail.btnDisabled}
                                        </button>
                                    )}

                                    {/* 2. Github Repo Button */}
                                    {project.link_github ? (
                                        <a
                                            href={project.link_github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-slate-800 hover:-translate-y-0.5 transition-all"
                                        >
                                            <Github className="w-5 h-5" />
                                            {t.projectDetail.btnRepo}
                                        </a>
                                    ) : (
                                        <button disabled className="w-full py-3.5 bg-slate-100 text-slate-400 rounded-xl font-bold flex items-center justify-center gap-2 cursor-not-allowed border border-slate-200">
                                            <Lock className="w-4 h-4" />
                                            {t.projectDetail.btnDisabled}
                                        </button>
                                    )}

                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </section>
        </MainLayoutGuest>
    );
}

export default function ProjectDetailPage() {
    return (
        <LanguageProvider>
            <ProjectDetailContent />
        </LanguageProvider>
    );
}