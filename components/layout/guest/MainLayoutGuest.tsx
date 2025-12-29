'use client'

import React, { useEffect, useState } from 'react';
import { Menu, X, Github, Linkedin, Globe, Heart, MapPin, Mail, ArrowRight, InstagramIcon } from 'lucide-react';
import { useLanguage } from '@/components/contexts/LanguageContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MainLayoutGuestProps {
    children: React.ReactNode;
}

export default function MainLayoutGuest({ children }: MainLayoutGuestProps) {
    const { lang, toggleLanguage, t } = useLanguage();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // 1. Ambil Pathname
    const pathname = usePathname();

    // 2. State untuk melacak Hash aktif
    const [activeHash, setActiveHash] = useState('#home');

    // 3. EFFECT: SCROLL SPY
    useEffect(() => {
        if (pathname === '/') {
            const sections = ['home', 'about', 'experience']; // Tambahkan ID section lain jika ada

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveHash(`#${entry.target.id}`);
                    }
                });
            }, {
                rootMargin: '-50% 0px -50% 0px'
            });

            sections.forEach((id) => {
                const element = document.getElementById(id);
                if (element) observer.observe(element);
            });

            return () => observer.disconnect();
        } else {
            setActiveHash('');
        }
    }, [pathname]);

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-orange-50/30 to-white font-sans text-slate-900 flex flex-col">

            {/* --- NAVIGATION BAR --- */}
            <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">

                        {/* Logo */}
                        <Link href="/" className="shrink-0 cursor-pointer">
                            <img
                                src="/img/logo.png"
                                alt="Logo"
                                className="h-10 w-auto object-contain hover:opacity-80 transition-opacity"
                            />
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden lg:flex items-center gap-8">
                            {t.nav.map((item) => {
                                const isHashLink = item.path.startsWith('/#');
                                let isActive = false;

                                if (isHashLink) {
                                    isActive = pathname === '/' && item.path === `/${activeHash}`;
                                } else {
                                    isActive = pathname === item.path;
                                }

                                return (
                                    <Link
                                        key={item.id}
                                        href={item.path}
                                        className={`relative group py-2 text-base font-semibold tracking-wide transition-colors ${isActive ? 'text-orange-600' : 'text-slate-600 hover:text-orange-600'
                                            }`}
                                    >
                                        {item.label}
                                        <span
                                            className={`
                                                absolute left-0 -bottom-1 w-full h-0.5 bg-orange-500 rounded-full
                                                transition-transform duration-300 ease-out origin-left
                                                ${isActive
                                                    ? 'scale-x-100'
                                                    : 'scale-x-0 group-hover:scale-x-100'}
                                            `}
                                        />
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Right Actions */}
                        <div className="hidden lg:flex items-center gap-5">
                            <button
                                onClick={toggleLanguage}
                                className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-slate-100 text-sm font-bold text-slate-600 hover:border-orange-500 hover:text-orange-600 transition-all cursor-pointer"
                            >
                                <Globe className="w-4 h-4" />
                                <span>{lang === 'id' ? 'IND' : 'ENG'}</span>
                            </button>
                            <div className="h-8 w-px bg-slate-200 mx-1"></div>
                            <a href="https://github.com/azizhadiid" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-orange-600 transition-colors"><Github className="w-6 h-6" /></a>
                            <a href="https://www.linkedin.com/in/aziz-alhadiid" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-orange-600 transition-colors"><Linkedin className="w-6 h-6" /></a>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown */}
                {isMenuOpen && (
                    <div className="lg:hidden bg-white border-t border-slate-100 absolute w-full shadow-xl">
                        <div className="px-4 py-6 space-y-4">
                            {t.nav.map((item) => {
                                const isHashLink = item.path.startsWith('/#');
                                let isActive = false;
                                if (isHashLink) {
                                    isActive = pathname === '/' && item.path === `/${activeHash}`;
                                } else {
                                    isActive = pathname === item.path;
                                }

                                return (
                                    <Link
                                        key={item.id}
                                        href={item.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`block w-full text-left px-4 py-3 text-lg font-semibold rounded-xl transition-all
                                            ${isActive
                                                ? 'text-orange-600 bg-orange-50'
                                                : 'text-slate-600 hover:text-orange-600 hover:bg-orange-50'}
                                        `}
                                    >
                                        {item.label}
                                    </Link>
                                )
                            })}
                            <div className="border-t border-slate-100 pt-6 px-4 flex justify-between items-center">
                                <button onClick={toggleLanguage} className="flex items-center gap-2 text-base font-bold text-slate-700 hover:text-orange-600">
                                    <Globe className="w-5 h-5" /> {lang === 'id' ? 'English' : 'Indonesia'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* --- MAIN CONTENT --- */}
            <main className="grow pt-24">
                {children}
            </main>

            {/* --- FOOTER (THEME UPDATE: LIGHT) --- */}
            {/* Ubah bg-slate-950 -> bg-white, text-slate-300 -> text-slate-600, border-slate-900 -> border-slate-200 */}
            <footer className="relative bg-white text-slate-600 pt-20 pb-10 overflow-hidden font-sans border-t border-slate-200">

                {/* Glow Effect disesuaikan untuk background putih */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-24 bg-orange-100/60 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                    {/* TOP SECTION: CTA */}
                    <div className="flex flex-col md:flex-row justify-between items-center pb-16 border-b border-slate-200 gap-8">
                        <div className="text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                                {t.footerSection.ctaTitle}
                            </h2>
                            <p className="text-slate-500">{t.footerSection.ctaDesc}</p>
                        </div>

                        <Link
                            href="/kontak"
                            className="group flex items-center gap-2 bg-linear-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-105 transition-all duration-300"
                        >
                            {t.footerSection.ctaBtn}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* MIDDLE SECTION */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 py-16">

                        {/* Brand Column */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                {/* Logo ditampilkan langsung tanpa kotak gradient agar cocok dengan background putih */}
                                <img
                                    src="/img/logo.png"
                                    alt="Logo"
                                    className="h-10 w-auto object-contain hover:opacity-80 transition-opacity"
                                />
                                <span className="text-2xl font-bold text-slate-900 tracking-tight">Aziz Hadiid</span>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                {t.footerSection.brandDesc}
                            </p>

                            <div className="flex gap-4 pt-2">
                                {[
                                    { icon: InstagramIcon, href: "https://www.instagram.com/alhadiid_aziz?igsh=MWxncnd0bjBuOGt1Mw==" },
                                    { icon: Github, href: "https://github.com/azizhadiid" },
                                    { icon: Linkedin, href: "https://www.linkedin.com/in/aziz-alhadiid" }
                                ].map((item, idx) => (
                                    <a
                                        key={idx}
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        // Update style icon untuk background putih
                                        className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-white hover:border-orange-500 hover:bg-orange-500 transition-all duration-300 group"
                                    >
                                        <item.icon className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-slate-900 font-bold mb-6">{t.footerSection.quickLinks}</h3>
                            <ul className="space-y-3">
                                {t.nav.map((item) => (
                                    <li key={item.id}>
                                        <Link href={item.path} className="text-sm text-slate-600 hover:text-orange-600 transition-colors flex items-center gap-2 group">
                                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Services */}
                        <div>
                            <h3 className="text-slate-900 font-bold mb-6">{t.footerSection.servicesTitle}</h3>
                            <ul className="space-y-3">
                                {t.footerSection.servicesList.map((item, idx) => (
                                    <li key={idx}>
                                        <Link href="/portofolio" className="text-sm text-slate-600 hover:text-orange-600 transition-colors block">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="text-slate-900 font-bold mb-6">{t.footerSection.contactTitle}</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                                    <span className="text-sm text-slate-600">azizalhadiid55@gmail.com</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                                    <span className="text-sm text-slate-600">Jambi City, Indonesia<br />Remote Friendly</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* BOTTOM SECTION */}
                    <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                        <div>
                            &copy; 2025 AzizHadiid. {t.footerSection.rights}
                        </div>
                        <div className="flex items-center gap-1">
                            {t.footerSection.madeWith} <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" /> in Jambi
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}