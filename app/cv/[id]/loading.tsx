export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center animate-pulse">
      <div className="bg-white shadow-2xl" style={{ width: '210mm', minHeight: '297mm' }}>
        {/* CV header skeleton */}
        <div className="p-8">
          <div className="h-8 bg-slate-200 rounded w-48 mb-2" />
          <div className="h-5 bg-slate-100 rounded w-64 mb-6" />
          <div className="h-px bg-slate-200 mb-6" />
          {/* Content lines */}
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-4 bg-slate-100 rounded" style={{ width: `${90 - i * 5}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
