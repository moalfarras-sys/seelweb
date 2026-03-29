import Link from "next/link";

export default function NotFound() {
  return (
    <section className="gradient-navy flex min-h-[70vh] items-center py-20">
      <div className="mx-auto max-w-3xl px-4 text-center md:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-300">404</p>
        <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">Diese Seite wurde nicht gefunden</h1>
        <p className="mt-5 text-lg leading-8 text-silver-300">
          Die gesuchte Seite ist nicht verfügbar oder wurde verschoben. Nutzen Sie die Startseite oder starten Sie direkt Ihre Anfrage.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/" className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-navy-900 transition hover:bg-slate-100">
            Zur Startseite
          </Link>
          <Link href="/buchen" className="inline-flex items-center justify-center rounded-2xl bg-teal-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-600">
            Jetzt buchen
          </Link>
        </div>
      </div>
    </section>
  );
}
