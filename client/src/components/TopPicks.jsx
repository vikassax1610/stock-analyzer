import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import SectionTitle from './ui/SectionTitle';
import { TableRowSkeleton } from './ui/Loader';
import { fetchRecommendations, refreshRecommendations } from '../services/api';

const fmt = (n) => n?.toLocaleString('en-IN', { maximumFractionDigits: 2 }) ?? '—';
const fmtPct = (n) => (n >= 0 ? '+' : '') + (n?.toFixed(2) ?? '0') + '%';

const ConfMini = ({ value }) => (
  <div className="flex items-center gap-1.5">
    <div className="w-16 h-1.5 rounded-full bg-border overflow-hidden">
      <div className="h-full rounded-full bg-success" style={{ width: `${value}%` }} />
    </div>
    <span className="text-xs font-num font-semibold text-success">{value}%</span>
  </div>
);

const TopPicks = () => {
  const navigate = useNavigate();
  const [picks, setPicks]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]           = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [cached, setCached]         = useState(false);
  const [priceFilter, setPriceFilter] = useState('all'); // 'all' or '10-500'

  const load = useCallback(async (isRefresh = false, filterVal = priceFilter) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const fn = isRefresh ? refreshRecommendations : fetchRecommendations;
      const minP = filterVal === '10-500' ? 10 : null;
      const maxP = filterVal === '10-500' ? 500 : null;
      const res = await fn(10, minP, maxP);
      setPicks(res.data || []);
      setCached(res.cached ?? false);
      if (res.generatedAt) setLastUpdated(new Date(res.generatedAt));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [priceFilter]);

  // Load when price filter changes
  useEffect(() => {
    load(false, priceFilter);
  }, [priceFilter]);

  const timeAgo = (date) => {
    if (!date) return '';
    const diff = (Date.now() - date) / 60000;
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${Math.floor(diff)}m ago`;
    return `${Math.floor(diff / 60)}h ago`;
  };

  return (
    <div>
      <SectionTitle
        title="⭐ Top 10 Stocks to Buy"
        subtitle={
          lastUpdated
            ? `${cached ? 'Cached' : 'Generated'} ${timeAgo(lastUpdated)} · Confidence ranked`
            : 'AI-scanned BUY signals from NSE large-caps'
        }
        action={
          <Button
            variant="secondary"
            size="sm"
            loading={refreshing}
            onClick={() => load(true)}
          >
            {refreshing ? 'Scanning...' : '↺ Refresh'}
          </Button>
        }
      />

      {/* Price Range Filter Segment */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2 animate-fade-in">
        <div className="flex gap-2">
          <button
            onClick={() => setPriceFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              priceFilter === 'all'
                ? 'bg-primary/10 text-primary border-primary/20 font-bold'
                : 'bg-bg-secondary text-text-muted border-border hover:text-text'
            }`}
          >
            All Prices
          </button>
          <button
            onClick={() => setPriceFilter('10-500')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
              priceFilter === '10-500'
                ? 'bg-primary/10 text-primary border-primary/20 font-bold'
                : 'bg-bg-secondary text-text-muted border-border hover:text-text'
            }`}
          >
            <span>₹10 - ₹500 Only</span>
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          </button>
        </div>
      </div>

      <Card padding="p-0" className="overflow-hidden">
        {/* Column headers */}
        <div className="hidden sm:grid grid-cols-7 px-4 py-2.5 border-b border-border bg-bg-secondary text-[10px] font-semibold text-text-muted uppercase tracking-wider">
          <span className="col-span-2">Stock</span>
          <span>Signal</span>
          <span>Price</span>
          <span>Change</span>
          <span>Confidence</span>
          <span>T1 / SL</span>
        </div>

        {loading ? (
          <TableRowSkeleton rows={8} />
        ) : error ? (
          <div className="py-10 text-center">
            <p className="text-danger text-sm">{error}</p>
            <Button variant="secondary" size="sm" className="mt-3" onClick={() => load()}>Retry</Button>
          </div>
        ) : picks.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-text-muted text-sm">No strong BUY signals found at the moment.</p>
            <p className="text-text-muted text-xs mt-1">Market may be bearish or choppy. Check back later.</p>
          </div>
        ) : (
          picks.map((pick, idx) => (
            <button
              key={pick.symbol}
              onClick={() => navigate(`/analysis/${pick.symbol}`)}
              className="w-full text-left hover:bg-card-hover transition-colors duration-[var(--transition)] border-b border-border last:border-0 group"
            >
              {/* Mobile layout */}
              <div className="sm:hidden p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-success/10 text-success text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-text group-hover:text-primary transition-colors">{pick.symbol}</p>
                    <p className="text-[11px] text-text-muted truncate max-w-[140px]">{pick.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold font-num text-text">₹{fmt(pick.price)}</p>
                  <ConfMini value={pick.confidence} />
                </div>
              </div>

              {/* Desktop layout */}
              <div className="hidden sm:grid grid-cols-7 items-center px-4 py-3">
                <div className="col-span-2 flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-success/10 text-success text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-text group-hover:text-primary transition-colors truncate">{pick.symbol}</p>
                    <p className="text-[10px] text-text-muted truncate">{pick.name}</p>
                  </div>
                </div>
                <div><Badge signal={pick.signal} size="sm" /></div>
                <div className="text-sm font-num text-text">₹{fmt(pick.price)}</div>
                <div className={`text-xs font-num font-semibold ${pick.changePercent >= 0 ? 'text-success' : 'text-danger'}`}>
                  {fmtPct(pick.changePercent)}
                </div>
                <div><ConfMini value={pick.confidence} /></div>
                <div className="text-xs text-text-muted space-y-0.5">
                  <p className="text-success font-num">T1 ₹{fmt(pick.target1)}</p>
                  <p className="text-danger font-num">SL ₹{fmt(pick.stopLoss)}</p>
                </div>
              </div>
            </button>
          ))
        )}
      </Card>

      {picks.length > 0 && (
        <p className="text-[10px] text-text-muted mt-2 text-center">
          ⚠ Signals are for educational purposes only. Not financial advice.
          {cached && ' · Results cached for 15 minutes.'}
        </p>
      )}
    </div>
  );
};

export default TopPicks;
