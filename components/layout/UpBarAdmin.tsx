'use client'

import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';

interface UpbarProps {
    onMenuClick: () => void;
}

export default function Upbar({ onMenuClick }: UpbarProps) {
    return (
        <header className="sticky top-0 z-30 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
            <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                {/* Left Section */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-3">

                    <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-200">
                        <div className="text-left">
                            <p className="text-sm font-bold text-slate-900">Aziz A.</p>
                            <p className="text-xs text-slate-500">Super Admin</p>
                        </div>
                        <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
                            <div className="w-full h-full bg-linear-to-tr from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                                AZ
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}