// app/layout.tsx
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/NavBar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main>{children}
        <Toaster />
        </main>
        
      </body>
    </html>
  );
}