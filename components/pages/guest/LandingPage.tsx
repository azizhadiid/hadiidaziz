'use client'

import { useEffect, useState } from 'react';
import { Code, Briefcase, Box, Braces, Layout, Server, Globe, Database, GraduationCap, Cpu, Building2, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageProvider, useLanguage } from '@/components/contexts/LanguageContext';
import MainLayoutGuest from '@/components/layout/guest/MainLayoutGuest';
import Link from 'next/link';
import supabase from '@/lib/db';

// --- TIPE DATA PENDIDIKAN DARI DB ---
interface EducationData {
    id: string;
    tempat_pendidikan: string;
    gelar: string;
    periode: string;
    nilai: string;
    created_at: string;
}

interface ExperienceData {
    id: string;
    posisi: string;
    perusahaan: string;
    jenis_pekerjaan: string;
    periode: string;
    lokasi: string;
    deskripsi: string;
    keahlian: string; // Akan kita split jadi array nanti
    created_at: string;
}

// Daftar Skill Statis (Nama teknologi tidak perlu diterjemahkan)
const skillsList = [
    { name: "React & Next.js", icon: Box, category: "Frontend" },
    { name: "TypeScript", icon: Braces, category: "Language" },
    { name: "Tailwind CSS", icon: Layout, category: "Styling" },
    { name: "Node.js & Express", icon: Server, category: "Backend" },
    { name: "Laravel & PHP", icon: Globe, category: "Backend" },
    { name: "SQL & NoSQL", icon: Database, category: "Database" },
];

// Kita pisahkan konten ke komponen terpisah agar bisa pakai hook useLanguage
function LandingPageContent() {
    const { t } = useLanguage();

    // --- STATE UNTUK DATA DB ---
    const [educations, setEducations] = useState<EducationData[]>([]);
    const [experiences, setExperiences] = useState<ExperienceData[]>([]); // State Pengalaman
    const [loadingEdu, setLoadingEdu] = useState(true);
    const [loadingExp, setLoadingExp] = useState(true); // Loading Pengalaman

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Education
                const eduReq = await supabase
                    .from('educations')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (eduReq.data) setEducations(eduReq.data);
                setLoadingEdu(false);

                // 2. Fetch Experiences
                const expReq = await supabase
                    .from('experiences')
                    .select('*')
                    .order('created_at', { ascending: false }); // Urutkan dari yang terbaru

                if (expReq.data) setExperiences(expReq.data);
                setLoadingExp(false);

            } catch (err) {
                console.error("Unexpected error:", err);
            }
        };

        fetchData();
    }, []);

    return (
        <MainLayoutGuest>
            {/* --- HERO SECTION --- */}
            <section id="home" className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-slate-50 via-orange-50/30 to-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                        {/* TEXT CONTENT (Order 2 di Mobile, Order 1 di Desktop) */}
                        <div className="space-y-6 sm:space-y-8 order-2 lg:order-1 text-center lg:text-left">
                            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight lg:leading-[1.15]">
                                {t.hero.title1}<br />
                                <span className="bg-linear-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                                    {t.hero.title2}
                                </span>
                            </h1>
                            <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                {t.hero.desc}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full sm:w-auto">
                                <Button asChild className="h-12 px-8 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full shadow-lg w-full sm:w-auto">
                                    <Link href="/portofolio">
                                        {t.hero.btnWork}
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" className="h-12 px-8 border-2 border-slate-200 text-slate-700 hover:border-orange-500 hover:text-orange-600 rounded-full w-full sm:w-auto">
                                    <Link href="/kontak">
                                        {t.hero.btnConnect}
                                    </Link>
                                </Button>
                            </div>
                            <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-6 sm:pt-8 border-t border-slate-200/60">
                                <div><div className="text-2xl sm:text-3xl font-bold text-slate-900">2+</div><div className="text-[10px] sm:text-xs text-slate-500 uppercase mt-1">{t.hero.stats.exp}</div></div>
                                <div><div className="text-2xl sm:text-3xl font-bold text-slate-900">10+</div><div className="text-[10px] sm:text-xs text-slate-500 uppercase mt-1">{t.hero.stats.proj}</div></div>
                                <div><div className="text-2xl sm:text-3xl font-bold text-slate-900">5+</div><div className="text-[10px] sm:text-xs text-slate-500 uppercase mt-1">{t.hero.stats.client}</div></div>
                            </div>
                        </div>

                        {/* IMAGE CONTENT (Order 1 di Mobile, Order 2 di Desktop) */}
                        <div className="order-1 lg:order-2 flex justify-center relative py-8 lg:py-0">
                            {/* Container Gambar: Ukuran disesuaikan agar tidak terlalu besar di mobile */}
                            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-120 lg:h-120 lg:ml-14">

                                <div className="absolute inset-0 rounded-full ring-0 hover:ring-8 hover:ring-orange-300/40 transition-all duration-500"></div>

                                {/* Foto Profile */}
                                <div className="relative w-full h-full rounded-full overflow-hidden border-4 sm:border-8 border-white shadow-2xl">
                                    <div className="w-full h-full rounded-full overflow-hidden bg-white">
                                        <img
                                            src="/img/Profile.jpg"
                                            alt="Profile"
                                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 ease-out"
                                        />
                                    </div>
                                </div>

                                {/* --- BADGES (RESPONSIVE FIX) --- */}

                                {/* Badge: Specialized (Di Mobile: Tengah Bawah, Di Desktop: Kiri Bawah) */}
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 lg:translate-x-0 lg:bottom-10 lg:-left-12 
                                    bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl flex items-center gap-3 
                                    animate-float w-max max-w-[90%] z-20">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0">
                                        <Code className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] sm:text-xs text-slate-500">Specialized as</p>
                                        <p className="text-sm sm:text-base font-bold text-slate-900">Full-Stack Dev</p>
                                    </div>
                                </div>

                                {/* Badge: Experience (Di Mobile: Pojok Kanan Atas nempel, Di Desktop: Floating keluar) */}
                                <div className="absolute top-0 -right-2 sm:top-4 sm:-right-8 lg:top-12 lg:-right-6 
                                    bg-white/90 backdrop-blur-md p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl 
                                    flex items-center gap-3 animate-float animation-delay-500 z-20">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                                        <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] sm:text-xs text-slate-500">Experience</p>
                                        <p className="text-sm sm:text-base font-bold text-slate-900">3+ Years</p>
                                    </div>
                                </div>

                                {/* Badge: Available (Di Mobile: Pojok Kiri Atas) */}
                                <div className="absolute top-2 left-0 sm:top-6 sm:left-6 lg:left-0
                                    bg-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 z-20">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    <p className="text-[10px] sm:text-xs font-medium text-slate-700 whitespace-nowrap">Available for work</p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- ABOUT SECTION --- */}
            <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-white via-orange-50/40 to-slate-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-red-200/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
                        <div className="lg:col-span-7 space-y-10">
                            <div className="space-y-4">
                                <span className="text-orange-600 font-bold tracking-wider uppercase text-sm">{t.aboutSection.tagline}</span>
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                                    {t.aboutSection.title} <br />
                                    <span className="bg-linear-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                                        {t.aboutSection.titleAccent}
                                    </span>
                                </h2>
                            </div>
                            <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                                {t.aboutSection.description.map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>

                            {/* --- EDUCATION BLOCK (DYNAMIC DB) --- */}
                            <div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="flex items-center gap-3 text-xl font-bold text-slate-900 mb-6">
                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                                        <GraduationCap className="w-6 h-6" />
                                    </div>
                                    {/* Judul tetap dari Language Context */}
                                    {t.aboutSection.educationTitle}
                                </h3>
                                <div className="space-y-6">
                                    {loadingEdu ? (
                                        // Loading Skeleton Sederhana
                                        <div className="animate-pulse space-y-4">
                                            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                                            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                                        </div>
                                    ) : educations.length > 0 ? (
                                        // Mapping Data dari DB
                                        educations.map((edu) => (
                                            <div key={edu.id} className="relative pl-8 border-l-2 border-orange-200">
                                                <div className="absolute -left-2.25 top-1.5 w-4 h-4 bg-white border-2 border-orange-500 rounded-full"></div>
                                                {/* Data Konten dari DB */}
                                                <h4 className="text-lg font-bold text-slate-900">{edu.gelar}</h4>
                                                <p className="text-slate-700 font-medium">{edu.tempat_pendidikan}</p>
                                                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                                    <span>{edu.periode}</span>
                                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                    <span className="font-semibold text-orange-600">
                                                        {edu.nilai}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        // Fallback jika DB kosong
                                        <p className="text-slate-500 italic">No education data available yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-10">
                            <div>
                                <h3 className="flex items-center gap-3 text-xl font-bold text-slate-900 mb-3">
                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                                        <Cpu className="w-6 h-6" />
                                    </div>
                                    {t.aboutSection.skillsTitle}
                                </h3>
                                <p className="text-slate-600">{t.aboutSection.skillsDesc}</p>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {skillsList.map((skill, index) => (
                                    <div key={index} className="group bg-white border border-slate-200/80 rounded-xl p-4 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 flex flex-col items-center text-center gap-3">
                                        <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-slate-500 group-hover:text-orange-600 group-hover:bg-orange-50 transition-colors">
                                            <skill.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm group-hover:text-orange-600 transition-colors">{skill.name}</h4>
                                            <p className="text-xs text-slate-400 mt-1">{skill.category}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="relative h-64 rounded-2xl overflow-hidden shadow-2xl hidden lg:block">
                                <img src="/img/medal.jpg" alt="Coding" className="w-full h-full object-cover opacity-90 grayscale hover:grayscale-0 transition-all duration-700" />
                                <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 right-6 text-white">
                                    <p className="font-bold text-lg">"Always learning, always building."</p>
                                    <p className="text-sm text-slate-300">- Aziz Alhadiid</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- EXPERIENCE SECTION (BARU & GACOR) --- */}
            <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden border-t border-slate-200/60">
                <div className="max-w-7xl mx-auto relative z-10">

                    {/* Header Section */}
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <span className="text-orange-600 font-bold tracking-wider uppercase text-sm">{t.experienceSection.tagline}</span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                            {t.experienceSection.title} <br className="hidden sm:block" />
                            <span className="bg-linear-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                                {t.experienceSection.titleAccent}
                            </span>
                        </h2>
                        <p className="text-slate-600 text-lg">{t.experienceSection.desc}</p>
                    </div>

                    {/* Experience Grid */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {loadingExp ? (
                            // Skeleton Loading
                            [1, 2].map((i) => (
                                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-64 animate-pulse">
                                    <div className="h-6 bg-slate-200 rounded w-1/2 mb-4"></div>
                                    <div className="h-4 bg-slate-200 rounded w-1/3 mb-8"></div>
                                    <div className="space-y-2">
                                        <div className="h-3 bg-slate-200 rounded w-full"></div>
                                        <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                                    </div>
                                </div>
                            ))
                        ) : experiences.length > 0 ? (
                            experiences.map((exp) => (
                                <div
                                    key={exp.id}
                                    className="group bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/60 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 flex flex-col h-full"
                                >
                                    {/* Header Card */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                                                {exp.posisi}
                                            </h3>
                                            <div className="flex items-center gap-2 text-slate-600 mt-1 font-medium">
                                                <Building2 className="w-4 h-4 text-orange-500" />
                                                {exp.perusahaan}
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-bold uppercase rounded-full border border-orange-100">
                                            {exp.jenis_pekerjaan}
                                        </span>
                                    </div>

                                    {/* Meta Info */}
                                    <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4" />
                                            {exp.periode}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4" />
                                            {exp.lokasi}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-slate-600 text-sm leading-relaxed mb-6 grow">
                                        {exp.deskripsi}
                                    </p>

                                    {/* Skills Badges */}
                                    {exp.keahlian && (
                                        <div className="flex flex-wrap gap-2 mt-auto pt-4">
                                            {exp.keahlian.split(',').map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2.5 py-1 bg-slate-50 text-slate-600 text-xs font-medium rounded-md border border-slate-200 group-hover:border-orange-200 group-hover:text-orange-700 transition-colors"
                                                >
                                                    {skill.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 text-center py-12 text-slate-500 bg-white rounded-2xl border border-dashed border-slate-300">
                                <p>Belum ada data pengalaman yang ditambahkan.</p>
                            </div>
                        )}
                    </div>

                </div>
            </section>

        </MainLayoutGuest >
    );
}

// Komponen Utama yang diexport Next.js
export default function LandingPageGuest() {
    return (
        <LanguageProvider>
            <LandingPageContent />
        </LanguageProvider>
    );
}