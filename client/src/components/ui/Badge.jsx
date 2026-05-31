const Badge = ({ signal, size = 'md', className = '' }) => {
  const signalMap = {
    BUY:  { label: '▲ BUY',  css: 'badge-buy' },
    SELL: { label: '▼ SELL', css: 'badge-sell' },
    HOLD: { label: '◆ HOLD', css: 'badge-hold' },
  };

  const sizeMap = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-3 py-1',
    lg: 'text-sm px-4 py-1.5',
    xl: 'text-base px-5 py-2',
  };

  const config = signalMap[signal] || signalMap.HOLD;

  return (
    <span className={`
      inline-flex items-center gap-1 font-bold tracking-wider
      rounded-full ${config.css} ${sizeMap[size]} ${className}
    `}>
      {config.label}
    </span>
  );
};

export default Badge;
