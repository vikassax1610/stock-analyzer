import { useState, useEffect, useCallback } from 'react';
import {
  ResponsiveContainer, ComposedChart, Line, Bar,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { fetchChartData } from '../services/api';
import Card from './ui/Card';
import SectionTitle from './ui/SectionTitle';
import Button from './ui/Button';
import { Skeleton } from './ui/Loader';

const PERIODS = [
  { label: '1M', value: '1mo' },
  { label: '3M', value: '3mo' },
  { label: '6M', value: '6mo' },
];

// ── Custom Tooltip ─────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;

  return (
    <div className="card-base p-3 text-xs space-y-1 min-w-[160px] shadow-[var(--shadow-lg)]">
      <p className="font-semibold text-text border-b border-border pb-1 mb-1">{label}</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
        <span className="text-text-muted">Open</span>
        <span className="font-num text-text font-medium">₹{d.open?.toLocaleString('en-IN')}</span>
        <span className="text-text-muted">High</span>
        <span className="font-num text-success font-medium">₹{d.high?.toLocaleString('en-IN')}</span>
        <span className="text-text-muted">Low</span>
        <span className="font-num text-danger font-medium">₹{d.low?.toLocaleString('en-IN')}</span>
        <span className="text-text-muted">Close</span>
        <span className="font-num text-text font-bold">₹{d.close?.toLocaleString('en-IN')}</span>
        {d.ema20 && <><span className="text-text-muted">EMA20</span><span className="font-num" style={{color:'var(--primary)'}}>₹{d.ema20?.toLocaleString('en-IN')}</span></>}
        {d.ema50 && <><span className="text-text-muted">EMA50</span><span className="font-num" style={{color:'var(--warning)'}}>₹{d.ema50?.toLocaleString('en-IN')}</span></>}
      </div>
    </div>
  );
};

// ── Volume Tooltip ─────────────────────────────────────────────────────────────
const formatVolume = (v) => {
  if (v >= 1e7) return (v / 1e7).toFixed(1) + 'Cr';
  if (v >= 1e5) return (v / 1e5).toFixed(1) + 'L';
  return v?.toLocaleString('en-IN');
};

const formatDate = (dateStr) => {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  } catch { return dateStr; }
};

// ── Main Chart Component ───────────────────────────────────────────────────────
const StockChart = ({ symbol, currentPrice }) => {
  const [data, setData]       = useState([]);
  const [period, setPeriod]   = useState('3mo');
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const load = useCallback(async () => {
    if (!symbol) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchChartData(symbol, period);
      setData(res.data?.candles || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [symbol, period]);

  useEffect(() => { load(); }, [load]);

  // Determine chart Y-axis domain with padding
  const closes = data.map(d => d.close).filter(Boolean);
  const highs  = data.map(d => d.high).filter(Boolean);
  const lows   = data.map(d => d.low).filter(Boolean);
  const minY = Math.min(...lows)   * 0.995;
  const maxY = Math.max(...highs)  * 1.005;

  // Color close line based on trend
  const firstClose = closes[0];
  const lastClose  = closes[closes.length - 1];
  const trendUp    = lastClose >= firstClose;

  return (
    <Card padding="p-4">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <SectionTitle
          title="Price Chart"
          subtitle={`${symbol} — Daily OHLCV`}
          className="mb-0"
        />
        <div className="flex gap-1">
          {PERIODS.map(p => (
            <Button
              key={p.value}
              variant={period === p.value ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setPeriod(p.value)}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="space-y-2">
          <Skeleton className="w-full" height="h-48" />
          <Skeleton className="w-full" height="h-16" />
        </div>
      )}

      {error && !loading && (
        <div className="text-center py-8 text-danger text-sm">{error}</div>
      )}

      {!loading && !error && data.length > 0 && (
        <div>
          {/* Price Chart */}
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={false}
                interval={Math.floor(data.length / 6)}
              />
              <YAxis
                domain={[minY, maxY]}
                tickFormatter={v => '₹' + v.toLocaleString('en-IN')}
                tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={false}
                width={72}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '11px', color: 'var(--text-secondary)', paddingTop: '8px' }}
                formatter={(value) => <span style={{ color: 'var(--text-secondary)' }}>{value}</span>}
              />

              {/* Current price reference line */}
              {currentPrice && (
                <ReferenceLine
                  y={currentPrice}
                  stroke="var(--text-muted)"
                  strokeDasharray="4 2"
                  label={{ value: `₹${currentPrice.toLocaleString('en-IN')}`, position: 'right', fill: 'var(--text-muted)', fontSize: 10 }}
                />
              )}

              {/* Close price line */}
              <Line
                type="monotone"
                dataKey="close"
                name="Price"
                stroke={trendUp ? 'var(--success)' : 'var(--danger)'}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: trendUp ? 'var(--success)' : 'var(--danger)' }}
              />

              {/* EMA 20 */}
              <Line
                type="monotone"
                dataKey="ema20"
                name="EMA 20"
                stroke="var(--primary)"
                strokeWidth={1.5}
                dot={false}
                strokeDasharray="0"
                connectNulls
              />

              {/* EMA 50 */}
              <Line
                type="monotone"
                dataKey="ema50"
                name="EMA 50"
                stroke="var(--warning)"
                strokeWidth={1.5}
                dot={false}
                connectNulls
              />
            </ComposedChart>
          </ResponsiveContainer>

          {/* Volume Chart */}
          <ResponsiveContainer width="100%" height={70}>
            <ComposedChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <XAxis dataKey="date" hide />
              <YAxis tickFormatter={formatVolume} tick={{ fill: 'var(--text-muted)', fontSize: 9 }} tickLine={false} axisLine={false} width={72} />
              <Tooltip
                formatter={(v) => [formatVolume(v), 'Volume']}
                contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '11px' }}
                labelStyle={{ color: 'var(--text-secondary)' }}
                itemStyle={{ color: 'var(--text)' }}
              />
              <Bar dataKey="volume" name="Volume" fill="var(--primary)" opacity={0.35} radius={[2, 2, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};

export default StockChart;
