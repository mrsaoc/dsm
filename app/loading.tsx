export default function Loading() {
    return (
        <main className="relative min-h-screen overflow-hidden bg-[#050505] px-6 py-12 md:px-12">
            <div className="relative mx-auto max-w-6xl z-10">
                <header className="mb-12 flex flex-col gap-6">
                    {/* Skeleton do Topo (DSM 4º Ciclo) */}
                    <div className="w-24 h-3 bg-white/[0.03] rounded-full animate-pulse" />

                    {/* Skeleton da Barra de Dias */}
                    <div className="grid grid-cols-6 gap-1.5 p-1.5 bg-white/[0.02] rounded-[1.25rem] border border-white/[0.03] max-w-md sm:max-w-lg">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-10 bg-white/[0.04] rounded-xl animate-pulse" />
                        ))}
                    </div>

                    {/* Skeleton do Título e Data */}
                    <div className="mt-2 space-y-3">
                        <div className="w-48 h-8 bg-white/[0.05] rounded-lg animate-pulse" />
                        <div className="w-32 h-4 bg-white/[0.02] rounded-md animate-pulse" />
                    </div>
                </header>

                {/* Skeleton do Grid de Cartões */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-[220px] rounded-[2rem] bg-white/[0.02] border border-white/[0.03] animate-pulse p-6 flex flex-col">
                            {/* Ícone da matéria */}
                            <div className="w-10 h-10 rounded-[14px] bg-white/[0.05] mb-5" />

                            {/* Nome e Professor */}
                            <div className="w-3/4 h-5 bg-white/[0.06] rounded-md mb-2" />
                            <div className="w-1/2 h-3 bg-white/[0.03] rounded-md flex-grow" />

                            {/* Pílulas de horário/sala */}
                            <div className="grid grid-cols-2 gap-2 mt-auto">
                                <div className="h-10 rounded-2xl bg-white/[0.04]" />
                                <div className="h-10 rounded-2xl bg-white/[0.04]" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}