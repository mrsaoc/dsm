import { useEffect, useState } from 'react';
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
    const [status, setStatus] = useState<'other' | 'today' | 'live'>('other');

    useEffect(() => {
        if (!isToday) {
            setStatus('other');
            return;
        }

        const checkStatus = () => {
            const agora = new Date();
            const horaAtual = agora.getHours();
            const minAtual = agora.getMinutes();
            const tempoAtual = horaAtual * 60 + minAtual;

            // Parsing da string "15:00 - 18:30"
            const [inicioStr, fimStr] = data.horarios.split(' - ');

            const [hInicio, mInicio] = inicioStr.split(':').map(Number);
            const [hFim, mFim] = fimStr.split(':').map(Number);

            const tempoInicio = hInicio * 60 + mInicio;
            const tempoFim = hFim * 60 + mFim;

            if (tempoAtual >= tempoInicio && tempoAtual <= tempoFim) {
                setStatus('live');
            } else {
                setStatus('today');
            }
        };

        checkStatus();
        // Atualiza a cada minuto para o card "virar" LIVE sozinho
        const interval = setInterval(checkStatus, 60000);
        return () => clearInterval(interval);
    }, [isToday, data.horarios]);

    return (
        <button
            onClick={onClick}
            className={`
                group relative flex text-left h-full flex-col w-full overflow-hidden rounded-[2rem] p-6 
                transition-all duration-500 cursor-pointer active:scale-[0.98]
                ${status === 'live'
                ? 'scale-[1.03] ring-2 ring-white/20 z-20 shadow-[0_0_30px_rgba(255,255,255,0.05)]'
                : 'hover:scale-[1.02]'
            }
            `}
            style={{
                boxShadow: status === 'live' ? `0 0 25px -5px ${data.cor}33` : undefined,
                borderColor: status === 'live' ? `${data.cor}55` : undefined
            }}
        >
            {/* 1. CAMADA DE FUNDO (GLASS) */}
            <div className={`
                absolute inset-0 transition-colors duration-500 
                ${status === 'live' ? 'bg-white/10' : 'bg-white/5 group-hover:bg-white/10'} 
                backdrop-blur-xl
            `} />

            {/* 2. BORDA DINÂMICA */}
            <div className={`
                absolute inset-0 rounded-[2rem] ring-1 ring-inset transition-all duration-500
                ${status === 'live' ? 'ring-white/30' : 'ring-white/10 group-hover:ring-white/20'}
            `} />

            {/* 3. LUZ AMBIENTE (Mais intensa se for LIVE) */}
            <div
                className={`
                    absolute -right-12 -top-12 h-40 w-40 rounded-full blur-[60px] transition-opacity duration-700
                    ${status === 'live' ? 'opacity-50 animate-pulse' : 'opacity-20 group-hover:opacity-40'}
                `}
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

                    {/* INDICADORES DE TEMPO */}
                    <div className="flex flex-col items-end gap-1">
                        {status === 'live' && (
                            <div className="flex items-center gap-2 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
                                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Agora</span>
                                <div className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </div>
                            </div>
                        )}
                        {status === 'today' && (
                            <div className="flex items-center gap-1.5 opacity-60">
                                <span className="text-[10px] font-medium text-white uppercase tracking-wider">Hoje</span>
                                <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-1 mb-6 flex-grow">
                    <h2 className={`
                        text-lg font-semibold leading-tight tracking-wide transition-colors
                        ${status === 'live' ? 'text-white' : 'text-neutral-100 group-hover:text-white'}
                    `}>
                        {data.nome}
                    </h2>
                    <p className="text-sm font-light text-neutral-400 group-hover:text-neutral-300 transition-colors">
                        {data.professor}
                    </p>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-2">
                    <div className={`
                        flex min-h-[44px] items-center gap-2 rounded-xl px-3 py-2 text-xs leading-tight border transition-colors
                        ${status === 'live' ? 'bg-white/10 border-white/20 text-white' : 'bg-black/20 border-white/5 text-neutral-300 group-hover:border-white/10'}
                    `}>
                        <IconClock />
                        <span>{data.horarios}</span>
                    </div>

                    <div className={`
                        flex min-h-[44px] items-center gap-2 rounded-xl px-3 py-2 text-xs leading-tight border transition-colors
                        ${status === 'live' ? 'bg-white/10 border-white/20 text-white' : 'bg-black/20 border-white/5 text-neutral-300 group-hover:border-white/10'}
                    `}>
                        <IconMap />
                        <span className="truncate">{data.sala}</span>
                    </div>
                </div>
            </div>
        </button>
    );
}