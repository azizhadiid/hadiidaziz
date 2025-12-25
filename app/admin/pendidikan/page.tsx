import PendidikanAdminPage from '@/components/pages/admin/PendidikanAdminPage';
import SertifikatAdminPage from '@/components/pages/admin/SertifikatAdminPage';
import type { Metadata } from 'next';

// 'metadata' sekarang berada di Server Component, ini sudah benar.
export const metadata: Metadata = {
    title: 'Pendidikan Admin', // Ini akan mengisi placeholder %s
};

// Ini adalah Server Component (tanpa "use client")
export default function PendidikanAdminPageSection() {
    // Tugasnya hanya me-render Client Component
    return <PendidikanAdminPage />;
}