import AdminPengalamanPage from '@/components/pages/admin/PengalamanAdminPage';
import type { Metadata } from 'next';

// 'metadata' sekarang berada di Server Component, ini sudah benar.
export const metadata: Metadata = {
    title: 'Pengalaman Admin', // Ini akan mengisi placeholder %s
};

// Ini adalah Server Component (tanpa "use client")
export default function PengalamanAdminPageSection() {
    // Tugasnya hanya me-render Client Component
    return <AdminPengalamanPage />;
}
