import { getQuote, getHistoricalData, NSE_UNIVERSE } from '../services/marketDataService.js';
import { generateSignal } from '../indicators/signalEngine.js';

// ── In-memory cache (15 min TTL) ─────────────────────────────────────────────
let _cache = null;
let _cacheTime = 0;
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

/**
 * GET /api/market/recommendations
 * Scans NSE universe, runs signal engine, returns top BUY picks sorted by confidence.
 */
export const getRecommendations = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const minPrice = parseFloat(req.query.minPrice) || 0;
    const maxPrice = parseFloat(req.query.maxPrice) || Infinity;

    // Return cached result if still fresh
    if (_cache && Date.now() - _cacheTime < CACHE_TTL) {
      const filtered = _cache.filter(r => r.price >= minPrice && r.price <= maxPrice);
      return res.json({
        success: true,
        data: filtered.slice(0, limit),
        cached: true,
        generatedAt: new Date(_cacheTime).toISOString(),
      });
    }

    console.log('[Recommendations] Scanning NSE universe for top picks...');

    // Process in batches of 5 to avoid rate limits
    const BATCH = 5;
    const results = [];

    for (let i = 0; i < NSE_UNIVERSE.length; i += BATCH) {
      const batch = NSE_UNIVERSE.slice(i, i + BATCH);
      const batchResults = await Promise.allSettled(
        batch.map(async (symbol) => {
          try {
            const [quote, candles] = await Promise.all([
              getQuote(symbol),
              getHistoricalData(symbol, '6mo', '1d'),
            ]);
            const signal = generateSignal(symbol, quote.price, quote.volume, candles);
            return {
              symbol,
              name: quote.name,
              price: quote.price,
              change: parseFloat(quote.change.toFixed(2)),
              changePercent: parseFloat(quote.changePercent.toFixed(2)),
              signal: signal.signal,
              confidence: signal.confidence,
              entry: signal.entry,
              stopLoss: signal.stopLoss,
              target1: signal.target1,
              target2: signal.target2,
              rsi: signal.indicators?.rsi,
            };
          } catch {
            return null;
          }
        })
      );

      batchResults.forEach(r => {
        if (r.status === 'fulfilled' && r.value) results.push(r.value);
      });

      // Small delay between batches
      if (i + BATCH < NSE_UNIVERSE.length) {
        await new Promise(r => setTimeout(r, 300));
      }
    }

    // Filter BUY signals and sort by confidence
    const buySignals = results
      .filter(r => r.signal === 'BUY')
      .sort((a, b) => b.confidence - a.confidence);

    // Cache result
    _cache = buySignals;
    _cacheTime = Date.now();

    console.log(`[Recommendations] Found ${buySignals.length} BUY signals`);

    const filtered = buySignals.filter(r => r.price >= minPrice && r.price <= maxPrice);

    res.json({
      success: true,
      data: filtered.slice(0, limit),
      cached: false,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/market/recommendations/refresh
 * Manually invalidate cache and regenerate.
 */
export const refreshRecommendations = async (req, res, next) => {
  _cache = null;
  _cacheTime = 0;
  return getRecommendations(req, res, next);
};
