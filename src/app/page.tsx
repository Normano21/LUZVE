const currentStatus = {
  label: "INFORMACIÓN INSUFICIENTE",
  description:
    "Aún no hay suficientes reportes recientes para confirmar el estado eléctrico de tu zona.",
  lastReport: "Sin reportes recientes",
  reports: "Necesitamos más reportes para confirmar el estado.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-6 text-slate-900 sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-md flex-col">
        <header className="flex items-center justify-between">
          <p className="text-xl font-extrabold tracking-tight text-amber-500">
            ⚡ LUZVE
          </p>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            Valencia
          </span>
        </header>

        <section className="flex flex-1 flex-col justify-center py-12" aria-labelledby="status-title">
          <button type="button" className="mb-12 flex w-fit items-center gap-2 text-left text-sm font-medium text-slate-600" aria-label="Cambiar zona">
            <span aria-hidden="true">📍</span>
            <span>Valencia, Carabobo</span>
            <span aria-hidden="true" className="text-slate-400">⌄</span>
          </button>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl" aria-hidden="true">?</div>
            <p className="mb-3 text-xs font-bold tracking-[0.16em] text-slate-500">ESTADO ACTUAL</p>
            <h1 id="status-title" className="text-2xl font-extrabold tracking-tight text-slate-800">{currentStatus.label}</h1>
            <p className="mt-4 text-base leading-7 text-slate-600">{currentStatus.description}</p>
            <div className="mt-7 border-t border-slate-100 pt-5 text-sm leading-6 text-slate-500">
              <p>{currentStatus.lastReport}</p>
              <p>{currentStatus.reports}</p>
            </div>
          </div>
        </section>

        <footer className="space-y-4 pb-3">
          <button type="button" className="w-full rounded-2xl bg-slate-800 px-5 py-4 text-base font-bold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-300">REPORTAR ESTADO</button>
          <button type="button" className="w-full py-2 text-sm font-semibold text-slate-600 underline decoration-slate-300 underline-offset-4">Ver historial</button>
        </footer>
      </div>
    </main>
  );
}
