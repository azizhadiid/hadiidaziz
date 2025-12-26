import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'], // Pilih ketebalan yang Anda butuhkan
  variable: '--font-inter', // Ini akan membuat CSS variable
});

export const metadata: Metadata = {
  title: {
    default: 'Aziz Hadiid', // Judul untuk halaman utama (/)
    template: '%s | Aziz Hadiid', // Template untuk halaman lain
  },
  description: 'Aziz Hadiid - Website Portfolio Aziz Alhadiid.'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={inter.variable}
      >
        {children}
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
