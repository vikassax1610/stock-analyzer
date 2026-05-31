import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  placeholder,
  value,
  onChange,
  onKeyDown,
  leftIcon,
  rightIcon,
  error,
  disabled = false,
  className = '',
  inputClassName = '',
  type = 'text',
  autoFocus = false,
  id,
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 text-text-muted pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`
            w-full bg-card border border-border rounded-[var(--radius-sm)]
            text-text placeholder-text-muted text-sm
            py-3 pr-4 transition-all duration-[var(--transition)]
            focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30
            hover:border-border-light
            disabled:opacity-50 disabled:cursor-not-allowed
            ${leftIcon ? 'pl-10' : 'pl-4'}
            ${rightIcon ? 'pr-10' : ''}
            ${error ? 'border-danger focus:border-danger focus:ring-danger/30' : ''}
            ${inputClassName}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 text-text-muted">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
