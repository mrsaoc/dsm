'use client';

import { useEffect, useState } from "react";
import { disciplinas, Disciplina } from "@/data/disciplinas";
import { CourseCard } from "@/components/CourseCard";
import { DriveDrawer } from "@/components/DriveDrawer";

const DIAS_SEMANA = [
    { id: 99, label: 'Todos' },
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
        if (selectedCourse) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [selectedCourse]);

    // Função para trocar de dia com um efeito de transição rápido
    const handleDiaChange = (id: number) => {
        if (id === diaSelecionado) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setDiaSelecionado(id);
            setIsTransitioning(false);
        }, 150);
    };

    const disciplinasDoDia = diaSelecionado === 99
        ? disciplinas
        : disciplinas.filter(disciplina => disciplina.dias.includes(diaSelecionado));

    if (hoje === -1) return null;

    return (
        <main className="relative min-h-screen overflow-hidden bg-neutral-950 px-6 py-12 md:px-12 selection:bg-white/20">

            <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-purple-900/20 blur-[100px]" />
            <div className="pointer-events-none absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-900/10 blur-[100px]" />

            <div className="relative mx-auto max-w-6xl z-10">

                <header className="mb-10 flex flex-col gap-1">
                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500 mb-2">
                        DSM • 4º Ciclo
                    </span>

                    {/* BARRA DE NAVEGAÇÃO COM FEEDBACK DE CURSOR */}
                    <nav className="flex items-center gap-1 mb-6 bg-white/5 p-1.5 rounded-2xl w-max max-w-full overflow-x-auto border border-white/5 backdrop-blur-md" style={{ scrollbarWidth: 'none' }}>
                        {DIAS_SEMANA.map((dia) => {
                            const isActive = diaSelecionado === dia.id;
                            const isRealToday = hoje === dia.id && dia.id !== 99;

                            return (
                                <button
                                    key={dia.id}
                                    onClick={() => handleDiaChange(dia.id)}
                                    className={`
                                        relative px-4 sm:px-6 py-2.5 rounded-xl text-sm font-medium 
                                        transition-all duration-300 flex-shrink-0 
                                        cursor-pointer outline-none
                                        ${isActive
                                        ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/10'
                                        : 'text-neutral-500 hover:text-neutral-200 hover:bg-white/5 active:scale-95'
                                    }
                                    `}
                                >
                                    {dia.label}

                                    {isRealToday && (
                                        <span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-colors ${
                                            isActive ? 'bg-white' : 'bg-neutral-600'
                                        }`} />
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="flex items-baseline justify-between">
                        <h1 className="text-3xl font-semibold text-white md:text-4xl tracking-tight">
                            Minhas Aulas
                        </h1>
                        <span className="hidden text-sm text-neutral-600 md:block">
                            {dataHoje}
                        </span>
                    </div>
                </header>

                {/* GRID COM ANIMAÇÃO DE FADE */}
                <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                    {disciplinasDoDia.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-neutral-500 border border-white/5 rounded-3xl bg-white/5 border-dashed">
                            <p>Nenhuma aula programada para este dia.</p>
                            <p className="text-sm mt-1 opacity-60">Aproveite para descansar! 🚀</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
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