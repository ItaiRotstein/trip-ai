import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import { SavedPlacesProvider } from '@/context/SavedPlacesContext';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from "sonner";
const rubik = Rubik({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trip -AI",
  description: "Travel assistant that helps you plan your next trip",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${rubik.className} antialiased`}>
        <AuthProvider>
          <SavedPlacesProvider>
            <Header />

            {children}
          </SavedPlacesProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
