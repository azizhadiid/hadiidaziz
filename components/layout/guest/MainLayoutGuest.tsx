'use client'

import React, { useState } from 'react';
import { Menu, X, Github, Linkedin, Twitter, Globe } from 'lucide-react';
import { useLanguage } from '@/components/contexts/LanguageContext';


interface MainLayoutGuestProps {
    children: React.ReactNode;
}

export default function MainLayoutGuest({ children }: MainLayoutGuestProps) {
    const { lang, toggleLanguage, t } = useLanguage();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('beranda');

    // Fungsi Scroll Smooth
    const scrollToSection = (sectionId: string) => {
        setIsMenuOpen(false);
        setActiveSection(sectionId);

        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };


    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-orange-50/30 to-white font-sans text-slate-900 flex flex-col">

            {/* --- NAVIGATION BAR --- */}
            <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">

                        {/* Logo */}
                        <div className="shrink-0 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                            <img
                                src="/img/logo.png"
                                alt="Logo"
                                className="h-10 w-auto object-contain hover:opacity-80 transition-opacity"
                            />
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden lg:flex items-center gap-8">
                            {t.nav.map((item) => {
                                const isActive = activeSection === item.id;

                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => scrollToSection(item.id)}
                                        className="relative group px-1 py-2 text-base font-semibold tracking-wide text-slate-600 hover:text-orange-600 transition-colors"
                                    >
                                        {item.label}

                                        {/* Underline */}
                                        <span
                                            className={`
                        absolute left-1/2 -bottom-1 h-0.5 bg-orange-500 rounded-full
                        transition-all duration-300 ease-out
                        ${isActive
                                                    ? 'w-full left-0'
                                                    : 'w-0 group-hover:w-full group-hover:left-0'}
                    `}
                                        />
                                    </button>
                                );
                            })}
                        </div>


                        {/* Right Actions */}
                        <div className="hidden lg:flex items-center gap-5">
                            <button
                                onClick={toggleLanguage}
                                className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-slate-100 text-sm font-bold text-slate-600 hover:border-orange-500 hover:text-orange-600 transition-all"
                            >
                                <Globe className="w-4 h-4" />
                                <span>{lang === 'id' ? 'IND' : 'ENG'}</span>
                            </button>
                            <div className="h-8 w-px bg-slate-200 mx-1"></div>
                            <button className="text-slate-500 hover:text-orange-600 transition-colors"><Github className="w-6 h-6" /></button>
                            <button className="text-slate-500 hover:text-orange-600 transition-colors"><Linkedin className="w-6 h-6" /></button>
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
                            {t.nav.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`block w-full text-left px-4 py-3 text-lg font-semibold rounded-xl transition-all
            ${activeSection === item.id
                                            ? 'text-orange-600 bg-orange-50'
                                            : 'text-slate-600 hover:text-orange-600 hover:bg-orange-50'}
        `}
                                >
                                    {item.label}
                                </button>
                            ))}
                            <div className="border-t border-slate-100 pt-6 px-4 flex justify-between items-center">
                                <button onClick={toggleLanguage} className="flex items-center gap-2 text-base font-bold text-slate-700 hover:text-orange-600">
                                    <Globe className="w-5 h-5" /> {lang === 'id' ? 'English' : 'Indonesia'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* --- MAIN CONTENT (Disini halaman akan dirender) --- */}
            <main className="grow pt-24">
                {children}
            </main>

            {/* --- FOOTER --- */}
            <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800 mt-auto">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-white">E</div>
                        <span className="text-xl font-bold">EasyFolio</span>
                    </div>
                    <div className="text-slate-400 text-sm">
                        © 2025 EasyFolio. {t.footer}
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-orange-400 transition-colors"><Twitter className="w-5 h-5" /></a>
                        <a href="#" className="hover:text-orange-400 transition-colors"><Github className="w-5 h-5" /></a>
                        <a href="#" className="hover:text-orange-400 transition-colors"><Linkedin className="w-5 h-5" /></a>
                    </div>
                </div>
            </footer>
        </div>
    );
}