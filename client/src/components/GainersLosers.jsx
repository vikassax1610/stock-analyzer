import Card from './ui/Card';
import SectionTitle from './ui/SectionTitle';
import { TableRowSkeleton } from './ui/Loader';

const fmt = (n) => n?.toLocaleString('en-IN', { maximumFractionDigits: 2 }) ?? '—';
const fmtPct = (n) => (n >= 0 ? '+' : '') + (n?.toFixed(2) ?? '0') + '%';

const StockRow = ({ stock, onClick }) => {
  const isUp = (stock.changePercent ?? 0) >= 0;
  return (
    <button
      onClick={() => onClick(stock.symbol)}
      className="w-full flex items-center justify-between px-4 py-2.5 border-b border-border last:border-0 hover:bg-card-hover transition-colors duration-[var(--transition)] group text-left"
      title={`Analyze ${stock.symbol}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isUp ? 'bg-success' : 'bg-danger'}`} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text group-hover:text-primary transition-colors truncate">
            {stock.symbol}
          </p>
          <p className="text-[11px] text-text-muted truncate">{stock.name || ''}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        <span className="text-sm font-num font-medium text-text">
          ₹{fmt(stock.price)}
        </span>
        <span className={`text-xs font-semibold font-num min-w-[54px] text-right ${isUp ? 'text-success' : 'text-danger'}`}>
          {fmtPct(stock.changePercent)}
        </span>
      </div>
    </button>
  );
};

const GainersLosers = ({ gainers = [], losers = [], loading = false, onSelectStock }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Gainers */}
      <div>
        <SectionTitle title="Top Gainers" subtitle="Best performing today" />
        <Card padding="p-0" className="overflow-hidden">
          <div className="px-4 py-2 border-b border-border flex items-center gap-2 bg-success/5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-success">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
            <span className="text-xs font-semibold text-success uppercase tracking-wider">Gainers</span>
          </div>
          {loading
            ? <TableRowSkeleton rows={10} />
            : gainers.length > 0
              ? gainers.map(s => <StockRow key={s.symbol} stock={s} onClick={onSelectStock} />)
              : <p className="text-center text-text-muted text-sm py-8">No data available</p>
          }
        </Card>
      </div>

      {/* Losers */}
      <div>
        <SectionTitle title="Top Losers" subtitle="Underperforming today" />
        <Card padding="p-0" className="overflow-hidden">
          <div className="px-4 py-2 border-b border-border flex items-center gap-2 bg-danger/5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-danger">
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
              <polyline points="17 18 23 18 23 12" />
            </svg>
            <span className="text-xs font-semibold text-danger uppercase tracking-wider">Losers</span>
          </div>
          {loading
            ? <TableRowSkeleton rows={10} />
            : losers.length > 0
              ? losers.map(s => <StockRow key={s.symbol} stock={s} onClick={onSelectStock} />)
              : <p className="text-center text-text-muted text-sm py-8">No data available</p>
          }
        </Card>
      </div>
    </div>
  );
};

export default GainersLosers;
