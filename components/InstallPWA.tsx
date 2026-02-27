'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

export function InstallPWA() {
    const [supportsPWA, setSupportsPWA] = useState(false);
    const [promptInstall, setPromptInstall] = useState<any>(null);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setSupportsPWA(true);
            setPromptInstall(e);
        };

        window.addEventListener("beforeinstallprompt", handler);

        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const onClick = (e: any) => {
        e.preventDefault();
        if (!promptInstall) return;
        promptInstall.prompt();
    };

    if (!supportsPWA) return null;

    return (
        <div className="fixed bottom-24 left-6 right-6 z-[60] md:left-auto md:right-12 md:bottom-12 md:w-80 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="bg-neutral-900/90 border border-white/10 backdrop-blur-xl p-4 rounded-3xl shadow-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-2 rounded-xl">
                        <Download className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <p className="text-white text-sm font-medium">Instalar Painel</p>
                        <p className="text-neutral-500 text-[10px]">Acesse como um aplicativo</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onClick}
                        className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded-xl transition-all active:scale-95 font-medium cursor-pointer"
                    >
                        Instalar
                    </button>
                    <button onClick={() => setSupportsPWA(false)} className="text-neutral-500 p-1">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}