const SectionTitle = ({ title, subtitle, action, className = '' }) => (
  <div className={`flex items-center justify-between mb-4 ${className}`}>
    <div>
      <h2 className="text-base font-semibold text-text tracking-tight">{title}</h2>
      {subtitle && <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export default SectionTitle;
