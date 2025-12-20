import AdminLoginPage from '@/components/pages/guest/LoginPage';
import type { Metadata } from 'next';

// 'metadata' sekarang berada di Server Component, ini sudah benar.
export const metadata: Metadata = {
    title: 'Login Admin', // Ini akan mengisi placeholder %s
};

// Ini adalah Server Component (tanpa "use client")
export default function LoginAdminPage() {
    // Tugasnya hanya me-render Client Component
    return <AdminLoginPage />;
}