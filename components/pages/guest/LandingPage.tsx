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
            <section id="home" className="pt-20 pb-20 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-slate-50 via-orange-50/30 to-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div className="space-y-8 order-2 lg:order-1 text-center lg:text-left">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.15]">
                                {t.hero.title1}<br />
                                <span className="bg-linear-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                                    {t.hero.title2}
                                </span>
                            </h1>
                            <p className="text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                {t.hero.desc}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Button asChild className="h-12 px-8 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full shadow-lg">
                                    <Link href="/portofolio">
                                        {t.hero.btnWork}
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" className="h-12 px-8 border-2 border-slate-200 text-slate-700 hover:border-orange-500 hover:text-orange-600 rounded-full">
                                    <Link href="/kontak">
                                        {t.hero.btnConnect}
                                    </Link>
                                </Button>
                            </div>
                            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-200/60">
                                <div><div className="text-3xl font-bold text-slate-900">2+</div><div className="text-xs text-slate-500 uppercase mt-1">{t.hero.stats.exp}</div></div>
                                <div><div className="text-3xl font-bold text-slate-900">10+</div><div className="text-xs text-slate-500 uppercase mt-1">{t.hero.stats.proj}</div></div>
                                <div><div className="text-3xl font-bold text-slate-900">5+</div><div className="text-xs text-slate-500 uppercase mt-1">{t.hero.stats.client}</div></div>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2 flex justify-center">
                            <div className="relative w-72 h-72 sm:w-96 sm:h-96 lg:w-125 lg:h-125">
                                <div className="absolute inset-0 rounded-full ring-0 hover:ring-8 hover:ring-orange-300/40 transition-all duration-500"></div>
                                {/* Foto Profile */}
                                <div className="relative w-full h-full rounded-full overflow-hidden border-8 border-white shadow-2xl">
                                    <div className="w-full h-full rounded-full overflow-hidden border-8 border-white shadow-2xl bg-white">
                                        <img
                                            src="/img/Profile.jpg"
                                            alt="Profile"
                                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 ease-out"
                                        />
                                    </div>
                                </div>

                                {/* Experience */}
                                <div className="absolute bottom-10 -left-4 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-1000 animate-float">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600"><Code className="w-5 h-5" /></div>
                                    <div>
                                        <p className="text-xs text-slate-500">Specialized as</p>
                                        <p className="font-bold text-slate-900">Full-Stack Developer</p>
                                    </div>
                                </div>

                                {/* Floating badge - Experience */}
                                <div className="absolute top-12 -right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-float">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Experience</p>
                                        <p className="font-bold text-slate-900">3+ Years</p>
                                    </div>
                                </div>

                                <div className="absolute top-6 left-6 bg-white px-3 py-1 rounded-full shadow-lg flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    <p className="text-xs font-medium text-slate-700">Available for work</p>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PORTFOLIO SECTION --- */}
            <section id="portfolio" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-orange-600 font-bold tracking-wider uppercase text-sm mb-2 block">Portofolio</span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">{t.titles.portfolio}</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {portfolio.map((project, index) => (
                            <Card key={index} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-2xl bg-white">
                                <div className="relative overflow-hidden h-64">
                                    <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <Button variant="secondary" className="rounded-full gap-2">Lihat Detail <ExternalLink className="w-4 h-4" /></Button>
                                    </div>
                                </div>
                                <CardContent className="p-6">
                                    <div className="text-xs font-bold text-orange-600 mb-2 uppercase tracking-wide">{project.category}</div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">{project.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">{project.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CERTIFICATES SECTION --- */}
            <section id="certificates" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-orange-600 font-bold tracking-wider uppercase text-sm mb-2 block">Prestasi</span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">{t.titles.certificates}</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {certificates.map((cert, index) => (
                            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-orange-200 transition-colors flex items-start gap-4">
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 shrink-0"><Award className="w-6 h-6" /></div>
                                <div>
                                    <h4 className="font-bold text-slate-900 line-clamp-2">{cert.title}</h4>
                                    <p className="text-sm text-slate-500 mt-1">{cert.org}</p>
                                    <p className="text-xs text-slate-400 mt-2 font-mono">{cert.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CONTACT SECTION --- */}
            <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-slate-50 -skew-y-3 origin-top-left -z-10 transform scale-110"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-6">{t.titles.contact}</h2>
                    <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">{t.contactDesc}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button className="h-14 px-10 bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-xl hover:shadow-2xl transition-all duration-300 rounded-full text-lg gap-3">
                            <Mail className="w-5 h-5" /> Kirim Email
                        </Button>
                        <Button variant="outline" className="h-14 px-10 border-2 border-slate-200 text-slate-700 hover:border-slate-900 hover:bg-transparent font-medium transition-all duration-300 rounded-full text-lg">
                            WhatsApp
                        </Button>
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