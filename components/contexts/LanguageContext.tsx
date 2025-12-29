'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tipe Data Bahasa
type Language = 'id' | 'en';

// Kamus Kata (Dictionary)
const dictionary = {
    id: {
        nav: [
            { id: 'home', label: 'Beranda', path: '/' },
            { id: 'about', label: 'Tentang', path: '/about' },
            { id: 'portfolio', label: 'Portofolio', path: '/portofolio' },
            { id: 'contact', label: 'Kontak', path: '/kontak' }
        ],
        hero: {
            title1: "Membangun Pengalaman Digital",
            title2: "dengan Sepenuh Hati",
            desc: "Mengubah ide menjadi solusi elegan melalui desain kreatif dan pengembangan inovatif.",
            btnWork: "Lihat Karya Saya",
            btnConnect: "Mari Terhubung",
            stats: { exp: "Tahun Pengalaman", proj: "Proyek Selesai", client: "Klien Puas" }
        },
        // --- TAMBAHAN YANG HILANG ---
        portfolioDesc: [
            "Sistem manajemen akademik terintegrasi untuk universitas dengan fitur KRS, penilaian, dan data mahasiswa.",
            "Aplikasi Point of Sales (POS) berbasis mobile untuk membantu UMKM mengelola transaksi dan stok barang.",
            "Website profil perusahaan BUMN yang modern, responsif, dan informatif untuk meningkatkan citra publik."
        ],
        // -----------------------------
        footerSection: {
            ctaTitle: "Siap memulai proyek?",
            ctaDesc: "Mari ciptakan sesuatu yang luar biasa bersama.",
            ctaBtn: "Hubungi Saya",
            brandDesc: "Menciptakan pengalaman digital dengan presisi pixel-perfect dan teknologi modern.",
            quickLinks: "Tautan Cepat",
            servicesTitle: "Layanan",
            contactTitle: "Kontak",
            rights: "Hak Cipta Dilindungi.",
            madeWith: "Dibuat dengan",
            servicesList: ['Pengembangan Web', 'Aplikasi Mobile', 'Desain UI/UX', 'Analisis Sistem']
        }
    },
    en: {
        nav: [
            { id: 'home', label: 'Home', path: '/' },
            { id: 'about', label: 'About', path: '/about' },
            { id: 'portfolio', label: 'Portfolio', path: '/portofolio' },
            { id: 'contact', label: 'Contact', path: '/kontak' }
        ],
        hero: {
            title1: "Crafting Digital Experiences",
            title2: "with Passion",
            desc: "Transforming ideas into elegant solutions through creative design and innovative development.",
            btnWork: "View My Work",
            btnConnect: "Let's Connect",
            stats: { exp: "Years Experience", proj: "Projects Completed", client: "Happy Clients" }
        },
        // --- MISSING ADDITION ---
        portfolioDesc: [
            "Integrated academic management system for universities featuring course selection, grading, and student data.",
            "Mobile-based Point of Sales (POS) application helping SMEs manage transactions and inventory.",
            "Modern, responsive, and informative state-owned enterprise profile website to enhance public image."
        ],
        // -------------------------
        footerSection: {
            ctaTitle: "Ready to start a project?",
            ctaDesc: "Let's build something amazing together.",
            ctaBtn: "Get in Touch",
            brandDesc: "Crafting digital experiences with pixel-perfect precision and modern technologies.",
            quickLinks: "Quick Links",
            servicesTitle: "Services",
            contactTitle: "Contact",
            rights: "All rights reserved.",
            madeWith: "Made with",
            servicesList: ['Web Development', 'Mobile Apps', 'UI/UX Design', 'System Analysis']
        }
    }
};

// Membuat Context
interface LanguageContextType {
    lang: Language;
    toggleLanguage: () => void;
    t: typeof dictionary['id'];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Language>('id');

    const toggleLanguage = () => {
        setLang(prev => prev === 'id' ? 'en' : 'id');
    };

    return (
        <LanguageContext.Provider value={{ lang, toggleLanguage, t: dictionary[lang] }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}