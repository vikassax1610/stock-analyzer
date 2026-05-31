/**
 * marketDataService.js
 * Abstraction layer for market data — currently backed by Yahoo Finance.
 * Swap provider by changing only this file.
 */

import YahooFinanceClass from 'yahoo-finance2';
// yahoo-finance2 v3: default export is the class — must instantiate
const yahooFinance = new YahooFinanceClass({ suppressNotices: ['yahooSurvey', 'ripHistorical'] });

// ─── Suffix Mapping ────────────────────────────────────────────────────────────
// Maps clean user-entered symbols to Yahoo Finance tickers
const INDEX_MAP = {
  NIFTY: '^NSEI',
  BANKNIFTY: '^NSEBANK',
  SENSEX: '^BSESN',
  NIFTY50: '^NSEI',
  NIFTYBANK: '^NSEBANK',
};

// NSE large-cap universe used for gainers/losers computation
export const NSE_UNIVERSE = [
  'RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK',
  'HINDUNILVR', 'SBIN', 'BHARTIARTL', 'KOTAKBANK', 'LT',
  'AXISBANK', 'BAJFINANCE', 'ASIANPAINT', 'MARUTI', 'TITAN',
  'NESTLEIND', 'WIPRO', 'ULTRACEMCO', 'POWERGRID', 'NTPC',
  'SUNPHARMA', 'TECHM', 'HCLTECH', 'ONGC', 'JSWSTEEL',
  'TATASTEEL', 'ADANIENT', 'ADANIPORTS', 'COALINDIA', 'BAJAJFINSV',
  'DIVISLAB', 'DRREDDY', 'CIPLA', 'EICHERMOT', 'HEROMOTOCO',
  'BPCL', 'GRASIM', 'HINDALCO', 'INDUSINDBK', 'M&M',
];

/**
 * Converts a user-entered symbol to Yahoo Finance ticker.
 * e.g., RELIANCE → RELIANCE.NS, NIFTY → ^NSEI
 */
export const toYahooSymbol = (symbol) => {
  const upper = symbol.toUpperCase().trim();
  if (INDEX_MAP[upper]) return INDEX_MAP[upper];
  // Already has suffix
  if (upper.includes('.')) return upper;
  return `${upper}.NS`;
};

/**
 * Fetch current quote for a symbol.
 * Returns: { symbol, price, change, changePercent, volume, open, high, low, previousClose }
 */
export const getQuote = async (symbol) => {
  const ticker = toYahooSymbol(symbol);
  try {
    const quote = await yahooFinance.quote(ticker, {}, { validateResult: false });
    return {
      symbol: symbol.toUpperCase(),
      ticker,
      price: quote.regularMarketPrice ?? 0,
      change: quote.regularMarketChange ?? 0,
      changePercent: quote.regularMarketChangePercent ?? 0,
      volume: quote.regularMarketVolume ?? 0,
      open: quote.regularMarketOpen ?? 0,
      high: quote.regularMarketDayHigh ?? 0,
      low: quote.regularMarketDayLow ?? 0,
      previousClose: quote.regularMarketPreviousClose ?? 0,
      marketCap: quote.marketCap ?? 0,
      name: quote.longName || quote.shortName || symbol.toUpperCase(),
    };
  } catch (err) {
    throw new Error(`Failed to fetch quote for ${symbol}: ${err.message}`);
  }
};

/**
 * Fetch historical OHLCV data for indicator calculation.
 * Returns array of { date, open, high, low, close, volume }
 * Default: 6 months of daily data (enough for EMA50, MACD etc.)
 */
export const getHistoricalData = async (symbol, period = '6mo', interval = '1d') => {
  const ticker = toYahooSymbol(symbol);
  try {
    // yahoo-finance2 v3: use chart() directly (historical() is deprecated)
    const result = await yahooFinance.chart(ticker, {
      period1: getStartDate(period).toISOString(),
      period2: new Date().toISOString(),
      interval,
    });

    const quotes = result?.quotes;
    if (!quotes || quotes.length === 0) {
      throw new Error(`No historical data for ${symbol}`);
    }

    return quotes
      .filter(d => d.close != null)
      .map(d => ({
        date: d.date,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
        volume: d.volume ?? 0,
      }));
  } catch (err) {
    throw new Error(`Failed to fetch history for ${symbol}: ${err.message}`);
  }
};

/**
 * Get market overview — NIFTY, BANKNIFTY, SENSEX
 */
export const getMarketOverview = async () => {
  const indices = ['NIFTY', 'BANKNIFTY', 'SENSEX'];
  const results = await Promise.allSettled(indices.map(idx => getQuote(idx)));
  return results.map((r, i) => {
    if (r.status === 'fulfilled') return r.value;
    return { symbol: indices[i], price: 0, change: 0, changePercent: 0, error: r.reason?.message };
  });
};

/**
 * Get top gainers and losers from NSE universe.
 * Fetches quotes in batches then sorts by changePercent.
 */
export const getGainersAndLosers = async (limit = 10) => {
  // Fetch all quotes in parallel (batched to avoid rate limits)
  const BATCH_SIZE = 10;
  const quotes = [];

  for (let i = 0; i < NSE_UNIVERSE.length; i += BATCH_SIZE) {
    const batch = NSE_UNIVERSE.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.allSettled(batch.map(s => getQuote(s)));
    batchResults.forEach((r, j) => {
      if (r.status === 'fulfilled') quotes.push(r.value);
    });
    // Small delay between batches to respect rate limits
    if (i + BATCH_SIZE < NSE_UNIVERSE.length) {
      await sleep(200);
    }
  }

  const sorted = [...quotes].sort((a, b) => b.changePercent - a.changePercent);
  return {
    gainers: sorted.slice(0, limit),
    losers: sorted.slice(-limit).reverse(),
  };
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const getStartDate = (period) => {
  const now = new Date();
  const map = {
    '1mo': 30, '3mo': 90, '6mo': 180, '1y': 365, '2y': 730,
  };
  const days = map[period] || 180;
  now.setDate(now.getDate() - days);
  return now;
};
