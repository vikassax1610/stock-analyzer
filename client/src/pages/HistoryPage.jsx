import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/ui/Container';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import SectionTitle from '../components/ui/SectionTitle';
import { TableRowSkeleton } from '../components/ui/Loader';
import { fetchRecentSignals } from '../services/api';
import { useAppContext } from '../context/AppContext';

const fmt = (n) => n?.toLocaleString('en-IN', { maximumFractionDigits: 2 }) ?? '—';

const HistoryPage = () => {
  const navigate = useNavigate();
  const { recentSignals } = useAppContext();
  const [dbSignals, setDbSignals]   = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchRecentSignals(50);
        setDbSignals(res.data || []);
      } catch { /* DB might not be available */ }
      finally  { setLoading(false); }
    };
    load();
  }, []);

  // Merge session + DB signals
  const merged = [
    ...recentSignals,
    ...dbSignals.filter(d => !recentSignals.some(s => s.symbol === d.symbol)),
  ];

  const timeAgo = (date) => {
    if (!date) return '';
    const diff = (Date.now() - new Date(date)) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(date).toLocaleDateString('en-IN');
  };

  return (
    <div className="flex-1 py-6">
      <Container>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text">Signal History</h1>
          <p className="text-text-muted text-sm mt-1">All recently generated trading signals.</p>
        </div>

        <Card padding="p-0" className="overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-5 px-4 py-3 border-b border-border text-[11px] font-semibold text-text-muted uppercase tracking-widest bg-bg-secondary">
            <span className="col-span-2">Stock</span>
            <span>Signal</span>
            <span>Price</span>
            <span className="text-right">Time</span>
          </div>

          {loading && recentSignals.length === 0 ? (
            <TableRowSkeleton rows={10} />
          ) : merged.length > 0 ? (
            merged.map((s, i) => (
              <button
                key={`${s.symbol}-${i}`}
                onClick={() => navigate(`/analysis/${s.symbol}`)}
                className="w-full grid grid-cols-5 items-center px-4 py-3 border-b border-border last:border-0 hover:bg-card-hover transition-colors group text-left"
              >
                <span className="col-span-2 text-sm font-semibold text-text group-hover:text-primary transition-colors">
                  {s.symbol}
                </span>
                <span><Badge signal={s.signal} size="sm" /></span>
                <span className="text-sm font-num text-text-secondary">
                  {s.currentPrice ? `₹${fmt(s.currentPrice)}` : '—'}
                </span>
                <span className="text-xs text-text-muted text-right">{timeAgo(s.createdAt)}</span>
              </button>
            ))
          ) : (
            <div className="py-16 text-center">
              <p className="text-text-muted text-sm">No signal history yet.</p>
              <p className="text-text-muted text-xs mt-1">Generate your first signal from the dashboard.</p>
            </div>
          )}
        </Card>
      </Container>
    </div>
  );
};

export default HistoryPage;
