import Signal from '../models/Signal.js';

/**
 * GET /api/signals/recent
 * Returns the most recent N signals generated.
 */
export const getRecentSignals = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const signals = await Signal.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('symbol signal confidence currentPrice createdAt');
    res.json({ success: true, data: signals });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/signals/history/:symbol
 * Returns signal history for a specific stock.
 */
export const getSignalHistory = async (req, res, next) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const limit = parseInt(req.query.limit) || 50;
    const signals = await Signal.find({ symbol })
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json({ success: true, data: signals });
  } catch (err) {
    next(err);
  }
};
