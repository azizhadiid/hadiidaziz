'use client'

import React from 'react';
import { Mail, ExternalLink, Code, Award, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LanguageProvider, useLanguage } from '@/components/contexts/LanguageContext';
import MainLayoutGuest from '@/components/layout/guest/MainLayoutGuest';
import Link from 'next/link';

// Kita pisahkan konten ke komponen terpisah agar bisa pakai hook useLanguage
function LandingPageContent() {
    const { t, lang } = useLanguage(); // Ambil teks dan status bahasa

    // Data Dummy (Nanti diganti fetch DB)
    const portfolio = [
        {
            title: "Sistem Informasi Akademik",
            category: "Web Development",
            image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=500&h=300&fit=crop",
            description: t.portfolioDesc[0] // Ambil dari dictionary
        },
        {
            title: "Aplikasi Kasir UMKM",
            category: "Mobile App",
            image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&h=300&fit=crop",
            description: t.portfolioDesc[1]
        },
        {
            title: "Company Profile BUMN",
            category: "Frontend",
            image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&h=300&fit=crop",
            description: t.portfolioDesc[2]
        }
    ];

    const certificates = [
        { title: "AWS Cloud Practitioner", org: "Amazon Web Services", date: "2024" },
        { title: "Frontend Developer Expert", org: "Dicoding Indonesia", date: "2023" },
        { title: "Google UX Design", org: "Coursera", date: "2023" },
    ];

    return (
        <MainLayoutGuest>
            {/* --- HERO SECTION --- */}
            <section id="home" className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-slate-50 via-orange-50/30 to-white overflow-hidden">
                <div className="max-w-7xl mx-auto">
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
                            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-120 lg:h-120">

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