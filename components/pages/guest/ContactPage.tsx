'use client'

import React from 'react';
import {
    Mail, MapPin, Send, MessageCircle, ArrowRight, Instagram, Linkedin, Github
} from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/components/contexts/LanguageContext';
import MainLayoutGuest from '@/components/layout/guest/MainLayoutGuest';

function ContactContent() {
    const { t } = useLanguage();

    // Nomor WA (Format Internasional tanpa '+', contoh: 62813...)
    const whatsappNumber = "6281366705844";

    // Fungsi handle submit dummy (karena tidak ada DB)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Pesan terkirim! (Ini hanya demo UI)");
    };

    return (
        <MainLayoutGuest>
            <section className="pt-20 pb-20 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-slate-50 via-orange-50/30 to-white min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* --- HEADER --- */}
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <span className="text-orange-600 font-bold tracking-wider uppercase text-sm">
                            {t.contactPage.tagline}
                        </span>
                        <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 leading-tight">
                            {t.contactPage.title} <br className="hidden sm:block" />
                            <span className="bg-linear-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                                {t.contactPage.titleAccent}
                            </span>
                        </h1>
                        <p className="text-slate-600 text-lg">
                            {t.contactPage.desc}
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">

                        {/* --- LEFT COLUMN: CONTACT INFO --- */}
                        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">

                            {/* 1. WhatsApp Card (Special Feature) */}
                            <div className="bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl p-8 text-white shadow-xl shadow-green-500/20 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>

                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                                            <MessageCircle className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{t.contactPage.info.waLabel}</h3>
                                            <p className="text-green-100 text-sm opacity-90">Fast Response (09:00 - 17:00)</p>
                                        </div>
                                    </div>

                                    <p className="text-green-50 mb-6 text-sm leading-relaxed">
                                        Ingin respons lebih cepat? Langsung chat saya melalui WhatsApp untuk diskusi santai.
                                    </p>

                                    <a
                                        href={`https://wa.me/${whatsappNumber}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-white text-green-600 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors shadow-lg"
                                    >
                                        {t.contactPage.info.waBtn} <ArrowRight className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>

                            {/* 2. Other Info Cards */}
                            <div className="grid sm:grid-cols-2 gap-6">
                                {/* Email */}
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-orange-200 hover:shadow-lg transition-all">
                                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 mb-4">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <h4 className="text-slate-900 font-bold mb-1">{t.contactPage.info.emailLabel}</h4>
                                    <a href="mailto:azizalhadiid55@gmail.com" className="text-slate-500 text-sm hover:text-orange-600 transition-colors wrap-break-words">
                                        azizalhadiid55@gmail.com
                                    </a>
                                </div>

                                {/* Location */}
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-orange-200 hover:shadow-lg transition-all">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <h4 className="text-slate-900 font-bold mb-1">{t.contactPage.info.locLabel}</h4>
                                    <p className="text-slate-500 text-sm">
                                        {t.contactPage.info.locDesc}
                                    </p>
                                </div>
                            </div>

                            {/* 3. Social Media Links */}
                            <div className="pt-4">
                                <h4 className="text-slate-900 font-bold mb-4">Social Media</h4>
                                <div className="flex gap-4">
                                    {[
                                        { icon: Github, href: "https://github.com/azizhadiid" },
                                        { icon: Linkedin, href: "https://www.linkedin.com/in/aziz-alhadiid" },
                                        { icon: Instagram, href: "https://www.instagram.com/alhadiid_aziz" }
                                    ].map((item, idx) => (
                                        <a
                                            key={idx}
                                            href={item.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300"
                                        >
                                            <item.icon className="w-5 h-5" />
                                        </a>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* --- RIGHT COLUMN: FORM --- */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 animate-in fade-in slide-in-from-right-4 duration-700">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 ml-1">
                                            {t.contactPage.form.name} <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder={t.contactPage.form.placeholderName}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                            required
                                        />
                                    </div>
                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 ml-1">
                                            {t.contactPage.form.email} <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            placeholder={t.contactPage.form.placeholderEmail}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Subject */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 ml-1">
                                        {t.contactPage.form.subject}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={t.contactPage.form.placeholderSubject}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                    />
                                </div>

                                {/* Message */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 ml-1">
                                        {t.contactPage.form.message} <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        rows={5}
                                        placeholder={t.contactPage.form.placeholderMsg}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
                                        required
                                    ></textarea>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-linear-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <Send className="w-5 h-5" />
                                    {t.contactPage.form.btnSend}
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </section>
        </MainLayoutGuest>
    );
}

export default function ContactPage() {
    return (
        <LanguageProvider>
            <ContactContent />
        </LanguageProvider>
    );
}