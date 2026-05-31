/**
 * Volume analysis utilities.
 */

/**
 * Calculate average volume over a lookback period.
 * @param {number[]} volumes - Array of volume values (oldest to newest)
 * @param {number} period - Lookback period (default 20)
 * @returns {number} - Average volume
 */
export const calculateVolumeAverage = (volumes, period = 20) => {
  if (!volumes || volumes.length === 0) return 0;
  const slice = volumes.slice(-period);
  return slice.reduce((sum, v) => sum + v, 0) / slice.length;
};

/**
 * Detect volume spike — current volume is significantly above average.
 * @param {number} currentVolume
 * @param {number} avgVolume
 * @param {number} threshold - Multiplier threshold (default 1.5×)
 * @returns {boolean}
 */
export const isVolumeSpike = (currentVolume, avgVolume, threshold = 1.5) => {
  if (!avgVolume || avgVolume === 0) return false;
  return currentVolume >= avgVolume * threshold;
};

/**
 * Volume ratio: current / average
 */
export const volumeRatio = (currentVolume, avgVolume) => {
  if (!avgVolume || avgVolume === 0) return 1;
  return currentVolume / avgVolume;
};
