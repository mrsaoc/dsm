import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
    title: "DSM • Painel de Aulas",
    description: "Gerenciamento de materiais e horários do 4º Ciclo",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "DSM Painel",
    },
};

export const viewport: Viewport = {
    themeColor: "#0a0a0a",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR">
        <head>
            <link rel="icon" href="/favicon.ico" />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-950`}>
        {children}
        <Toaster theme="dark" position="top-center" richColors />
        </body>
        </html>
    );
}