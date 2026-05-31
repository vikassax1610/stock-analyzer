// ── Spinner ──────────────────────────────────────────────────────────────────
export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8', xl: 'w-12 h-12' };
  return (
    <svg
      className={`animate-spin text-primary ${sizes[size]} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
};

// ── Full-page loader ──────────────────────────────────────────────────────────
export const PageLoader = ({ text = 'Analyzing...' }) => (
  <div className="flex flex-col items-center justify-center gap-4 py-24">
    <div className="relative">
      <div className="w-16 h-16 rounded-full border-2 border-primary/20" />
      <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-t-primary animate-spin" />
    </div>
    <p className="text-text-secondary text-sm animate-pulse">{text}</p>
  </div>
);

// ── Skeleton block ────────────────────────────────────────────────────────────
export const Skeleton = ({ className = '', height = 'h-4' }) => (
  <div className={`skeleton ${height} rounded-[var(--radius-sm)] ${className}`} />
);

// ── Card skeleton ─────────────────────────────────────────────────────────────
export const CardSkeleton = ({ lines = 3 }) => (
  <div className="card-base p-5 space-y-3">
    <Skeleton className="w-1/3" height="h-5" />
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} className={i === lines - 1 ? 'w-2/3' : 'w-full'} />
    ))}
  </div>
);

// ── Signal card skeleton ──────────────────────────────────────────────────────
export const SignalSkeleton = () => (
  <div className="card-base p-6 space-y-5 animate-fade-in">
    <div className="flex items-center justify-between">
      <Skeleton className="w-32" height="h-7" />
      <Skeleton className="w-20" height="h-8" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="w-24" height="h-3" />
          <Skeleton className="w-32" height="h-6" />
        </div>
      ))}
    </div>
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="w-full" height="h-4" />
      ))}
    </div>
  </div>
);

// ── Table row skeleton ────────────────────────────────────────────────────────
export const TableRowSkeleton = ({ rows = 10 }) => (
  <>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center justify-between p-3 border-b border-border last:border-0 gap-4">
        <Skeleton className="w-24" height="h-4" />
        <Skeleton className="w-20" height="h-4" />
        <Skeleton className="w-16" height="h-4" />
      </div>
    ))}
  </>
);

// Default export
const Loader = PageLoader;
export default Loader;
