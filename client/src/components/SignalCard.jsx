import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import { SIGNAL_COLORS } from '../constants/theme';
import useWatchlist from '../hooks/useWatchlist';
import StockChart from './StockChart';
import OptionsSignal from './OptionsSignal';

const fmt = (n) => n?.toLocaleString('en-IN', { maximumFractionDigits: 2 }) ?? '—';
const fmtPct = (n) => (n >= 0 ? '+' : '') + (n?.toFixed(2) ?? '0') + '%';

const MetricCell = ({ label, value, valueClass = '' }) => (
  <div className="flex flex-col gap-1 p-3 rounded-[var(--radius-sm)] bg-bg-secondary border border-border">
    <span className="text-[11px] font-semibold text-text-muted uppercase tracking-widest">{label}</span>
    <span className={`text-base font-bold font-num ${valueClass}`}>{value}</span>
  </div>
);

const ConfidenceBar = ({ value, signal }) => {
  const colorMap = { BUY: 'bg-success', SELL: 'bg-danger', HOLD: 'bg-warning' };
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${colorMap[signal] || 'bg-primary'}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-sm font-bold font-num text-text">{value}%</span>
    </div>
  );
};

const SignalCard = ({ data, onReset }) => {
  const { signal, symbol, currentPrice, confidence, entry, stopLoss, target1, target2, reasons, indicators, change, changePercent, name } = data;
  const colors = SIGNAL_COLORS[signal] || SIGNAL_COLORS.HOLD;
  const { add, remove, isWatched } = useWatchlist();
  const watched = isWatched(symbol);

  const handleWatchlist = () => {
    if (watched) remove(symbol);
    else add(symbol, name || symbol);
  };

  return (
    <div className="animate-slide-in space-y-4">
      {/* Header */}
      <Card className={`border-2 ${colors.border} ${colors.glow}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-text">{symbol}</h1>
              <Badge signal={signal} size="lg" />
            </div>
            {name && <p className="text-sm text-text-muted mt-0.5">{name}</p>}
            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-3xl font-bold font-num text-text">₹{fmt(currentPrice)}</span>
              {change !== undefined && (
                <span className={`text-sm font-semibold font-num ${change >= 0 ? 'text-success' : 'text-danger'}`}>
                  {change >= 0 ? '+' : ''}{fmt(change)} ({fmtPct(changePercent)})
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Button
              variant={watched ? 'success' : 'secondary'}
              size="sm"
              onClick={handleWatchlist}
            >
              {watched ? '★ Watching' : '☆ Watchlist'}
            </Button>
            {onReset && (
              <Button variant="ghost" size="sm" onClick={onReset}>
                ← Back
              </Button>
            )}
          </div>
        </div>

        {/* Confidence */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Confidence Score</span>
            <span className={`text-xs font-bold ${colors.text}`}>
              {confidence >= 80 ? 'High' : confidence >= 60 ? 'Medium' : 'Low'} Confidence
            </span>
          </div>
          <ConfidenceBar value={confidence} signal={signal} />
        </div>
      </Card>

      {/* Price Chart */}
      <StockChart symbol={symbol} currentPrice={currentPrice} />

      {/* Options Trading Signal */}
      <OptionsSignal symbol={symbol} />

      {/* Trade Levels */}
      <Card>
        <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Trade Levels</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MetricCell label="Entry" value={`₹${fmt(entry)}`} valueClass="text-primary" />
          <MetricCell label="Stop Loss" value={`₹${fmt(stopLoss)}`} valueClass="text-danger" />
          <MetricCell label="Target 1" value={`₹${fmt(target1)}`} valueClass="text-success" />
          <MetricCell label="Target 2" value={`₹${fmt(target2)}`} valueClass="text-success" />
        </div>
      </Card>

      {/* Indicators */}
      {indicators && Object.keys(indicators).length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Technical Indicators</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {indicators.ema20 != null && (
              <MetricCell
                label="EMA 20"
                value={`₹${fmt(indicators.ema20)}`}
                valueClass={currentPrice > indicators.ema20 ? 'text-success' : 'text-danger'}
              />
            )}
            {indicators.ema50 != null && (
              <MetricCell
                label="EMA 50"
                value={`₹${fmt(indicators.ema50)}`}
                valueClass={currentPrice > indicators.ema50 ? 'text-success' : 'text-danger'}
              />
            )}
            {indicators.rsi != null && (
              <MetricCell
                label="RSI (14)"
                value={indicators.rsi.toFixed(1)}
                valueClass={indicators.rsi > 55 ? 'text-success' : indicators.rsi < 45 ? 'text-danger' : 'text-warning'}
              />
            )}
            {indicators.atr != null && (
              <MetricCell label="ATR (14)" value={`₹${fmt(indicators.atr)}`} />
            )}
            {indicators.currentVolume != null && (
              <MetricCell
                label="Volume"
                value={indicators.currentVolume?.toLocaleString('en-IN') ?? '—'}
                valueClass={indicators.currentVolume > indicators.volumeAvg ? 'text-success' : ''}
              />
            )}
            {indicators.macd != null && (
              <MetricCell
                label="MACD"
                value={indicators.macd?.toFixed(3)}
                valueClass={indicators.macd > indicators.macdSignal ? 'text-success' : 'text-danger'}
              />
            )}
          </div>
        </Card>
      )}

      {/* Signal Reasons */}
      {reasons && reasons.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Signal Analysis</h3>
          <ul className="space-y-2">
            {reasons.map((r, i) => {
              const isBull = r.startsWith('✓');
              const isBear = r.startsWith('✗');
              return (
                <li key={i} className={`flex items-start gap-2 text-sm p-2.5 rounded-[var(--radius-sm)] ${
                  isBull ? 'bg-success/5 text-success' :
                  isBear ? 'bg-danger/5 text-danger' :
                  'bg-warning/5 text-warning'
                }`}>
                  {r}
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
};

export default SignalCard;
