'use client'

import React, { useState } from 'react';
import Sidebar from './SideBarAdmin';
import Upbar from './UpBarAdmin';
import FooterAdmin from './FooterAdmin';

interface MainLayoutAdminProps {
    children: React.ReactNode;
}

export default function MainLayoutAdmin({ children }: MainLayoutAdminProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-orange-50 to-slate-100 font-sans">
            {/* Sidebar Component */}
            <Sidebar
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />

            {/* Main Content Wrapper */}
            <div className={`transition-all duration-300 min-h-screen flex flex-col ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>

                {/* Upbar Component */}
                <Upbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

                {/* Dynamic Child Content */}
                <main className="p-4 sm:p-6 lg:p-8 flex-1">
                    {children}
                </main>

                {/* Pasang Footer Disini */}
                <FooterAdmin />
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
}