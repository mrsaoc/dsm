import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner"; // Importamos o Toaster

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "DSM • Painel de Aulas",
    description: "Gerenciamento de materiais e horários",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-950`}>
        {children}
        {/* O Toaster fica aqui embaixo para não atrapalhar o layout */}
        <Toaster theme="dark" position="top-center" richColors />
        </body>
        </html>
    );
}