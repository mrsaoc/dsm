import React from 'react';
import { Disciplina } from "@/data/disciplinas";

const IconClock = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 opacity-70 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
);
const IconMap = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 opacity-70 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
);

// ADICIONAMOS O isToday AQUI
interface Props {
    data: Disciplina;
    isToday: boolean;
}

export function CourseCard({ data, isToday }: Props) {
    return (
        <a
            href={data.linkDrive}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] p-6 transition-all duration-500 hover:scale-[1.02]"
        >
            {/* 1. CAMADA DE FUNDO (GLASS) */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-xl transition-colors duration-500 group-hover:bg-white/10" />

            {/* 2. BORDA FINA */}
            <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />

            {/* 3. LUZ AMBIENTE */}
            <div
                className="absolute -right-12 -top-12 h-40 w-40 rounded-full blur-[60px] opacity-20 transition-opacity duration-700 group-hover:opacity-30"
                style={{ backgroundColor: data.cor }}
            />

            {/* 4. CONTEÚDO */}
            <div className="relative z-10 flex flex-col h-full">

                <div className="flex items-start justify-between mb-4">
                    <div
                        className="flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-bold text-white shadow-lg shadow-black/20"
                        style={{ backgroundColor: data.cor }}
                    >
                        {data.id}
                    </div>

                    {/* DOT VERDE SUTIL */}
                    {isToday && (
                        <div className="relative flex h-3 w-3 mt-1 mr-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-[0_0_10px_rgba(74,222,128,0.5)]"></span>
                        </div>
                    )}
                </div>

                <div className="space-y-1 mb-6 flex-grow">
                    <h2 className="text-lg font-semibold leading-tight text-white tracking-wide">
                        {data.nome}
                    </h2>
                    <p className="text-sm font-light text-neutral-400">
                        {data.professor}
                    </p>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-2">
                    <div className="flex min-h-[44px] items-center gap-2 rounded-xl bg-black/20 px-3 py-2 text-xs text-neutral-300 leading-tight border border-white/5">
                        <IconClock />
                        <span>{data.horarios}</span>
                    </div>

                    <div className="flex min-h-[44px] items-center gap-2 rounded-xl bg-black/20 px-3 py-2 text-xs text-neutral-300 leading-tight border border-white/5">
                        <IconMap />
                        <span>{data.sala}</span>
                    </div>
                </div>
            </div>
        </a>
    );
}