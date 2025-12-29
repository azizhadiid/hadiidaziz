'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tipe Data Bahasa
type Language = 'id' | 'en';

// Kamus Kata (Dictionary)
const dictionary = {
    id: {
        nav: [
            { id: 'home', label: 'Beranda', path: '/#home' }, // Update path ke ID
            { id: 'about', label: 'Tentang', path: '/#about' }, // Update path ke ID
            { id: 'portfolio', label: 'Portofolio', path: '/portofolio' },
            { id: 'contact', label: 'Kontak', path: '/kontak' }
        ],
        hero: {
            title1: "Membangun Pengalaman Digital",
            title2: "dengan Sepenuh Hati",
            desc: "Mengubah ide menjadi solusi elegan melalui desain kreatif dan pengembangan inovatif sebagai Full-stack Developer.",
            btnWork: "Lihat Karya Saya",
            btnConnect: "Mari Terhubung",
            stats: { exp: "Tahun Pengalaman", proj: "Proyek Selesai", client: "Klien Puas" }
        },
        // --- SECTION ABOUT BARU ---
        aboutSection: {
            tagline: "TENTANG SAYA",
            title: "Lebih dari Sekadar Kode, Saya Membangun",
            titleAccent: "Solusi Digital.",
            // Data diambil dan diringkas dari Ringkasan CV
            description: [
                "Saya adalah Software Developer yang sangat termotivasi dengan pengalaman sebagai Full-stack Developer. Saya memiliki hasrat yang kuat untuk membangun aplikasi yang skalabel dan ramah pengguna.",
                "Keahlian saya terletak pada pemanfaatan teknologi web modern seperti React, Next.js, Tailwind CSS, dan Node.js untuk mengubah ide kompleks menjadi solusi yang elegan dan fungsional. Saya seorang pembelajar cepat yang bersemangat untuk terus berkembang dan memberikan dampak positif melalui teknologi."
            ],
            educationTitle: "Pendidikan",
            skillsTitle: "Arsenat Teknologi",
            skillsDesc: "Alat dan teknologi yang saya gunakan untuk menghidupkan ide."
            // Nama skill tidak perlu diterjemahkan
        },
        // ---------------------------
        // --- TAMBAHAN BARU: HALAMAN KONTAK ---
        contactPage: {
            tagline: "HUBUNGI SAYA",
            title: "Mari Memulai",
            titleAccent: "Sesuatu yang Baru.",
            desc: "Punya ide proyek atau ingin berdiskusi? Jangan ragu untuk menghubungi saya. Saya selalu terbuka untuk peluang baru.",
            form: {
                name: "Nama Lengkap",
                email: "Alamat Email",
                subject: "Subjek",
                message: "Pesan",
                btnSend: "Kirim Pesan",
                placeholderName: "Masukkan nama Anda",
                placeholderEmail: "contoh@email.com",
                placeholderSubject: "Apa yang ingin didiskusikan?",
                placeholderMsg: "Tuliskan detail pesan Anda di sini..."
            },
            info: {
                title: "Informasi Kontak",
                emailLabel: "Email Saya",
                waLabel: "WhatsApp",
                waBtn: "Chat Sekarang",
                locLabel: "Lokasi",
                locDesc: "Kota Jambi, Indonesia"
            }
        },
        // --- TAMBAHAN BARU: SECTION PENGALAMAN ---
        experienceSection: {
            tagline: "PENGALAMAN KERJA",
            title: "Jejak Langkah &",
            titleAccent: "Dedikasi Profesional.",
            desc: "Perjalanan karir saya dalam menciptakan solusi digital yang berdampak nyata."
        },
        // ------------------------------------------
        // --- TAMBAHAN BARU: HALAMAN PORTOFOLIO ---
        portfolioPage: {
            tagline: "KARYA TERBAIK",
            title: "Portofolio &",
            titleAccent: "Sertifikasi",
            desc: "Kumpulan proyek nyata dan pengakuan profesional yang telah saya raih.",
            tabProject: "Proyek",
            tabCert: "Sertifikat",
            btnView: "Lihat Detail",
            btnCredential: "Lihat Kredensial",
            noDataProj: "Belum ada proyek yang ditampilkan.",
            noDataCert: "Belum ada sertifikat yang ditampilkan."
        },
        portfolioDesc: [
            "Sistem manajemen akademik terintegrasi untuk universitas dengan fitur KRS, penilaian, dan data mahasiswa.",
            "Aplikasi Point of Sales (POS) berbasis mobile untuk membantu UMKM mengelola transaksi dan stok barang.",
            "Website profil perusahaan BUMN yang modern, responsif, dan informatif untuk meningkatkan citra publik."
        ],
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
            { id: 'home', label: 'Home', path: '/#home' }, // Update path ke ID
            { id: 'about', label: 'About', path: '/#about' }, // Update path ke ID
            { id: 'portfolio', label: 'Portfolio', path: '/portofolio' },
            { id: 'contact', label: 'Contact', path: '/kontak' }
        ],
        hero: {
            title1: "Crafting Digital Experiences",
            title2: "with Passion",
            desc: "Transforming ideas into elegant solutions through creative design and innovative development as a Full-stack Developer.",
            btnWork: "View My Work",
            btnConnect: "Let's Connect",
            stats: { exp: "Years Experience", proj: "Projects Completed", client: "Happy Clients" }
        },
        // --- NEW ABOUT SECTION ---
        aboutSection: {
            tagline: "ABOUT ME",
            title: "More Than Just Code, I Build",
            titleAccent: "Digital Solutions.",
            // Data extracted and summarized from CV Summary
            description: [
                "I am a highly motivated Software Developer with experience as a Full-stack Developer. I have a strong passion for building scalable and user-friendly applications.",
                "My expertise lies in leveraging modern web technologies such as React, Next.js, Tailwind CSS, and Node.js to transform complex ideas into elegant, functional solutions. I am a quick learner eager to continuously grow and make a positive impact through technology."
            ],
            educationTitle: "Education",
            // Data from CV Education
            skillsTitle: "Tech Arsenal",
            skillsDesc: "Tools and technologies I leverage to bring ideas to life."
            // Skill names don't need translation
        },
        // -------------------------
        // --- NEW ADDITION: CONTACT PAGE ---
        contactPage: {
            tagline: "GET IN TOUCH",
            title: "Let's Start",
            titleAccent: "Something New.",
            desc: "Have a project idea or want to discuss? Don't hesitate to reach out. I'm always open to new opportunities.",
            form: {
                name: "Full Name",
                email: "Email Address",
                subject: "Subject",
                message: "Message",
                btnSend: "Send Message",
                placeholderName: "Enter your name",
                placeholderEmail: "example@email.com",
                placeholderSubject: "What do you want to discuss?",
                placeholderMsg: "Write your message details here..."
            },
            info: {
                title: "Contact Information",
                emailLabel: "My Email",
                waLabel: "WhatsApp",
                waBtn: "Chat Now",
                locLabel: "Location",
                locDesc: "Jambi City, Indonesia"
            }
        },
        // --- NEW ADDITION: EXPERIENCE SECTION ---
        experienceSection: {
            tagline: "WORK EXPERIENCE",
            title: "Professional Journey &",
            titleAccent: "Dedication.",
            desc: "My career path in creating impactful digital solutions."
        },
        // --- NEW ADDITION: PORTFOLIO PAGE ---
        portfolioPage: {
            tagline: "FEATURED WORKS",
            title: "Portfolio &",
            titleAccent: "Certifications",
            desc: "A collection of real-world projects and professional recognitions I have achieved.",
            tabProject: "Projects",
            tabCert: "Certificates",
            btnView: "View Details",
            btnCredential: "View Credential",
            noDataProj: "No projects displayed yet.",
            noDataCert: "No certificates displayed yet."
        },
        portfolioDesc: [
            "Integrated academic management system for universities featuring course selection, grading, and student data.",
            "Mobile-based Point of Sales (POS) application helping SMEs manage transactions and inventory.",
            "Modern, responsive, and informative state-owned enterprise profile website to enhance public image."
        ],
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