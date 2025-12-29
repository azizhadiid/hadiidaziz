import PortfolioPage from '@/components/pages/guest/PorotofolioPage';
import type { Metadata } from 'next';

// 'metadata' sekarang berada di Server Component, ini sudah benar.
export const metadata: Metadata = {
    title: 'Portofolio', // Ini akan mengisi placeholder %s
};

// Ini adalah Server Component (tanpa "use client")
export default function PoerotolioGuestSectionPage() {
    // Tugasnya hanya me-render Client Component
    return <PortfolioPage />;
}