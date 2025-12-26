import AdminPortofolio from '@/components/pages/admin/ClientPortofolio';
import type { Metadata } from 'next';

// 'metadata' sekarang berada di Server Component, ini sudah benar.
export const metadata: Metadata = {
    title: 'Portofolio Admin', // Ini akan mengisi placeholder %s
};

// Ini adalah Server Component (tanpa "use client")
export default function PortofolioAdminPageSection() {
    // Tugasnya hanya me-render Client Component
    return <AdminPortofolio />;
}
