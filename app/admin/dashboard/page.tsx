import AdminDashboard from '@/components/pages/admin/DashboardAdminPage';
import type { Metadata } from 'next';

// 'metadata' sekarang berada di Server Component, ini sudah benar.
export const metadata: Metadata = {
    title: 'Dashbaord Admin', // Ini akan mengisi placeholder %s
};

// Ini adalah Server Component (tanpa "use client")
export default function DashboardAdminPageSection() {
    // Tugasnya hanya me-render Client Component
    return <AdminDashboard />;
}