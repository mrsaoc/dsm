import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

// Configurando a fonte Poppins
const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600"], // Pesos: Leve, Normal, Médio, Semi-Bold
    variable: "--font-poppins",
});

export const metadata: Metadata = {
    title: "FATEC DSM | Dashboard",
    description: "Painel de controle acadêmico",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-br">
        <body className={`${poppins.className} bg-neutral-950 text-neutral-200 antialiased selection:bg-white/20`}>
        {children}
        </body>
        </html>
    );
}