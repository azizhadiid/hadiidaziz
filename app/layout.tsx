import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Aziz Hadiid',
    template: '%s | Aziz Hadiid',
  },
  description: 'Aziz Hadiid - Website Portfolio Aziz Alhadiid.',
  icons: {
    // Menambahkan favicon
    icon: '/img/logo.svg',
    shortcut: '/img/logo.svg',
    apple: '/img/logo.svg', // Opsional: ikon untuk iPhone/iPad
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        {children}
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
} 