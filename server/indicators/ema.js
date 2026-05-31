import { EMA } from 'technicalindicators';

/**
 * Calculate EMA for a given period.
 * @param {number[]} closes - Array of closing prices (oldest to newest)
 * @param {number} period - EMA period (e.g., 20 or 50)
 * @returns {number|null} - Latest EMA value
 */
export const calculateEMA = (closes, period) => {
  if (!closes || closes.length < period) return null;
  const result = EMA.calculate({ period, values: closes });
  return result.length > 0 ? result[result.length - 1] : null;
};

/**
 * Calculate both EMA20 and EMA50.
 * @param {number[]} closes
 * @returns {{ ema20: number|null, ema50: number|null }}
 */
export const calculateEMAs = (closes) => {
  return {
    ema20: calculateEMA(closes, 20),
    ema50: calculateEMA(closes, 50),
  };
};
