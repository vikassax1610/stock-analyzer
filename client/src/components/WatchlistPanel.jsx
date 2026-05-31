import { useNavigate } from 'react-router-dom';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import SectionTitle from './ui/SectionTitle';

const fmt = (n) => n?.toLocaleString('en-IN', { maximumFractionDigits: 2 }) ?? '—';

const WatchlistPanel = ({ watchlist = [], loading = false, onRemove }) => {
  const navigate = useNavigate();

  return (
    <div>
      <SectionTitle
        title="Watchlist"
        subtitle={`${watchlist.length} stocks`}
      />
      <Card padding="p-0" className="overflow-hidden">
        {loading ? (
          <div className="py-8 text-center text-text-muted text-sm">Loading...</div>
        ) : watchlist.length > 0 ? (
          watchlist.map((item) => (
            <div
              key={item.symbol}
              className="flex items-center justify-between px-4 py-3 border-b border-border last:border-0 hover:bg-card-hover transition-colors group"
            >
              <button
                onClick={() => navigate(`/analysis/${item.symbol}`)}
                className="flex items-center gap-3 flex-1 text-left"
              >
                <div>
                  <p className="text-sm font-semibold text-text group-hover:text-primary transition-colors">
                    {item.symbol}
                  </p>
                  {item.companyName && (
                    <p className="text-xs text-text-muted">{item.companyName}</p>
                  )}
                </div>
                {item.lastSignal && <Badge signal={item.lastSignal} size="sm" />}
              </button>
              <button
                onClick={() => onRemove?.(item.symbol)}
                className="ml-2 p-1 text-text-muted hover:text-danger transition-colors rounded"
                title="Remove from watchlist"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))
        ) : (
          <div className="py-10 text-center">
            <p className="text-text-muted text-sm">No stocks in watchlist.</p>
            <p className="text-text-muted text-xs mt-1">Analyze a stock and click "Watchlist" to add it.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default WatchlistPanel;
