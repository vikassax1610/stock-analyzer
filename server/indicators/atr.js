import { ATR } from 'technicalindicators';

/**
 * Calculate ATR (Average True Range) for a given period.
 * @param {Array<{high: number, low: number, close: number}>} candles
 * @param {number} period - ATR period (default 14)
 * @returns {number|null} - Latest ATR value
 */
export const calculateATR = (candles, period = 14) => {
  if (!candles || candles.length < period + 1) return null;

  const high = candles.map(c => c.high);
  const low = candles.map(c => c.low);
  const close = candles.map(c => c.close);

  const result = ATR.calculate({ period, high, low, close });
  return result.length > 0 ? result[result.length - 1] : null;
};
