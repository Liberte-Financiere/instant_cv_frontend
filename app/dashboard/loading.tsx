export default function Loading() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-8 bg-slate-200 rounded-lg w-48 mb-2" />
          <div className="h-4 bg-slate-100 rounded w-64" />
        </div>
        <div className="h-10 bg-slate-200 rounded-xl w-32" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-slate-100 rounded-2xl border border-slate-200" />
        ))}
      </div>

      {/* CV Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-[320px] bg-slate-100 rounded-2xl border border-slate-200" />
        ))}
      </div>
    </div>
  );
}
