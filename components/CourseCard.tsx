import React from 'react';
import { Disciplina } from "@/data/disciplinas";

const IconClock = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 opacity-70 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
);
const IconMap = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 opacity-70 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
);

interface Props {
    data: Disciplina;
    isToday: boolean;
    onClick: () => void;
}

export function CourseCard({ data, isToday, onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="group relative flex text-left h-full flex-col w-full overflow-hidden rounded-[2rem] p-6 transition-all duration-500 hover:scale-[1.02] cursor-pointer active:scale-[0.98]"
        >
            {/* 1. CAMADA DE FUNDO (GLASS) */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-xl transition-colors duration-500 group-hover:bg-white/10" />

            {/* 2. BORDA FINA - Reage ao hover ficando mais clara */}
            <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10 group-hover:ring-white/20 transition-all duration-500" />

            {/* 3. LUZ AMBIENTE */}
            <div
                className="absolute -right-12 -top-12 h-40 w-40 rounded-full blur-[60px] opacity-20 transition-opacity duration-700 group-hover:opacity-40"
                style={{ backgroundColor: data.cor }}
            />

            {/* 4. CONTEÚDO */}
            <div className="relative z-10 flex flex-col h-full w-full">
                <div className="flex items-start justify-between mb-4">
                    <div
                        className="flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-bold text-white shadow-lg shadow-black/20 transition-transform duration-500 group-hover:rotate-3 group-hover:scale-110"
                        style={{ backgroundColor: data.cor }}
                    >
                        {data.id}
                    </div>

                    {isToday && (
                        <div className="relative flex h-3 w-3 mt-1 mr-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-[0_0_10px_rgba(74,222,128,0.5)]"></span>
                        </div>
                    )}
                </div>

                <div className="space-y-1 mb-6 flex-grow">
                    <h2 className="text-lg font-semibold leading-tight text-white tracking-wide group-hover:text-white transition-colors">
                        {data.nome}
                    </h2>
                    <p className="text-sm font-light text-neutral-400 group-hover:text-neutral-300 transition-colors">
                        {data.professor}
                    </p>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-2">
                    <div className="flex min-h-[44px] items-center gap-2 rounded-xl bg-black/20 px-3 py-2 text-xs text-neutral-300 leading-tight border border-white/5 group-hover:border-white/10 transition-colors">
                        <IconClock />
                        <span>{data.horarios}</span>
                    </div>

                    <div className="flex min-h-[44px] items-center gap-2 rounded-xl bg-black/20 px-3 py-2 text-xs text-neutral-300 leading-tight border border-white/5 group-hover:border-white/10 transition-colors">
                        <IconMap />
                        <span className="truncate">{data.sala}</span>
                    </div>
                </div>
            </div>
        </button>
    );
}