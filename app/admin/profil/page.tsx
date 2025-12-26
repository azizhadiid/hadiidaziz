import AdminProfilePage from '@/components/pages/admin/ProfileAdminPage';
import type { Metadata } from 'next';

// 'metadata' sekarang berada di Server Component, ini sudah benar.
export const metadata: Metadata = {
    title: 'Profile Admin', // Ini akan mengisi placeholder %s
};

// Ini adalah Server Component (tanpa "use client")
export default function ProfileAdminPageSection() {
    // Tugasnya hanya me-render Client Component
    return <AdminProfilePage />;
}
