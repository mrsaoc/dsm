'use client'; // <-- ISSO É A MÁGICA QUE RESOLVE O PROBLEMA

import { useEffect, useState } from "react";
import { disciplinas } from "@/data/disciplinas";
import { CourseCard } from "@/components/CourseCard";

export default function Home() {
    // Começamos com -1 para não carregar a página com o dia errado piscando
    const [hoje, setHoje] = useState<number>(-1);
    const [dataHoje, setDataHoje] = useState<string>("");

    useEffect(() => {
        // Quando o usuário abre o site, pega o fuso horário exato dele
        const dataAtual = new Date();
        setHoje(dataAtual.getDay());
        setDataHoje(dataAtual.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' }));
    }, []);

    // Ordenação inteligente: Aulas de hoje SOBEM para o topo
    const sortedDisciplinas = [...disciplinas].sort((a, b) => {
        if (hoje === -1) return 0; // Se a página ainda tá carregando o relógio, não reordena

        const aIsToday = a.dias.includes(hoje);
        const bIsToday = b.dias.includes(hoje);

        if (aIsToday && !bIsToday) return -1;
        if (!aIsToday && bIsToday) return 1;
        return 0;
    });

    // Mostra uma tela preta vazia por milissegundos enquanto calcula a data certa
    // Evita o que chamamos de "Hydration Error" no Next.js
    if (hoje === -1) return null;

    return (
        <main className="relative min-h-screen overflow-hidden bg-neutral-950 px-6 py-12 md:px-12 selection:bg-white/20">

            {/* LUZES DE FUNDO ESTÁTICAS */}
            <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-purple-900/20 blur-[100px]" />
            <div className="pointer-events-none absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-900/10 blur-[100px]" />

            <div className="relative mx-auto max-w-6xl z-10">

                {/* HEADER */}
                <header className="mb-12 flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
            DSM • 4º Ciclo
          </span>
                    <div className="flex items-baseline justify-between">
                        <h1 className="text-3xl font-semibold text-white md:text-4xl tracking-tight">
                            Minhas Aulas
                        </h1>
                        <span className="hidden text-sm text-neutral-600 md:block">
              {dataHoje}
            </span>
                    </div>
                </header>

                {/* GRID DE CARDS */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
                    {sortedDisciplinas.map((disciplina) => (
                        <CourseCard
                            key={disciplina.id}
                            data={disciplina}
                            isToday={disciplina.dias.includes(hoje)} // Passamos a verificação direto pro card
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}