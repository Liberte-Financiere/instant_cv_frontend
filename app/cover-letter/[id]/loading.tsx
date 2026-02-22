export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 animate-pulse">
      {/* Header skeleton */}
      <header className="bg-white border-b border-slate-200 h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-slate-200 rounded-lg" />
          <div className="h-5 bg-slate-200 rounded w-40" />
        </div>
        <div className="h-9 w-24 bg-blue-200 rounded-lg" />
      </header>

      {/* Cover letter preview */}
      <div className="max-w-3xl mx-auto p-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 min-h-[600px]">
          <div className="space-y-4">
            <div className="h-6 bg-slate-200 rounded w-72 mb-6" />
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-4 bg-slate-100 rounded" style={{ width: `${95 - i * 5}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
