import { useEffect, useState } from 'react';
import { Disciplina } from "@/data/disciplinas";

const IconClock = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 opacity-60 flex-shrink-0 mt-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
);
const IconMap = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 opacity-60 flex-shrink-0 mt-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
);

interface Props {
    data: Disciplina;
    isToday: boolean;
    onClick: () => void;
}

export function CourseCard({ data, isToday, onClick }: Props) {
    const [status, setStatus] = useState<'other' | 'today' | 'live' | 'finished'>('other');
    const [progress, setProgress] = useState(0);
    const [timeContext, setTimeContext] = useState<string>('');

    // UX: Separação inteligente de múltiplas salas e horários
    const salas = data.sala.split('-').map(s => s.trim());
    const horarios = data.horarios.split(/,| e /).map(h => h.trim());

    useEffect(() => {
        if (!isToday) {
            setStatus('other');
            return;
        }

        const checkStatus = () => {
            const agora = new Date();
            const tempoAtual = agora.getHours() * 60 + agora.getMinutes();
            const horarioPrincipal = horarios[0];
            const [inicioStr, fimStr] = horarioPrincipal.split('-');

            try {
                const [hInicio, mInicio] = inicioStr.trim().split(':').map(Number);
                const [hFim, mFim] = fimStr.trim().split(':').map(Number);
                const tempoInicio = hInicio * 60 + mInicio;
                const tempoFim = hFim * 60 + mFim;

                if (tempoAtual > tempoFim) {
                    setStatus('finished');
                    setProgress(100);
                    setTimeContext('Finalizada');
                } else if (tempoAtual >= tempoInicio && tempoAtual <= tempoFim) {
                    setStatus('live');

                    const tempoTotal = tempoFim - tempoInicio;
                    const decorrido = tempoAtual - tempoInicio;
                    const percentagem = Math.min(Math.max((decorrido / tempoTotal) * 100, 0), 100);
                    setProgress(percentagem);

                    const restantes = tempoFim - tempoAtual;
                    const hRest = Math.floor(restantes / 60);
                    const mRest = restantes % 60;
                    setTimeContext(hRest > 0 ? `Termina em ${hRest}h ${mRest}m` : `Termina em ${mRest} min`);
                } else {
                    setStatus('today');

                    const paraComecar = tempoInicio - tempoAtual;
                    if (paraComecar > 0 && paraComecar <= 120) {
                        const hRest = Math.floor(paraComecar / 60);
                        const mRest = paraComecar % 60;
                        setTimeContext(hRest > 0 ? `Começa em ${hRest}h ${mRest}m` : `Começa em ${mRest} min`);
                    } else {
                        setTimeContext('');
                    }
                }
            } catch (e) {
                setStatus('today');
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 60000);

        // CORREÇÃO AQUI: Apenas isToday e data.horarios
        return () => clearInterval(interval);
    }, [isToday, data.horarios]);

    return (
        <button
            onClick={onClick}
            className={`
                group relative flex text-left h-full flex-col w-full overflow-hidden rounded-[2rem] p-6 
                transition-all duration-700 ease-out cursor-pointer active:scale-[0.96] active:duration-75
                ${status === 'live' ? 'scale-[1.02] shadow-2xl z-20' : 'hover:-translate-y-1 shadow-xl'}
                ${status === 'finished' ? 'opacity-50 hover:opacity-100 grayscale-[20%]' : 'opacity-100'}
            `}
        >
            {/* 1. CAMADA DE FUNDO */}
            <div className={`
                absolute inset-0 transition-all duration-700 ease-out backdrop-blur-2xl
                ${status === 'live' ? 'bg-white/[0.06]' : 'bg-white/[0.02] group-hover:bg-white/[0.04]'} 
            `} />

            {/* 2. BORDAS E REFLEXOS INTERNOS */}
            <div className={`
                absolute inset-0 rounded-[2rem] border transition-colors duration-700 ease-out
                ${status === 'live' ? 'border-white/[0.15]' : 'border-white/[0.04] group-hover:border-white/[0.08]'}
            `} style={{ boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.08)' }}/>

            {/* 3. LUZ AMBIENTE DA MATÉRIA */}
            <div
                className={`
                    absolute -right-8 -top-8 h-32 w-32 rounded-full blur-[50px] transition-opacity duration-1000 mix-blend-screen
                    ${status === 'live' ? 'opacity-[0.15]' : 'opacity-0 group-hover:opacity-[0.08]'}
                `}
                style={{ backgroundColor: data.cor }}
            />

            {/* 4. CONTEÚDO */}
            <div className="relative z-10 flex flex-col h-full w-full">
                <div className="flex items-start justify-between mb-5">
                    {/* ÍCONE DA MATÉRIA: Cor sólida, sem bordas */}
                    <div
                        className="flex h-10 w-10 items-center justify-center rounded-[14px] text-xs font-semibold text-white/90 shadow-sm transition-transform duration-700 ease-out group-hover:scale-105"
                        style={{
                            backgroundColor: data.cor
                        }}
                    >
                        {data.id}
                    </div>

                    {/* INDICADORES */}
                    <div className="flex flex-col items-end gap-1">
                        {status === 'live' && (
                            <div className="flex items-center gap-2 bg-white/[0.08] px-2.5 py-1 rounded-full border border-white/[0.05] shadow-sm">
                                <span className="text-[9px] font-bold text-white uppercase tracking-widest">Agora</span>
                                <div className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                                </div>
                            </div>
                        )}
                        {status === 'today' && (
                            <div className="flex items-center gap-1.5 opacity-40">
                                <span className="text-[9px] font-medium text-white uppercase tracking-widest">Hoje</span>
                                <div className="h-1 w-1 rounded-full bg-white" />
                            </div>
                        )}
                        {status === 'finished' && (
                            <div className="flex items-center gap-1.5 opacity-40">
                                <span className="text-[9px] font-medium text-white uppercase tracking-widest">Fim</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-1 mb-8 flex-grow">
                    <h2 className={`
                        text-lg font-medium leading-tight tracking-tight transition-colors duration-500
                        ${status === 'live' ? 'text-white' : 'text-neutral-200 group-hover:text-white'}
                    `}>
                        {data.nome}
                    </h2>
                    <p className="text-[13px] font-light text-neutral-500 group-hover:text-neutral-400 transition-colors duration-500">
                        {data.professor}
                    </p>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-2">
                    {/* PÍLULA DE HORÁRIO COM EMPILHAMENTO / QUEBRA SUAVE */}
                    <div className={`
                        flex min-h-[40px] flex-col justify-center rounded-2xl px-3 py-2 border transition-colors duration-500 overflow-hidden min-w-0
                        ${status === 'live' ? 'bg-white/[0.06] border-white/[0.08] text-neutral-200' : 'bg-black/20 border-white/[0.02] text-neutral-400 group-hover:border-white/[0.05]'}
                    `}>
                        <div className="flex items-start gap-2">
                            <IconClock />
                            <div className="flex flex-col min-w-0 flex-1 justify-center">
                                {horarios.map((horario, index) => (
                                    <span
                                        key={index}
                                        className={`tabular-nums break-words ${horarios.length > 1 ? 'text-[10px] sm:text-[11px] leading-[14px]' : 'text-[11px] sm:text-xs font-light leading-tight'}`}
                                    >
                                        {horario}
                                    </span>
                                ))}
                            </div>
                        </div>
                        {timeContext && (
                            <span className={`text-[9px] sm:text-[10px] mt-1 ml-[22px] font-medium tabular-nums ${status === 'live' ? 'text-white/80' : 'text-white/40'}`}>
                                {timeContext}
                            </span>
                        )}
                    </div>

                    {/* PÍLULA DE SALA COM EMPILHAMENTO INTELIGENTE */}
                    <div className={`
                        flex min-h-[40px] flex-col justify-center rounded-2xl px-3 py-2 border transition-colors duration-500 overflow-hidden min-w-0
                        ${status === 'live' ? 'bg-white/[0.06] border-white/[0.08] text-neutral-200' : 'bg-black/20 border-white/[0.02] text-neutral-400 group-hover:border-white/[0.05]'}
                    `}>
                        <div className="flex items-start gap-2">
                            <IconMap />
                            <div className="flex flex-col min-w-0 flex-1 justify-center">
                                {salas.map((sala, index) => (
                                    <span
                                        key={index}
                                        className={`break-words ${salas.length > 1 ? 'text-[10px] sm:text-[11px] leading-[14px]' : 'text-[11px] sm:text-xs font-light leading-tight'}`}
                                    >
                                        {sala}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. BARRA DE PROGRESSO EM TEMPO REAL */}
            {status === 'live' && (
                <div className="absolute bottom-0 left-0 h-[3px] w-full bg-white/10 overflow-hidden">
                    <div
                        className="h-full bg-white/50 shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-[60000ms] ease-linear"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
        </button>
    );
}