'use client'

import React from 'react';
import { Heart } from 'lucide-react';

export default function FooterAdmin() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-auto border-t border-slate-200 bg-white/50 backdrop-blur-sm py-6 transition-all">
            <div className="px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">

                {/* Copyright Section */}
                <div className="text-center md:text-left">
                    <p>&copy; {currentYear} <span className="font-semibold text-slate-700">Aziz Alhadiid</span>. All rights reserved.</p>
                </div>

                {/* Right Section: Links & Version */}
                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
                    <div className="flex items-center gap-1 group cursor-pointer hover:text-orange-600 transition-colors">
                        <span>Made with</span>
                        <Heart className="w-3.5 h-3.5 fill-current group-hover:animate-pulse" />
                        <span>in Jambi</span>
                    </div>

                    <span className="hidden md:inline text-slate-300">|</span>

                    <span>v1.0.0</span>
                </div>
            </div>
        </footer>
    );
}