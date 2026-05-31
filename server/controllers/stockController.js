import { getQuote, getHistoricalData } from '../services/marketDataService.js';
import { generateSignal } from '../indicators/signalEngine.js';
import { EMA } from 'technicalindicators';
import Signal from '../models/Signal.js';
import SearchHistory from '../models/SearchHistory.js';

/**
 * GET /api/stock/:symbol
 * Generate and return a trading signal for the given stock symbol.
 */
export const getStockSignal = async (req, res, next) => {
  try {
    const symbol = req.params.symbol.toUpperCase().trim();

    const [quote, candles] = await Promise.all([
      getQuote(symbol),
      getHistoricalData(symbol, '6mo', '1d'),
    ]);

    const result = generateSignal(symbol, quote.price, quote.volume, candles);

    const fullResult = {
      ...result,
      name: quote.name,
      change: parseFloat(quote.change.toFixed(2)),
      changePercent: parseFloat(quote.changePercent.toFixed(2)),
      high: quote.high,
      low: quote.low,
      open: quote.open,
      previousClose: quote.previousClose,
      volume: quote.volume,
    };

    persistSignal(fullResult).catch(err => console.warn('Signal persist error:', err.message));
    recordSearch(symbol).catch(() => {});

    res.json({ success: true, data: fullResult });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/stock/chart/:symbol?period=6mo|3mo|1mo
 * Returns OHLCV candle data + EMA20/50 overlays for charting.
 */
export const getChartData = async (req, res, next) => {
  try {
    const symbol = req.params.symbol.toUpperCase().trim();
    const period = req.query.period || '6mo';

    const candles = await getHistoricalData(symbol, period, '1d');
    const closes = candles.map(c => c.close);

    const ema20Series = EMA.calculate({ period: 20, values: closes });
    const ema50Series = EMA.calculate({ period: 50, values: closes });

    const ema20Offset = closes.length - ema20Series.length;
    const ema50Offset = closes.length - ema50Series.length;

    const chartData = candles.map((c, i) => ({
      date: c.date instanceof Date
        ? c.date.toISOString().split('T')[0]
        : String(c.date).split('T')[0],
      open:   parseFloat((c.open  ?? 0).toFixed(2)),
      high:   parseFloat((c.high  ?? 0).toFixed(2)),
      low:    parseFloat((c.low   ?? 0).toFixed(2)),
      close:  parseFloat((c.close ?? 0).toFixed(2)),
      volume: c.volume ?? 0,
      ema20: i >= ema20Offset ? parseFloat(ema20Series[i - ema20Offset]?.toFixed(2)) : null,
      ema50: i >= ema50Offset ? parseFloat(ema50Series[i - ema50Offset]?.toFixed(2)) : null,
    }));

    res.json({ success: true, data: { symbol, period, candles: chartData } });
  } catch (err) {
    next(err);
  }
};

// ─── DB Helpers ───────────────────────────────────────────────────────────────

const persistSignal = async (data) => {
  await new Signal({
    symbol: data.symbol,
    currentPrice: data.currentPrice,
    signal: data.signal,
    confidence: data.confidence,
    entry: data.entry,
    stopLoss: data.stopLoss,
    target1: data.target1,
    target2: data.target2,
    reasons: data.reasons,
    indicators: data.indicators,
  }).save();
};

const recordSearch = async (symbol) => {
  await SearchHistory.create({ symbol, searchedAt: new Date() });
};
