import { getMarketOverview, getGainersAndLosers } from '../services/marketDataService.js';

/**
 * GET /api/market/overview
 * Returns NIFTY, BANKNIFTY, SENSEX current prices and change.
 */
export const getOverview = async (req, res, next) => {
  try {
    const data = await getMarketOverview();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/market/gainers
 * Returns top 10 gainers from NSE universe.
 */
export const getGainers = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const { gainers } = await getGainersAndLosers(limit);
    res.json({ success: true, data: gainers });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/market/losers
 * Returns top 10 losers from NSE universe.
 */
export const getLosers = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const { losers } = await getGainersAndLosers(limit);
    res.json({ success: true, data: losers });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/market/movers
 * Returns both gainers and losers in one call (used by dashboard).
 */
export const getMovers = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const { gainers, losers } = await getGainersAndLosers(limit);
    res.json({ success: true, data: { gainers, losers } });
  } catch (err) {
    next(err);
  }
};
