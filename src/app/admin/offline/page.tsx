export default function AdminOfflinePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-navy-950 text-white p-6">
      <div className="max-w-md w-full rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <h1 className="text-2xl font-bold mb-3">No connection</h1>
        <p className="text-slate-300">
          Die Admin-App ist aktuell offline. Bitte Internetverbindung prüfen und erneut laden.
        </p>
      </div>
    </main>
  );
}

