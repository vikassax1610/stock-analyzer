import { useState, useEffect } from 'react';
import Card from './ui/Card';
import Badge from './ui/Badge';
import { Skeleton } from './ui/Loader';
import { fetchOptionsSignal } from '../services/api';

const OPTION_ELIGIBLE = new Set(['NIFTY', 'BANKNIFTY', 'SENSEX']);

const MoneynessBadge = ({ label }) => {
  const colors = {
    ATM: 'bg-primary/10 text-primary border border-primary/30',
    ITM: 'bg-success/10 text-success border border-success/30',
    OTM: 'bg-neutral/10 text-text-muted border border-border',
  };
  return (
    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${colors[label] || colors.OTM}`}>
      {label}
    </span>
  );
};

const OptionsSignal = ({ symbol }) => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const eligible = OPTION_ELIGIBLE.has(symbol?.toUpperCase());

  useEffect(() => {
    if (!eligible) { setLoading(false); return; }
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchOptionsSignal(symbol);
        setData(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [symbol, eligible]);

  if (!eligible) return null;

  const opt = data?.options;
  const isCall = opt?.optionType === 'CE';
  const isPut  = opt?.optionType === 'PE';
  const isHold = opt?.signal === 'HOLD';

  return (
    <Card className={`border-2 ${
      isCall ? 'border-success/30' : isPut ? 'border-danger/30' : 'border-border'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-text">Options Signal</h3>
            <p className="text-[11px] text-text-muted">F&O · Weekly Expiry</p>
          </div>
        </div>
        {opt && !isHold && (
          <div className={`px-3 py-1.5 rounded-full text-sm font-bold border ${
            isCall ? 'bg-success/10 text-success border-success/30' : 'bg-danger/10 text-danger border-danger/30'
          }`}>
            BUY {opt.optionType}
          </div>
        )}
      </div>

      {loading && (
        <div className="space-y-3">
          <Skeleton className="w-full" height="h-12" />
          <Skeleton className="w-3/4" height="h-4" />
          <Skeleton className="w-full" height="h-20" />
        </div>
      )}

      {error && !loading && (
        <p className="text-danger text-sm">{error}</p>
      )}

      {opt && !loading && (
        <div className="space-y-4">
          {/* Recommended Contract */}
          {!isHold && (
            <div className={`rounded-[var(--radius-sm)] p-4 ${
              isCall ? 'bg-success/5 border border-success/20' : 'bg-danger/5 border border-danger/20'
            }`}>
              <p className="text-[11px] font-semibold text-text-muted uppercase tracking-widest mb-1">Recommended Contract</p>
              <p className={`text-xl font-bold font-num ${isCall ? 'text-success' : 'text-danger'}`}>
                {opt.contract}
              </p>
              <p className="text-xs text-text-muted mt-0.5">Expiry: {opt.expiry}</p>
            </div>
          )}

          {isHold && (
            <div className="rounded-[var(--radius-sm)] p-4 bg-warning/5 border border-warning/20">
              <p className="text-warning font-semibold text-sm">⚠ No Option Trade Recommended</p>
              <p className="text-xs text-text-muted mt-1">{opt.rationale}</p>
            </div>
          )}

          {/* Premium Estimates */}
          {!isHold && opt.entryPremiumEst && (
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Entry Premium', value: `₹${opt.entryPremiumEst}`, color: 'text-primary' },
                { label: 'Stop Loss', value: `₹${opt.slPremiumEst}`, color: 'text-danger' },
                { label: 'Target', value: `₹${opt.targetPremiumEst}`, color: 'text-success' },
              ].map(({ label, value, color }) => (
                <div key={label} className="p-2.5 rounded-[var(--radius-sm)] bg-bg-secondary border border-border text-center">
                  <p className="text-[10px] text-text-muted">{label}</p>
                  <p className={`text-sm font-bold font-num ${color}`}>{value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Strike Table */}
          {opt.strikes?.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-text-muted uppercase tracking-widest mb-2">Strike Chain</p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-1.5 px-2 text-text-muted font-semibold">CE</th>
                      <th className="text-center py-1.5 px-2 text-text-muted font-semibold">Strike</th>
                      <th className="text-right py-1.5 px-2 text-text-muted font-semibold">PE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {opt.strikes.map((s) => (
                      <tr
                        key={s.strike}
                        className={`border-b border-border/50 last:border-0 ${
                          s.isATM ? 'bg-primary/5' : ''
                        }`}
                      >
                        <td className="py-1.5 px-2">
                          <MoneynessBadge label={s.ceMoneyness} />
                        </td>
                        <td className="py-1.5 px-2 text-center font-num font-bold text-text">
                          {s.strike.toLocaleString('en-IN')}
                          {s.isATM && <span className="text-[9px] text-primary ml-1">ATM</span>}
                        </td>
                        <td className="py-1.5 px-2 text-right">
                          <MoneynessBadge label={s.peMoneyness} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Rationale */}
          <div className="text-xs text-text-muted bg-bg-secondary rounded-[var(--radius-sm)] p-3">
            <p className="font-semibold text-text-secondary mb-0.5">Signal Rationale</p>
            <p>{opt.rationale}</p>
          </div>

          {/* Disclaimer */}
          <p className="text-[10px] text-text-muted italic">
            ⚠ {opt.disclaimer || 'Option premium estimates are approximate. Check live LTP on NSE before trading.'}
          </p>
        </div>
      )}
    </Card>
  );
};

export default OptionsSignal;
