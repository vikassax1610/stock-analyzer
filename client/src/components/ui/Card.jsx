const Card = ({
  children,
  className = '',
  hoverable = false,
  onClick,
  padding = 'p-5',
  glow,
  ...props
}) => {
  const glowStyles = {
    primary: 'hover:shadow-[var(--shadow-glow-primary)]',
    success: 'hover:shadow-[var(--shadow-glow-success)]',
    danger:  'hover:shadow-[var(--shadow-glow-danger)]',
  };

  return (
    <div
      onClick={onClick}
      className={`
        card-base ${padding}
        ${hoverable ? 'cursor-pointer hover:border-border-light hover:-translate-y-0.5 transition-all duration-[var(--transition)]' : ''}
        ${glow ? glowStyles[glow] || '' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
