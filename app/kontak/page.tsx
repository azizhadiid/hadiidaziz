import ContactPage from '@/components/pages/guest/ContactPage';
import type { Metadata } from 'next';

// 'metadata' sekarang berada di Server Component, ini sudah benar.
export const metadata: Metadata = {
    title: 'Kontak', // Ini akan mengisi placeholder %s
};

// Ini adalah Server Component (tanpa "use client")
export default function KontakGuestSectionPage() {
    // Tugasnya hanya me-render Client Component
    return <ContactPage />;
}