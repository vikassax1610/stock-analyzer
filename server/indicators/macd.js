import { MACD } from 'technicalindicators';

/**
 * Calculate MACD (12, 26, 9).
 * @param {number[]} closes - Array of closing prices (oldest to newest)
 * @returns {{ macd: number|null, signal: number|null, histogram: number|null, bullish: boolean }}
 */
export const calculateMACD = (closes) => {
  if (!closes || closes.length < 35) return { macd: null, signal: null, histogram: null, bullish: false };

  const result = MACD.calculate({
    values: closes,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false,
  });

  if (!result || result.length === 0) {
    return { macd: null, signal: null, histogram: null, bullish: false };
  }

  const latest = result[result.length - 1];
  const prev = result.length > 1 ? result[result.length - 2] : null;

  const macdVal = latest.MACD ?? null;
  const signalVal = latest.signal ?? null;
  const histogram = latest.histogram ?? null;

  // Bullish: MACD line crosses above signal line (or MACD > Signal)
  const bullish = macdVal !== null && signalVal !== null && macdVal > signalVal;
  // Extra: detect recent crossover (previous bar was bearish, current is bullish)
  const crossover = prev
    ? (prev.MACD <= prev.signal) && bullish
    : false;

  return { macd: macdVal, signal: signalVal, histogram, bullish, crossover };
};
