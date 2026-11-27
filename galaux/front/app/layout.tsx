import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/ui/navbar/navbar';
import { Footer } from '@/components/ui/footer/footer';

export const metadata: Metadata = {
  title: 'Galaux',
  description: 'Minecraft app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen w-screen m-0 rounded-none flex flex-col overflow-x-hidden overflow-y-auto">
        <Navbar />
        <main className="relative overflow-hidden flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
