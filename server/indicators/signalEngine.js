/**
 * signalEngine.js
 * Core rule-based trading signal generator.
 * Combines all indicators and produces a structured signal response.
 */

import { calculateEMAs } from './ema.js';
import { calculateRSI } from './rsi.js';
import { calculateMACD } from './macd.js';
import { calculateATR } from './atr.js';
import { calculateVolumeAverage, isVolumeSpike, volumeRatio } from './volume.js';

/**
 * Generate a trading signal from historical candle data + current price/volume.
 *
 * @param {string} symbol
 * @param {number} currentPrice
 * @param {number} currentVolume
 * @param {Array<{open,high,low,close,volume}>} candles - Historical OHLCV (oldest→newest)
 * @returns {SignalResult}
 */
export const generateSignal = (symbol, currentPrice, currentVolume, candles) => {
  if (!candles || candles.length < 55) {
    return buildInsufficientDataResponse(symbol, currentPrice);
  }

  const closes = candles.map(c => c.close);
  const volumes = candles.map(c => c.volume);

  // ── Calculate Indicators ──────────────────────────────────────────────────
  const { ema20, ema50 } = calculateEMAs(closes);
  const rsi = calculateRSI(closes, 14);
  const macdResult = calculateMACD(closes);
  const atr = calculateATR(candles, 14);
  const volumeAvg = calculateVolumeAverage(volumes, 20);
  const volSpike = isVolumeSpike(currentVolume, volumeAvg, 1.3);
  const volRatio = volumeRatio(currentVolume, volumeAvg);

  // ── Condition Flags ───────────────────────────────────────────────────────
  const priceAboveEma20 = ema20 !== null && currentPrice > ema20;
  const priceAboveEma50 = ema50 !== null && currentPrice > ema50;
  const ema20AboveEma50 = ema20 !== null && ema50 !== null && ema20 > ema50;

  const rsiBullish = rsi !== null && rsi > 55;
  const rsiBearish = rsi !== null && rsi < 45;
  const rsiNeutral = rsi !== null && rsi >= 45 && rsi <= 55;

  const macdBullish = macdResult.bullish === true;
  const macdBearish = macdResult.macd !== null && macdResult.signal !== null && macdResult.macd < macdResult.signal;

  // ── Signal Determination ──────────────────────────────────────────────────
  const buyConditions = [
    priceAboveEma20,
    ema20AboveEma50,
    rsiBullish,
    macdBullish,
    volSpike,
  ];

  const sellConditions = [
    !priceAboveEma20,
    !ema20AboveEma50,
    rsiBearish,
    macdBearish,
    volSpike,
  ];

  const buyScore = buyConditions.filter(Boolean).length;
  const sellScore = sellConditions.filter(Boolean).length;

  let signal;
  if (buyScore >= 3 && buyScore > sellScore) {
    signal = 'BUY';
  } else if (sellScore >= 3 && sellScore > buyScore) {
    signal = 'SELL';
  } else {
    signal = 'HOLD';
  }

  // ── Confidence Score ──────────────────────────────────────────────────────
  let confidence = 0;
  if (signal === 'BUY' || signal === 'HOLD') {
    if (priceAboveEma20) confidence += 25;
    if (priceAboveEma50) confidence += 20;
    if (rsiBullish) confidence += 20;
    if (macdBullish) confidence += 20;
    if (volSpike) confidence += 15;
  } else {
    // SELL
    if (!priceAboveEma20) confidence += 25;
    if (!priceAboveEma50) confidence += 20;
    if (rsiBearish) confidence += 20;
    if (macdBearish) confidence += 20;
    if (volSpike) confidence += 15;
  }
  confidence = Math.min(100, Math.max(0, confidence));

  // ── Entry, SL, Targets ────────────────────────────────────────────────────
  const effectiveATR = atr ?? currentPrice * 0.01; // fallback 1% of price
  let entry, stopLoss, target1, target2;

  if (signal === 'BUY' || signal === 'HOLD') {
    entry = currentPrice;
    stopLoss = parseFloat((entry - effectiveATR).toFixed(2));
    target1 = parseFloat((entry + effectiveATR * 2).toFixed(2));
    target2 = parseFloat((entry + effectiveATR * 3).toFixed(2));
  } else {
    // SELL
    entry = currentPrice;
    stopLoss = parseFloat((entry + effectiveATR).toFixed(2));
    target1 = parseFloat((entry - effectiveATR * 2).toFixed(2));
    target2 = parseFloat((entry - effectiveATR * 3).toFixed(2));
  }

  // ── Reasons ───────────────────────────────────────────────────────────────
  const reasons = buildReasons({
    signal,
    priceAboveEma20,
    ema20AboveEma50,
    priceAboveEma50,
    rsiBullish,
    rsiBearish,
    rsiNeutral,
    rsi,
    macdBullish,
    macdResult,
    volSpike,
    volRatio,
  });

  return {
    symbol: symbol.toUpperCase(),
    currentPrice: parseFloat(currentPrice.toFixed(2)),
    signal,
    confidence,
    entry: parseFloat(entry.toFixed(2)),
    stopLoss,
    target1,
    target2,
    reasons,
    indicators: {
      ema20: ema20 ? parseFloat(ema20.toFixed(2)) : null,
      ema50: ema50 ? parseFloat(ema50.toFixed(2)) : null,
      rsi: rsi ? parseFloat(rsi.toFixed(2)) : null,
      macd: macdResult.macd ? parseFloat(macdResult.macd.toFixed(4)) : null,
      macdSignal: macdResult.signal ? parseFloat(macdResult.signal.toFixed(4)) : null,
      atr: effectiveATR ? parseFloat(effectiveATR.toFixed(2)) : null,
      volumeAvg: Math.round(volumeAvg),
      currentVolume,
    },
  };
};

// ─── Helper: Build Human-Readable Reasons ────────────────────────────────────
const buildReasons = ({
  signal, priceAboveEma20, ema20AboveEma50, priceAboveEma50,
  rsiBullish, rsiBearish, rsiNeutral, rsi,
  macdBullish, macdResult, volSpike, volRatio,
}) => {
  const reasons = [];

  if (priceAboveEma20) {
    reasons.push('✓ Price is above EMA20 (short-term bullish trend)');
  } else {
    reasons.push('✗ Price is below EMA20 (short-term bearish pressure)');
  }

  if (ema20AboveEma50) {
    reasons.push('✓ EMA20 is above EMA50 (bullish trend alignment)');
  } else {
    reasons.push('✗ EMA20 is below EMA50 (bearish trend alignment)');
  }

  if (priceAboveEma50) {
    reasons.push('✓ Price is above EMA50 (medium-term bullish)');
  } else {
    reasons.push('✗ Price is below EMA50 (medium-term bearish)');
  }

  if (rsiBullish) {
    reasons.push(`✓ RSI at ${rsi?.toFixed(1)} — bullish momentum (>55)`);
  } else if (rsiBearish) {
    reasons.push(`✗ RSI at ${rsi?.toFixed(1)} — bearish momentum (<45)`);
  } else {
    reasons.push(`⚠ RSI at ${rsi?.toFixed(1)} — neutral zone (45–55)`);
  }

  if (macdBullish) {
    if (macdResult.crossover) {
      reasons.push('✓ MACD bullish crossover detected');
    } else {
      reasons.push('✓ MACD is above signal line (bullish)');
    }
  } else {
    reasons.push('✗ MACD is below signal line (bearish)');
  }

  if (volSpike) {
    reasons.push(`✓ Volume spike: ${volRatio.toFixed(1)}× average (strong conviction)`);
  } else {
    reasons.push(`⚠ Volume at ${volRatio.toFixed(1)}× average (no spike)`);
  }

  return reasons;
};

// ─── Insufficient Data Fallback ───────────────────────────────────────────────
const buildInsufficientDataResponse = (symbol, currentPrice) => ({
  symbol: symbol.toUpperCase(),
  currentPrice: parseFloat((currentPrice || 0).toFixed(2)),
  signal: 'HOLD',
  confidence: 0,
  entry: parseFloat((currentPrice || 0).toFixed(2)),
  stopLoss: parseFloat(((currentPrice || 0) * 0.99).toFixed(2)),
  target1: parseFloat(((currentPrice || 0) * 1.02).toFixed(2)),
  target2: parseFloat(((currentPrice || 0) * 1.03).toFixed(2)),
  reasons: ['⚠ Insufficient historical data for full analysis'],
  indicators: {},
});
