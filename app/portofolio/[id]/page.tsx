import ProjectDetailPage from '@/components/pages/guest/DetailPortofolio';
import type { Metadata } from 'next';

// 'metadata' sekarang berada di Server Component, ini sudah benar.
export const metadata: Metadata = {
    title: 'Detail Portofolio', // Ini akan mengisi placeholder %s
};

// Ini adalah Server Component (tanpa "use client")
export default function DetailPoerotolioGuestSectionPage() {
    // Tugasnya hanya me-render Client Component
    return <ProjectDetailPage />;
}