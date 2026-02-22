export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 animate-pulse">
      {/* Header skeleton */}
      <header className="bg-white border-b border-slate-200 h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-slate-200 rounded-lg" />
          <div className="h-5 bg-slate-200 rounded w-40" />
        </div>
        <div className="flex gap-3">
          <div className="h-9 w-24 bg-slate-200 rounded-lg" />
          <div className="h-9 w-28 bg-blue-200 rounded-lg" />
        </div>
      </header>

      {/* Content skeleton */}
      <div className="max-w-4xl mx-auto p-8">
        {/* Title */}
        <div className="h-8 bg-slate-200 rounded-lg w-64 mb-2" />
        <div className="h-4 bg-slate-100 rounded w-96 mb-8" />

        {/* Editor area */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 min-h-[500px]">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-4 bg-slate-100 rounded" style={{ width: `${85 - i * 8}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
