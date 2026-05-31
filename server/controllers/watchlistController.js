import Watchlist from '../models/Watchlist.js';

/**
 * GET /api/watchlist
 */
export const getWatchlist = async (req, res, next) => {
  try {
    const items = await Watchlist.find().sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/watchlist
 * Body: { symbol, companyName? }
 */
export const addToWatchlist = async (req, res, next) => {
  try {
    const { symbol, companyName } = req.body;
    if (!symbol) return res.status(400).json({ success: false, message: 'symbol is required' });

    const item = await Watchlist.findOneAndUpdate(
      { symbol: symbol.toUpperCase() },
      { symbol: symbol.toUpperCase(), companyName: companyName || '' },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/watchlist/:symbol
 */
export const removeFromWatchlist = async (req, res, next) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    await Watchlist.findOneAndDelete({ symbol });
    res.json({ success: true, message: `${symbol} removed from watchlist` });
  } catch (err) {
    next(err);
  }
};
