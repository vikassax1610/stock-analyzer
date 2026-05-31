import { useEffect, useState } from 'react';
import Card from './ui/Card';
import Badge from './ui/Badge';
import SectionTitle from './ui/SectionTitle';
import { CardSkeleton } from './ui/Loader';
import { fetchRecentSignals } from '../services/api';
import { useAppContext } from '../context/AppContext';

const fmt = (n) => n?.toLocaleString('en-IN', { maximumFractionDigits: 2 }) ?? '—';

const SignalChip = ({ signal, confidence, symbol, price, onClick, createdAt }) => {
  const timeAgo = (date) => {
    const diff = (Date.now() - new Date(date)) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(date).toLocaleDateString('en-IN');
  };

  return (
    <button
      onClick={() => onClick(symbol)}
      className="w-full flex items-center justify-between p-3 rounded-[var(--radius-sm)] hover:bg-card-hover transition-all duration-[var(--transition)] group border border-transparent hover:border-border text-left"
    >
      <div className="flex items-center gap-3">
        <Badge signal={signal} size="sm" />
        <div>
          <p className="text-sm font-bold text-text group-hover:text-primary transition-colors">{symbol}</p>
          {price && <p className="text-xs text-text-muted font-num">₹{fmt(price)}</p>}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-1">
          <div className="h-1.5 w-16 bg-border rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                signal === 'BUY' ? 'bg-success' : signal === 'SELL' ? 'bg-danger' : 'bg-warning'
              }`}
              style={{ width: `${confidence}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-text-secondary font-num">{confidence}%</span>
        </div>
        {createdAt && <span className="text-[10px] text-text-muted">{timeAgo(createdAt)}</span>}
      </div>
    </button>
  );
};

const RecentSignals = ({ onSelectStock }) => {
  const { recentSignals } = useAppContext();
  const [dbSignals, setDbSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchRecentSignals(10);
        setDbSignals(res.data || []);
      } catch {
        // DB might not be connected
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Merge: session signals (freshest) + DB signals, deduplicated
  const merged = [
    ...recentSignals,
    ...dbSignals.filter(d => !recentSignals.some(s => s.symbol === d.symbol)),
  ].slice(0, 10);

  if (loading && recentSignals.length === 0) {
    return (
      <div>
        <SectionTitle title="Recent Signals" subtitle="Latest generated signals" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} lines={1} />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionTitle title="Recent Signals" subtitle="Click to re-analyze" />
      <Card padding="p-2">
        {merged.length > 0 ? (
          <div className="space-y-0.5">
            {merged.map((s) => (
              <SignalChip
                key={s.symbol}
                signal={s.signal}
                confidence={s.confidence}
                symbol={s.symbol}
                price={s.currentPrice}
                onClick={onSelectStock}
                createdAt={s.createdAt}
              />
            ))}
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="text-text-muted text-sm">No signals generated yet.</p>
            <p className="text-text-muted text-xs mt-1">Search for a stock to generate your first signal.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default RecentSignals;
