"use client";

import { AlertTriangle } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="max-w-md w-full text-center space-y-6 p-8">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-500/15 flex items-center justify-center">
          <AlertTriangle className="text-red-500" size={32} />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-navy-800 dark:text-white">
            Etwas ist schiefgelaufen
          </h2>
          <p className="text-silver-600 dark:text-silver-300 text-sm leading-relaxed">
            Beim Laden dieser Seite ist ein Fehler aufgetreten. Bitte versuchen
            Sie es erneut oder kontaktieren Sie den Support, falls das Problem
            weiterhin besteht.
          </p>
        </div>

        {error.digest && (
          <p className="text-xs text-silver-400 font-mono">
            Fehler-ID: {error.digest}
          </p>
        )}

        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-8 py-3 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-colors shadow-lg shadow-teal-500/25"
        >
          Erneut versuchen
        </button>
      </div>
    </div>
  );
}
