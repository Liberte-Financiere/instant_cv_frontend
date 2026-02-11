export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center animate-pulse">
        <div className="w-20 h-20 bg-slate-200 rounded-2xl mx-auto mb-6" />
        <div className="h-6 bg-slate-200 rounded-lg w-56 mx-auto mb-3" />
        <div className="h-4 bg-slate-100 rounded w-72 mx-auto" />
      </div>
    </div>
  );
}
