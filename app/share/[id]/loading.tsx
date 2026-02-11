export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center animate-pulse">
      <div className="bg-white shadow-2xl rounded-xl max-w-3xl w-full mx-4 p-8">
        {/* Share header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-slate-200 rounded-full" />
          <div>
            <div className="h-6 bg-slate-200 rounded w-48 mb-2" />
            <div className="h-4 bg-slate-100 rounded w-32" />
          </div>
        </div>
        <div className="h-px bg-slate-200 mb-6" />
        {/* Content skeleton */}
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 bg-slate-100 rounded" style={{ width: `${95 - i * 10}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
