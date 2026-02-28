'use client';

import { useEffect, useState } from "react";
import { disciplinas, Disciplina } from "@/data/disciplinas";
import { CourseCard } from "@/components/CourseCard";
import { DriveDrawer } from "@/components/DriveDrawer";
import { Coffee } from "lucide-react"; // Adicionamos um ícone para o estado vazio

const DIAS_SEMANA = [
    { id: 99, label: 'Tds' },
    { id: 1, label: 'Seg' },
    { id: 2, label: 'Ter' },
    { id: 3, label: 'Qua' },
    { id: 4, label: 'Qui' },
    { id: 5, label: 'Sex' },
];

export default function Home() {
    const [hoje, setHoje] = useState<number>(-1);
    const [dataHoje, setDataHoje] = useState<string>("");
    const [diaSelecionado, setDiaSelecionado] = useState<number>(-1);
    const [selectedCourse, setSelectedCourse] = useState<Disciplina | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const dataAtual = new Date();
        const diaAtual = dataAtual.getDay();
        setHoje(diaAtual);
        setDiaSelecionado(diaAtual >= 1 && diaAtual <= 5 ? diaAtual : 99);
        setDataHoje(dataAtual.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' }));
    }, []);

    useEffect(() => {
        document.body.style.overflow = selectedCourse ? 'hidden' : 'auto';
    }, [selectedCourse]);

    const handleDiaChange = (id: number) => {
        if (id === diaSelecionado) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setDiaSelecionado(id);
            setIsTransitioning(false);
        }, 300);
    };

    const disciplinasDoDia = diaSelecionado === 99
        ? disciplinas
        : disciplinas.filter(disciplina => disciplina.dias.includes(diaSelecionado));

    if (hoje === -1) return null;

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#050505] px-6 py-12 md:px-12 selection:bg-white/20">
            {/* LUZES AMBIENTES ESTILO APPLE (Mantidas do passo 1) */}
            <div className="pointer-events-none absolute inset-0 flex justify-center">
                <div className="absolute -top-[20%] w-[1000px] h-[600px] rounded-full bg-white/[0.03] blur-[120px]" />
                <div className="absolute top-[40%] -left-[10%] w-[500px] h-[500px] rounded-full bg-white/[0.015] blur-[100px]" />
            </div>

            <div className="relative mx-auto max-w-6xl z-10">
                <header className="mb-12 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-500">
                            DSM • 4º Ciclo
                        </span>
                    </div>

                    {/* NAVEGAÇÃO: Interações baseadas em Opacidade (Sem escalas robóticas) */}
                    <nav className="grid grid-cols-6 gap-1.5 bg-white/[0.03] p-1.5 rounded-[1.25rem] border border-white/[0.05] backdrop-blur-2xl max-w-md sm:max-w-lg shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                        {DIAS_SEMANA.map((dia) => {
                            const isActive = diaSelecionado === dia.id;
                            const isRealToday = hoje === dia.id && dia.id !== 99;

                            return (
                                <button
                                    key={dia.id}
                                    onClick={() => handleDiaChange(dia.id)}
                                    className={`
                                        relative py-2.5 rounded-xl text-[11px] sm:text-sm font-medium 
                                        transition-colors duration-500 ease-out cursor-pointer outline-none text-center
                                        active:opacity-50 active:duration-0 /* O segredo do toque Apple: resposta instantânea no clique, retorno suave */
                                        ${isActive
                                        ? 'bg-white/[0.12] text-white shadow-[0_2px_10px_rgba(0,0,0,0.2)] border border-white/[0.08]'
                                        : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.04] border border-transparent'
                                    }
                                    `}
                                >
                                    {dia.label}
                                    {isRealToday && (
                                        <span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-colors duration-500 ${isActive ? 'bg-white' : 'bg-neutral-700'}`} />
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="flex items-baseline justify-between mt-2">
                        <div className="flex flex-col gap-1.5">
                            <h1 className="text-3xl font-medium text-neutral-100 md:text-4xl tracking-tight">
                                Minhas Aulas
                            </h1>
                            <p className="text-sm text-neutral-500 font-light tracking-wide">{dataHoje}</p>
                        </div>
                    </div>
                </header>

                <div className={`transition-all duration-500 ease-out ${isTransitioning ? 'opacity-0 translate-y-4 scale-[0.99]' : 'opacity-100 translate-y-0 scale-100'}`}>
                    {disciplinasDoDia.length === 0 ? (
                        /* EMPTY STATE PREMIUM (Substitui aquela caixa de erro tracejada) */
                        <div className="flex flex-col items-center justify-center py-24 text-neutral-600 animate-in fade-in duration-1000">
                            <div className="w-16 h-16 mb-5 rounded-[1.25rem] bg-white/[0.02] border border-white/[0.05] flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]">
                                <Coffee className="w-6 h-6 opacity-40 text-neutral-400" strokeWidth={1.5} />
                            </div>
                            <p className="text-sm font-medium tracking-wide text-neutral-300">Dia livre</p>
                            <p className="text-[13px] font-light tracking-wide text-neutral-500 mt-1">Nenhuma aula programada para hoje.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
                            {disciplinasDoDia.map((disciplina) => (
                                <CourseCard
                                    key={disciplina.id}
                                    data={disciplina}
                                    isToday={disciplina.dias.includes(hoje)}
                                    onClick={() => setSelectedCourse(disciplina)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <DriveDrawer
                disciplina={selectedCourse}
                onClose={() => setSelectedCourse(null)}
            />
        </main>
    );
}