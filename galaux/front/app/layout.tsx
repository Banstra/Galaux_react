import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from '@/components/ui/navbar/navbar';
import { cn } from "@/lib/utils";
import { Footer } from '@/components/ui/footer/footer';


export const metadata: Metadata = {
  title: "Galaux",
  description: "Minecraft app",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="min-h-screen w-screen m-0 rounded-none flex flex-col overflow-x-hidden overflow-y-auto">
        <header className="sticky top-0 z-50">
          <Navbar></Navbar>
        </header>
        <main className="relative overflow-hidden">{children}</main>
        <footer>
          <Footer></Footer>
        </footer>
      </body>
    </html>
  );
}
