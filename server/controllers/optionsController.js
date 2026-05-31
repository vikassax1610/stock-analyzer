import { getQuote, getHistoricalData } from '../services/marketDataService.js';
import { generateSignal } from '../indicators/signalEngine.js';
import { getOptionsSignal, isOptionEligible } from '../services/optionsService.js';

/**
 * GET /api/options/:symbol
 * Returns CE/PE options signal for index symbols (NIFTY, BANKNIFTY, SENSEX).
 */
export const getOptionSignal = async (req, res, next) => {
  try {
    const symbol = req.params.symbol.toUpperCase().trim();

    if (!isOptionEligible(symbol)) {
      return res.status(400).json({
        success: false,
        error: `Options signals are only available for index symbols: NIFTY, BANKNIFTY, SENSEX. Got: ${symbol}`,
      });
    }

    // Get underlying signal
    const [quote, candles] = await Promise.all([
      getQuote(symbol),
      getHistoricalData(symbol, '6mo', '1d'),
    ]);

    const signal = generateSignal(symbol, quote.price, quote.volume, candles);

    // Generate options recommendation
    const options = getOptionsSignal(
      symbol,
      quote.price,
      signal.signal,
      signal.indicators?.atr,
      signal.confidence
    );

    res.json({
      success: true,
      data: {
        underlying: {
          symbol,
          price: quote.price,
          signal: signal.signal,
          confidence: signal.confidence,
        },
        options,
      },
    });
  } catch (err) {
    next(err);
  }
};
