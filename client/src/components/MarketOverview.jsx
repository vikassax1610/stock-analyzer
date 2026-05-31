import Card from './ui/Card';
import SectionTitle from './ui/SectionTitle';
import { Skeleton } from './ui/Loader';
import { CHANGE_COLOR, CHANGE_BG } from '../constants/theme';

const fmt = (n) => n?.toLocaleString('en-IN', { maximumFractionDigits: 2 }) ?? '—';
const fmtPct = (n) => (n >= 0 ? '+' : '') + (n?.toFixed(2) ?? '0') + '%';

const IndexCard = ({ data }) => {
  const isUp = (data.changePercent ?? 0) >= 0;
  return (
    <Card className="flex-1 min-w-0 animate-fade-in" padding="p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-widest">{data.symbol}</p>
          <p className="text-2xl font-bold font-num text-text mt-1">
            {data.price > 0 ? fmt(data.price) : '—'}
          </p>
        </div>
        <div className={`flex flex-col items-end gap-1`}>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CHANGE_BG(data.changePercent)} ${CHANGE_COLOR(data.changePercent)}`}>
            {data.price > 0 ? fmtPct(data.changePercent) : '—'}
          </span>
          <span className={`text-sm font-num font-medium ${CHANGE_COLOR(data.change)}`}>
            {data.price > 0 ? (isUp ? '+' : '') + fmt(data.change) : ''}
          </span>
        </div>
      </div>
      <div className="mt-3 h-1 rounded-full bg-border overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${isUp ? 'bg-success' : 'bg-danger'}`}
          style={{ width: `${Math.min(Math.abs(data.changePercent ?? 0) * 8, 100)}%` }}
        />
      </div>
    </Card>
  );
};

const IndexSkeleton = () => (
  <div className="flex-1 card-base p-4 space-y-3">
    <Skeleton className="w-20" height="h-3" />
    <Skeleton className="w-32" height="h-7" />
    <Skeleton className="w-full" height="h-1" />
  </div>
);

const MarketOverview = ({ data = [], loading = false }) => {
  return (
    <div>
      <SectionTitle
        title="Market Overview"
        subtitle="NSE & BSE indices"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <IndexSkeleton key={i} />)
          : data.map(item => <IndexCard key={item.symbol} data={item} />)
        }
      </div>
    </div>
  );
};

export default MarketOverview;
