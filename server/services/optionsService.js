/**
 * optionsService.js
 * Generates options trading signal (CE/PE) for index options.
 * Supports: NIFTY, BANKNIFTY
 */

// ── Strike step sizes ───────────────────────────────────────────────────────
const STRIKE_STEP = {
  NIFTY:      50,
  BANKNIFTY:  100,
  SENSEX:     100,
  NIFTY50:    50,
  NIFTYBANK:  100,
};

// Default step for unknown indices
const DEFAULT_STEP = 50;

/**
 * Get nearest ATM strike for a given price and step.
 */
const getATMStrike = (price, step) => Math.round(price / step) * step;

/**
 * Get next Thursday expiry date from today.
 */
const getNextExpiry = () => {
  const today = new Date();
  const day = today.getDay(); // 0=Sun,1=Mon,...,4=Thu,5=Fri,6=Sat
  const daysToThursday = (4 - day + 7) % 7 || 7; // always go to NEXT Thursday
  const expiry = new Date(today);
  expiry.setDate(today.getDate() + daysToThursday);
  return expiry.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

/**
 * Generate options signal.
 *
 * @param {string} symbol        - Index symbol (NIFTY, BANKNIFTY, SENSEX)
 * @param {number} currentPrice  - Spot price
 * @param {string} signal        - BUY | SELL | HOLD
 * @param {number} atr           - ATR value from signal engine
 * @param {number} confidence    - Signal confidence 0-100
 * @returns {OptionsSignalResult}
 */
export const getOptionsSignal = (symbol, currentPrice, signal, atr, confidence) => {
  const step = STRIKE_STEP[symbol.toUpperCase()] || DEFAULT_STEP;
  const atm  = getATMStrike(currentPrice, step);
  const expiry = getNextExpiry();

  const effectiveATR = atr || currentPrice * 0.01;

  let optionType, recommendedStrike, rationale;
  let entryPremiumEst, slPremiumEst, targetPremiumEst;

  if (signal === 'BUY') {
    optionType = 'CE';
    // For strong bullish signal: ATM CE; for moderate: ATM+1 step (slightly OTM)
    recommendedStrike = confidence >= 75 ? atm : atm + step;
    rationale = `Bullish signal on ${symbol}. Price trending above key EMAs with RSI momentum. Buy Call Option (CE).`;
    entryPremiumEst   = parseFloat((effectiveATR * 0.8).toFixed(2));
    slPremiumEst      = parseFloat((entryPremiumEst * 0.5).toFixed(2));
    targetPremiumEst  = parseFloat((entryPremiumEst * 2.0).toFixed(2));
  } else if (signal === 'SELL') {
    optionType = 'PE';
    recommendedStrike = confidence >= 75 ? atm : atm - step;
    rationale = `Bearish signal on ${symbol}. Price below EMAs with RSI weakness. Buy Put Option (PE).`;
    entryPremiumEst   = parseFloat((effectiveATR * 0.8).toFixed(2));
    slPremiumEst      = parseFloat((entryPremiumEst * 0.5).toFixed(2));
    targetPremiumEst  = parseFloat((entryPremiumEst * 2.0).toFixed(2));
  } else {
    // HOLD — no option trade
    return {
      symbol,
      spotPrice: currentPrice,
      signal: 'HOLD',
      optionType: null,
      recommendedStrike: atm,
      expiry,
      rationale: 'No strong directional signal. Avoid option trades in choppy market.',
      strikes: buildStrikeTable(atm, step, currentPrice),
      entryPremiumEst: null,
      slPremiumEst: null,
      targetPremiumEst: null,
    };
  }

  return {
    symbol,
    spotPrice: currentPrice,
    signal,
    optionType,
    recommendedStrike,
    expiry,
    contract: `${symbol} ${recommendedStrike} ${optionType}`,
    rationale,
    strikes: buildStrikeTable(atm, step, currentPrice),
    entryPremiumEst,
    slPremiumEst,
    targetPremiumEst,
    riskRewardRatio: '1:2',
    disclaimer: 'Option premium estimates are approximate (ATR-based). Check live LTP on NSE/broker before trading.',
  };
};

/**
 * Build a strike table showing OTM/ATM/ITM strikes for both CE and PE.
 */
const buildStrikeTable = (atm, step, spot) => {
  const strikes = [];
  for (let i = -2; i <= 2; i++) {
    const strike = atm + i * step;
    const moneynessCE = spot > strike ? 'ITM' : spot === strike ? 'ATM' : 'OTM';
    const moneynessPE = spot < strike ? 'ITM' : spot === strike ? 'ATM' : 'OTM';
    strikes.push({
      strike,
      ceMoneyness: moneynessCE,
      peMoneyness: moneynessPE,
      isATM: i === 0,
    });
  }
  return strikes;
};

// ── Supported index symbols ─────────────────────────────────────────────────
export const OPTION_ELIGIBLE = new Set(['NIFTY', 'BANKNIFTY', 'SENSEX', 'NIFTY50', 'NIFTYBANK']);

export const isOptionEligible = (symbol) => OPTION_ELIGIBLE.has(symbol.toUpperCase());
