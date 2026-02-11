export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col animate-pulse">
      {/* Header skeleton */}
      <header className="bg-white border-b border-slate-200 h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-slate-200 rounded-lg" />
          <div className="w-px h-8 bg-slate-200" />
          <div>
            <div className="h-5 bg-slate-200 rounded w-32 mb-1" />
            <div className="h-3 bg-slate-100 rounded w-20" />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="h-9 w-9 bg-slate-200 rounded-lg" />
          <div className="h-9 w-9 bg-slate-200 rounded-lg" />
          <div className="h-9 w-24 bg-blue-200 rounded-lg" />
        </div>
      </header>

      {/* Workspace skeleton */}
      <div className="flex-1 flex">
        {/* Left panel */}
        <div className="w-full lg:w-[55%] xl:w-[50%] bg-white border-r border-slate-200 p-6">
          {/* Stepper */}
          <div className="flex gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 flex-1 bg-slate-100 rounded-lg" />
            ))}
          </div>
          {/* Form fields */}
          <div className="space-y-4 max-w-2xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 bg-slate-100 rounded-xl" />
            ))}
          </div>
        </div>

        {/* Right panel (preview) */}
        <div className="hidden lg:flex flex-1 items-start justify-center p-8">
          <div className="w-[210mm] h-[297mm] bg-white rounded shadow-lg border border-slate-200" />
        </div>
      </div>
    </div>
  );
}
