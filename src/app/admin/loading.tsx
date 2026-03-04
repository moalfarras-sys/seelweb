export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Header placeholder */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 rounded-lg bg-navy-200 dark:bg-navy-700" />
          <div className="h-4 w-64 rounded bg-gray-200 dark:bg-navy-800" />
        </div>
        <div className="h-10 w-36 rounded-xl bg-gray-200 dark:bg-navy-800" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-200 dark:border-navy-700/50 bg-white dark:bg-navy-900/60 p-6 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-gray-200 dark:bg-navy-700" />
              <div className="h-4 w-16 rounded bg-gray-100 dark:bg-navy-800" />
            </div>
            <div className="h-8 w-24 rounded-lg bg-navy-100 dark:bg-navy-700" />
            <div className="h-3 w-32 rounded bg-gray-100 dark:bg-navy-800" />
          </div>
        ))}
      </div>

      {/* Table placeholder */}
      <div className="rounded-2xl border border-gray-200 dark:border-navy-700/50 bg-white dark:bg-navy-900/60 overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-gray-100 dark:border-navy-700/30">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 rounded bg-gray-200 dark:bg-navy-700" />
          ))}
        </div>
        {/* Table rows */}
{Array.from({ length: 6 }).map((_, row) => (
          <div
            key={row}
            className="grid grid-cols-5 gap-4 px-6 py-5 border-b border-gray-50 dark:border-navy-800/50 last:border-0"
          >
            {Array.from({ length: 5 }).map((_, col) => (
              <div
                key={col}
                className="h-4 rounded bg-gray-100 dark:bg-navy-800" style={{ width: `${60 + Math.random() * 30}%` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
