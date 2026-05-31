import { RSI } from 'technicalindicators';

/**
 * Calculate RSI for a given period.
 * @param {number[]} closes - Array of closing prices (oldest to newest)
 * @param {number} period - RSI period (default 14)
 * @returns {number|null} - Latest RSI value (0–100)
 */
export const calculateRSI = (closes, period = 14) => {
  if (!closes || closes.length < period + 1) return null;
  const result = RSI.calculate({ period, values: closes });
  return result.length > 0 ? result[result.length - 1] : null;
};
