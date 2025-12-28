'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tipe Data Bahasa
type Language = 'id' | 'en';

// Kamus Kata (Dictionary)
const dictionary = {
    id: {
        nav: [
            { id: 'home', label: 'Beranda' },
            { id: 'about', label: 'Tentang' },
            { id: 'portfolio', label: 'Portofolio' },
            { id: 'certificates', label: 'Sertifikat' },
            { id: 'contact', label: 'Kontak' }
        ],
        footer: "Hak Cipta Dilindungi.",
        hero: {
            title1: "Membangun Pengalaman Digital",
            title2: "dengan Sepenuh Hati",
            desc: "Mengubah ide menjadi solusi elegan melalui desain kreatif dan pengembangan inovatif.",
            btnWork: "Lihat Karya Saya",
            btnConnect: "Mari Terhubung",
            stats: { exp: "Tahun Pengalaman", proj: "Proyek Selesai", client: "Klien Puas" }
        },
        titles: {
            about: "Tentang Saya",
            portfolio: "Karya Pilihan",
            certificates: "Sertifikasi & Penghargaan",
            contact: "Mari Bekerja Sama"
        },
        contactDesc: "Punya ide proyek? Mari ciptakan sesuatu yang luar biasa bersama.",
        portfolioDesc: [
            "Platform manajemen akademik kampus modern.",
            "Manajemen keuangan aman dan cepat.",
            "Website korporat responsif dan elegan."
        ]
    },
    en: {
        nav: [
            { id: 'home', label: 'Home' },
            { id: 'about', label: 'About' },
            { id: 'portfolio', label: 'Portfolio' },
            { id: 'certificates', label: 'Certificates' },
            { id: 'contact', label: 'Contact' }
        ],
        footer: "All rights reserved.",
        hero: {
            title1: "Crafting Digital Experiences",
            title2: "with Passion",
            desc: "Transforming ideas into elegant solutions through creative design and innovative development.",
            btnWork: "View My Work",
            btnConnect: "Let's Connect",
            stats: { exp: "Years Experience", proj: "Projects Completed", client: "Happy Clients" }
        },
        titles: {
            about: "About Me",
            portfolio: "Featured Work",
            certificates: "Certifications & Awards",
            contact: "Let's Work Together"
        },
        contactDesc: "Have a project in mind? Let's create something amazing together.",
        portfolioDesc: [
            "Modern campus academic management platform.",
            "Secure and fast financial management.",
            "Responsive and elegant corporate website."
        ]
    }
};

// Membuat Context
interface LanguageContextType {
    lang: Language;
    toggleLanguage: () => void;
    t: typeof dictionary['id']; // Helper untuk ambil teks
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

// Custom Hook agar mudah dipanggil
export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}