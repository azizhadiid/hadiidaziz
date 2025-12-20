import LandingPageGuest from '@/components/pages/guest/LandingPage';
import type { Metadata } from 'next';

// 'metadata' sekarang berada di Server Component, ini sudah benar.
export const metadata: Metadata = {
  title: 'Welcome', // Ini akan mengisi placeholder %s
};

// Ini adalah Server Component (tanpa "use client")
export default function Home() {
  // Tugasnya hanya me-render Client Component
  return <LandingPageGuest />;
}