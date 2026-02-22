export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 animate-pulse">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="h-8 bg-slate-200 rounded-lg w-56 mb-3" />
          <div className="h-4 bg-slate-100 rounded w-80" />
        </div>
      </div>

      {/* Template grid */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="h-64 bg-slate-100" />
              <div className="p-4">
                <div className="h-5 bg-slate-200 rounded w-32 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-48" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
