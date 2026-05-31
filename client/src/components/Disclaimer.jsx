const Disclaimer = () => (
  <div className="border-t border-border mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex flex-wrap items-center justify-center gap-2 text-center">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-warning flex-shrink-0">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <p className="text-xs text-text-muted">
          <span className="font-semibold text-warning">Disclaimer: </span>
          This tool provides AI-assisted trading signals and is not financial advice. Trading involves risk.
          Past performance does not guarantee future results. Please consult a SEBI-registered advisor before investing.
        </p>
      </div>
    </div>
  </div>
);

export default Disclaimer;
