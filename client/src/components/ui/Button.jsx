const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  type = 'button',
  ...props
}) => {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-[var(--radius-sm)] transition-all duration-[var(--transition)] cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg)] disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:   'bg-primary text-white hover:bg-primary-hover focus:ring-primary shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_28px_rgba(59,130,246,0.35)]',
    secondary: 'bg-card border border-border text-text hover:border-border-light hover:bg-card-hover focus:ring-primary',
    success:   'bg-success/10 border border-success/30 text-success hover:bg-success/20 focus:ring-success',
    danger:    'bg-danger/10 border border-danger/30 text-danger hover:bg-danger/20 focus:ring-danger',
    ghost:     'text-text-secondary hover:text-text hover:bg-card focus:ring-primary',
    outline:   'border border-primary text-primary hover:bg-primary/10 focus:ring-primary',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
    icon: 'p-2 text-sm',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
